import * as XLSX from "xlsx";

import type {
  ImportedCellValue,
  ImportFileType,
  ImportSheet,
  ParsedImportFile,
} from "@/types/import";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const SUPPORTED_FILE_TYPES = new Set<ImportFileType>([
  "xlsx",
  "xls",
  "csv",
]);

function getFileType(fileName: string): ImportFileType {
  const extension = fileName
    .split(".")
    .pop()
    ?.trim()
    .toLowerCase();

  if (
    !extension ||
    !SUPPORTED_FILE_TYPES.has(extension as ImportFileType)
  ) {
    throw new Error(
      "Unsupported file type. Select an XLSX, XLS, or CSV file.",
    );
  }

  return extension as ImportFileType;
}

function normalizeCellValue(value: unknown): ImportedCellValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return String(value);
}

function normalizeRows(rawRows: unknown[][]): {
  rows: ImportedCellValue[][];
  maximumColumnCount: number;
} {
  const populatedRows = rawRows
    .map((row) => row.map(normalizeCellValue))
    .filter((row) =>
      row.some(
        (value) =>
          value !== null &&
          !(typeof value === "string" && value.trim() === ""),
      ),
    );

  const maximumColumnCount = populatedRows.reduce(
    (largestColumnCount, row) =>
      Math.max(largestColumnCount, row.length),
    0,
  );

  const rows = populatedRows.map((row) =>
    Array.from(
      { length: maximumColumnCount },
      (_, columnIndex) => row[columnIndex] ?? null,
    ),
  );

  return {
    rows,
    maximumColumnCount,
  };
}

function parseWorksheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
): ImportSheet {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Worksheet "${sheetName}" could not be read.`);
  }

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(
    worksheet,
    {
      header: 1,
      raw: true,
      defval: null,
      blankrows: false,
    },
  );

  const normalizedSheet = normalizeRows(rawRows);

  return {
    name: sheetName,
    rows: normalizedSheet.rows,
    maximumColumnCount: normalizedSheet.maximumColumnCount,
  };
}

function hasUtf16LittleEndianBom(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 2 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xfe
  );
}

function hasUtf16BigEndianBom(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 2 &&
    bytes[0] === 0xfe &&
    bytes[1] === 0xff
  );
}

function decodeCsvBytes(fileData: ArrayBuffer): string {
  const bytes = new Uint8Array(fileData);

  if (hasUtf16LittleEndianBom(bytes)) {
    return new TextDecoder("utf-16le").decode(bytes);
  }

  if (hasUtf16BigEndianBom(bytes)) {
    return new TextDecoder("utf-16be").decode(bytes);
  }

  /*
   * Most modern CSV files are UTF-8. Using fatal mode is
   * important because it lets us distinguish valid UTF-8 from
   * older Windows-1252 / ANSI files instead of silently inserting
   * replacement characters.
   */
  try {
    return new TextDecoder(
      "utf-8",
      {
        fatal: true,
      },
    ).decode(bytes);
  } catch {
    /*
     * Older Excel installations and other Windows applications
     * commonly create single-byte CSV files. Windows-1252 covers
     * the usual Western European characters while the browser
     * TextDecoder converts them into a normal JavaScript string.
     */
    return new TextDecoder(
      "windows-1252",
    ).decode(bytes);
  }
}

function readWorkbook(
  fileType: ImportFileType,
  fileData: ArrayBuffer,
): XLSX.WorkBook {
  if (fileType === "csv") {
    const csvText = decodeCsvBytes(fileData);

    /*
     * The CSV bytes have already been decoded into a Unicode
     * JavaScript string. Passing type="string" prevents SheetJS
     * from interpreting the raw UTF-8 bytes as a legacy codepage.
     *
     * SheetJS still performs its normal delimiter detection, so
     * comma-, semicolon-, tab- and pipe-separated files remain
     * supported.
     */
    return XLSX.read(
      csvText,
      {
        type: "string",
        cellDates: true,
      },
    );
  }

  /*
   * XLSX and XLS are binary workbook formats. They must continue
   * to be passed as raw bytes.
   */
  return XLSX.read(
    fileData,
    {
      type: "array",
      cellDates: true,
    },
  );
}

export async function parseImportFile(
  file: File,
): Promise<ParsedImportFile> {
  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      "The selected file exceeds the 25 MB file size limit.",
    );
  }

  const fileType = getFileType(file.name);
  const fileData = await file.arrayBuffer();

  const workbook = readWorkbook(
    fileType,
    fileData,
  );

  const sheets = workbook.SheetNames.map((sheetName) =>
    parseWorksheet(
      workbook,
      sheetName,
    ),
  );

  if (sheets.length === 0) {
    throw new Error(
      "The selected file does not contain a readable worksheet.",
    );
  }

  return {
    fileName: file.name,
    fileType,
    sheets,
  };
}
