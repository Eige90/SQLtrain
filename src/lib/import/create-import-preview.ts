import { detectColumnType } from "@/lib/import/detect-column-type";
import {
  makeColumnNamesUnique,
  normalizeColumnName,
} from "@/lib/import/normalize-column-name";

import type { DatabaseValue } from "@/types/database";
import type {
  ImportedCellValue,
  ImportPreview,
  ImportSheet,
} from "@/types/import";

function isEmptyCell(value: ImportedCellValue): boolean {
  return (
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function createSourceColumnName(
  value: ImportedCellValue | undefined,
  columnIndex: number,
): string {
  const rawName =
    value === null || value === undefined
      ? ""
      : String(value).trim();

  return rawName || `Column ${columnIndex + 1}`;
}

function toDatabaseValue(
  value: ImportedCellValue,
): DatabaseValue {
  if (value === null) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString();
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return value;
}

export function createImportPreview(
  sheet: ImportSheet,
  useFirstRowAsHeader: boolean,
): ImportPreview {
  const columnCount = sheet.maximumColumnCount;

  if (columnCount === 0) {
    return {
      columns: [],
      rows: [],
      totalRows: 0,
    };
  }

  const headerRow = useFirstRowAsHeader
    ? sheet.rows[0] ?? []
    : [];

  const sourceNames = Array.from(
    { length: columnCount },
    (_, columnIndex) =>
      createSourceColumnName(
        headerRow[columnIndex],
        columnIndex,
      ),
  );

  const targetNames = makeColumnNamesUnique(
    sourceNames.map((sourceName, columnIndex) =>
      normalizeColumnName(sourceName, columnIndex),
    ),
  );

  const sourceRows = useFirstRowAsHeader
    ? sheet.rows.slice(1)
    : sheet.rows;

  const populatedRows = sourceRows.filter((row) =>
    row.some((value) => !isEmptyCell(value)),
  );

  const columns = sourceNames.map(
    (sourceName, columnIndex) => ({
      sourceName,
      targetName: targetNames[columnIndex],
      detectedType: detectColumnType(
        populatedRows.map(
          (row) => row[columnIndex] ?? null,
        ),
      ),
      include: true,
    }),
  );

  const rows = populatedRows.map((row) =>
    Array.from(
      { length: columnCount },
      (_, columnIndex) =>
        toDatabaseValue(row[columnIndex] ?? null),
    ),
  );

  return {
    columns,
    rows,
    totalRows: rows.length,
  };
}
