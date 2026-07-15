import type { DatabaseValue } from "@/types/database";

export type ImportFileType = "xlsx" | "xls" | "csv";

export type ImportMode = "create" | "append" | "replace";

export type ImportedCellValue =
  | string
  | number
  | boolean
  | Date
  | null;

export type ImportColumnType =
  | "INTEGER"
  | "REAL"
  | "TEXT"
  | "BOOLEAN"
  | "DATE";

export type ImportColumn = {
  sourceName: string;
  targetName: string;
  detectedType: ImportColumnType;
  include: boolean;
};

export type ImportSheet = {
  name: string;
  rows: ImportedCellValue[][];
  maximumColumnCount: number;
};

export type ParsedImportFile = {
  fileName: string;
  fileType: ImportFileType;
  sheets: ImportSheet[];
};

export type ImportPreview = {
  columns: ImportColumn[];
  rows: DatabaseValue[][];
  totalRows: number;
};

export type ImportRequest = {
  tableName: string;
  mode: ImportMode;
  columns: ImportColumn[];
  rows: DatabaseValue[][];
};

export type ImportResult = {
  tableName: string;
  importedRows: number;
  mode: ImportMode;
};
