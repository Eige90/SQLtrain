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

  const workbook = XLSX.read(fileData, {
    type: "array",
    cellDates: true,
  });

  const sheets = workbook.SheetNames.map((sheetName) =>
    parseWorksheet(workbook, sheetName),
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
