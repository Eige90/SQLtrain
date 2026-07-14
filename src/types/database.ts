export type DatabaseValue =
  | string
  | number
  | bigint
  | null
  | Uint8Array
  | Int8Array
  | ArrayBuffer;

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
