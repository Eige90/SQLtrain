export type DatabaseValue =
  | string
  | number
  | bigint
  | null
  | Uint8Array
  | Int8Array
  | ArrayBuffer;

export type DatabaseRecord = Record<string, DatabaseValue>;

export type QueryResult = {
  columns: string[];
  rows: DatabaseValue[][];
  affectedRows: number;
  executionTimeMs: number;
};

export type DatabaseTableSummary = {
  name: string;
  recordCount: number;
};

export type DatabaseColumn = {
  name: string;
  declaredType: string;
  notNull: boolean;
  defaultValue: DatabaseValue;
  primaryKeyOrder: number;
};

export type DatabaseRow = {
  values: DatabaseRecord;
  identity: DatabaseRecord;
};

export type DatabaseTableData = {
  tableName: string;
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
  totalRows: number;
  limit: number;
  offset: number;
};

export type InsertRowInput = {
  tableName: string;
  values: DatabaseRecord;
};

export type UpdateRowInput = {
  tableName: string;
  identity: DatabaseRecord;
  values: DatabaseRecord;
};

export type DeleteRowInput = {
  tableName: string;
  identity: DatabaseRecord;
};

export type DatabaseStorageMode = "persistent" | "memory";

export type DatabaseInitializationResult = {
  ready: true;
  storageMode: DatabaseStorageMode;
  warning: string | null;
};
