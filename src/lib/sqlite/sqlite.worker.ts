/// <reference lib="webworker" />

import sqlite3InitModule, {
  type Database,
  type SqlValue,
} from "@sqlite.org/sqlite-wasm";

import type {
  DatabaseColumn,
  DatabaseRecord,
  DatabaseTableData,
  DatabaseTableSummary,
  DatabaseValue,
  DeleteRowInput,
  InsertRowInput,
  QueryResult,
  UpdateRowInput,
} from "../../types/database";

type WorkerRequest =
  | { id: string; type: "initialize" }
  | { id: string; type: "execute"; sql: string }
  | { id: string; type: "listTables" }
  | {
      id: string;
      type: "getTableData";
      tableName: string;
      limit: number;
      offset: number;
    }
  | { id: string; type: "insertRow"; input: InsertRowInput }
  | { id: string; type: "updateRow"; input: UpdateRowInput }
  | { id: string; type: "deleteRow"; input: DeleteRowInput }
  | { id: string; type: "reset" };

type WorkerResponse =
  | { id: string; ok: true; result: unknown }
  | { id: string; ok: false; error: string };

type MutationResult = {
  affectedRows: number;
};

type IdentityPredicate = {
  sql: string;
  values: SqlValue[];
};

const TABLE_ORDER = [
  "Customers",
  "Categories",
  "Employees",
  "OrderDetails",
  "Orders",
  "Products",
  "Shippers",
  "Suppliers",
] as const;

const ROW_IDENTITY_KEY = "__sqltrain_rowid__";
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

const workerScope = self as DedicatedWorkerGlobalScope;

let databasePromise: Promise<Database> | null = null;
let seedSqlPromise: Promise<string> | null = null;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown SQLite error.";
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function normalizeSqlValue(value: DatabaseValue): SqlValue {
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (value instanceof Int8Array) {
    const bytes = new Uint8Array(value.byteLength);

    bytes.set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );

    return bytes;
  }

  return value;
}

function selectRows(
  database: Database,
  sql: string,
  bind: SqlValue[] = [],
): SqlValue[][] {
  if (bind.length === 0) {
    return database.exec({
      sql,
      rowMode: "array",
      returnValue: "resultRows",
    }) as SqlValue[][];
  }

  return database.exec({
    sql,
    bind,
    rowMode: "array",
    returnValue: "resultRows",
  }) as SqlValue[][];
}

function executeMutation(
  database: Database,
  sql: string,
  bind: SqlValue[] = [],
): MutationResult {
  const changesBefore = Number(database.changes(true));

  if (bind.length === 0) {
    database.exec(sql);
  } else {
    database.exec({
      sql,
      bind,
    });
  }

  const changesAfter = Number(database.changes(true));

  return {
    affectedRows: Math.max(0, changesAfter - changesBefore),
  };
}

function getSeedSql(): Promise<string> {
  if (!seedSqlPromise) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

    seedSqlPromise = fetch(`${basePath}/databases/northwind.sql`, {
      cache: "no-store",
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Could not load the Northwind seed file (${response.status}).`,
        );
      }

      return response.text();
    });
  }

  return seedSqlPromise;
}

async function createDatabase(): Promise<Database> {
  const sqlite3 = await sqlite3InitModule();
  const database = new sqlite3.oo1.DB(":memory:", "c");

  database.exec(await getSeedSql());

  return database;
}

function getDatabase(): Promise<Database> {
  if (!databasePromise) {
    databasePromise = createDatabase();
  }

  return databasePromise;
}

async function assertTableExists(
  database: Database,
  tableName: string,
): Promise<void> {
  const rows = selectRows(
    database,
    `
      SELECT 1
      FROM sqlite_master
      WHERE type = 'table'
        AND name = ?1
        AND name NOT LIKE 'sqlite_%'
      LIMIT 1;
    `,
    [tableName],
  );

  if (rows.length === 0) {
    throw new Error(`Table "${tableName}" does not exist.`);
  }
}

async function getTableColumns(
  database: Database,
  tableName: string,
): Promise<DatabaseColumn[]> {
  await assertTableExists(database, tableName);

  const rows = selectRows(
    database,
    `PRAGMA table_info(${quoteIdentifier(tableName)});`,
  );

  return rows.map((row) => ({
    name: String(row[1]),
    declaredType: String(row[2] ?? ""),
    notNull: Number(row[3] ?? 0) === 1,
    defaultValue: (row[4] ?? null) as DatabaseValue,
    primaryKeyOrder: Number(row[5] ?? 0),
  }));
}

function validateRecordColumns(
  columns: DatabaseColumn[],
  values: DatabaseRecord,
): void {
  const allowedColumns = new Set(columns.map((column) => column.name));

  for (const columnName of Object.keys(values)) {
    if (!allowedColumns.has(columnName)) {
      throw new Error(`Column "${columnName}" does not exist.`);
    }
  }
}

function buildIdentityPredicate(
  columns: DatabaseColumn[],
  identity: DatabaseRecord,
): IdentityPredicate {
  const identityKeys = Object.keys(identity);

  if (identityKeys.length === 0) {
    throw new Error("A row identity is required.");
  }

  const primaryKeyColumns = columns
    .filter((column) => column.primaryKeyOrder > 0)
    .sort(
      (left, right) => left.primaryKeyOrder - right.primaryKeyOrder,
    );

  if (
    identityKeys.length === 1 &&
    identityKeys[0] === ROW_IDENTITY_KEY
  ) {
    if (primaryKeyColumns.length > 0) {
      throw new Error("The supplied row identity is invalid.");
    }

    return {
      sql: "rowid IS ?",
      values: [normalizeSqlValue(identity[ROW_IDENTITY_KEY])],
    };
  }

  if (primaryKeyColumns.length === 0) {
    throw new Error("The supplied row identity is invalid.");
  }

  const expectedKeys = primaryKeyColumns.map((column) => column.name);

  if (
    identityKeys.length !== expectedKeys.length ||
    expectedKeys.some((columnName) => !(columnName in identity))
  ) {
    throw new Error("The supplied primary key is incomplete.");
  }

  return {
    sql: primaryKeyColumns
      .map((column) => `${quoteIdentifier(column.name)} IS ?`)
      .join(" AND "),
    values: primaryKeyColumns.map((column) =>
      normalizeSqlValue(identity[column.name]),
    ),
  };
}

async function executeSql(sql: string): Promise<QueryResult> {
  const database = await getDatabase();
  const columns: string[] = [];
  const rows: SqlValue[][] = [];
  const totalChangesBefore = Number(database.changes(true));
  const startedAt = performance.now();

  database.exec({
    sql,
    rowMode: "array",
    columnNames: columns,
    resultRows: rows,
  });

  const executionTimeMs = performance.now() - startedAt;
  const totalChangesAfter = Number(database.changes(true));

  return {
    columns,
    rows,
    affectedRows: Math.max(
      0,
      totalChangesAfter - totalChangesBefore,
    ),
    executionTimeMs,
  };
}

async function listTables(): Promise<DatabaseTableSummary[]> {
  const database = await getDatabase();

  const tableRows = selectRows(
    database,
    `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%';
    `,
  );

  const summaries = tableRows.map(([rawName]) => {
    const name = String(rawName);

    const countRows = selectRows(
      database,
      `SELECT COUNT(*) FROM ${quoteIdentifier(name)};`,
    );

    return {
      name,
      recordCount: Number(countRows[0]?.[0] ?? 0),
    };
  });

  return summaries.sort((left, right) => {
    const leftIndex = TABLE_ORDER.indexOf(
      left.name as (typeof TABLE_ORDER)[number],
    );

    const rightIndex = TABLE_ORDER.indexOf(
      right.name as (typeof TABLE_ORDER)[number],
    );

    const normalizedLeftIndex =
      leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;

    const normalizedRightIndex =
      rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    return (
      normalizedLeftIndex - normalizedRightIndex ||
      left.name.localeCompare(right.name)
    );
  });
}

async function getTableData(
  tableName: string,
  requestedLimit: number,
  requestedOffset: number,
): Promise<DatabaseTableData> {
  const database = await getDatabase();
  const columns = await getTableColumns(database, tableName);

  const limit = Math.min(
    Math.max(Math.trunc(requestedLimit || DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE,
  );

  const offset = Math.max(Math.trunc(requestedOffset || 0), 0);

  const countRows = selectRows(
    database,
    `SELECT COUNT(*) FROM ${quoteIdentifier(tableName)};`,
  );

  const totalRows = Number(countRows[0]?.[0] ?? 0);

  const primaryKeyColumns = columns
    .filter((column) => column.primaryKeyOrder > 0)
    .sort(
      (left, right) => left.primaryKeyOrder - right.primaryKeyOrder,
    );

  const selectedColumns = columns
    .map((column) => quoteIdentifier(column.name))
    .join(", ");

  const hasPrimaryKey = primaryKeyColumns.length > 0;

  const orderBy = hasPrimaryKey
    ? primaryKeyColumns
        .map((column) => quoteIdentifier(column.name))
        .join(", ")
    : "rowid";

  const selectList = hasPrimaryKey
    ? selectedColumns
    : `rowid AS ${quoteIdentifier(ROW_IDENTITY_KEY)}, ${selectedColumns}`;

  const rawRows = selectRows(
    database,
    `
      SELECT ${selectList}
      FROM ${quoteIdentifier(tableName)}
      ORDER BY ${orderBy}
      LIMIT ?1 OFFSET ?2;
    `,
    [limit, offset],
  );

  const valueOffset = hasPrimaryKey ? 0 : 1;

  const rows = rawRows.map((rawRow) => {
    const values: DatabaseRecord = {};

    columns.forEach((column, columnIndex) => {
      values[column.name] =
        (rawRow[columnIndex + valueOffset] ?? null) as DatabaseValue;
    });

    const identity: DatabaseRecord = {};

    if (hasPrimaryKey) {
      for (const primaryKeyColumn of primaryKeyColumns) {
        identity[primaryKeyColumn.name] =
          values[primaryKeyColumn.name] ?? null;
      }
    } else {
      identity[ROW_IDENTITY_KEY] =
        (rawRow[0] ?? null) as DatabaseValue;
    }

    return {
      values,
      identity,
    };
  });

  return {
    tableName,
    columns,
    rows,
    totalRows,
    limit,
    offset,
  };
}

async function insertRow(
  input: InsertRowInput,
): Promise<MutationResult> {
  const database = await getDatabase();
  const columns = await getTableColumns(database, input.tableName);

  validateRecordColumns(columns, input.values);

  const valueEntries = Object.entries(input.values);

  if (valueEntries.length === 0) {
    return executeMutation(
      database,
      `INSERT INTO ${quoteIdentifier(input.tableName)} DEFAULT VALUES;`,
    );
  }

  const columnSql = valueEntries
    .map(([columnName]) => quoteIdentifier(columnName))
    .join(", ");

  const placeholderSql = valueEntries.map(() => "?").join(", ");

  return executeMutation(
    database,
    `
      INSERT INTO ${quoteIdentifier(input.tableName)}
        (${columnSql})
      VALUES
        (${placeholderSql});
    `,
    valueEntries.map(([, value]) => normalizeSqlValue(value)),
  );
}

async function updateRow(
  input: UpdateRowInput,
): Promise<MutationResult> {
  const database = await getDatabase();
  const columns = await getTableColumns(database, input.tableName);

  validateRecordColumns(columns, input.values);

  const valueEntries = Object.entries(input.values);

  if (valueEntries.length === 0) {
    throw new Error("At least one value is required for an update.");
  }

  const identityPredicate = buildIdentityPredicate(
    columns,
    input.identity,
  );

  const setSql = valueEntries
    .map(([columnName]) => `${quoteIdentifier(columnName)} = ?`)
    .join(", ");

  const updateValues = valueEntries.map(([, value]) =>
    normalizeSqlValue(value),
  );

  return executeMutation(
    database,
    `
      UPDATE ${quoteIdentifier(input.tableName)}
      SET ${setSql}
      WHERE ${identityPredicate.sql};
    `,
    [...updateValues, ...identityPredicate.values],
  );
}

async function deleteRow(
  input: DeleteRowInput,
): Promise<MutationResult> {
  const database = await getDatabase();
  const columns = await getTableColumns(database, input.tableName);

  const identityPredicate = buildIdentityPredicate(
    columns,
    input.identity,
  );

  return executeMutation(
    database,
    `
      DELETE FROM ${quoteIdentifier(input.tableName)}
      WHERE ${identityPredicate.sql};
    `,
    identityPredicate.values,
  );
}

async function resetDatabase(): Promise<void> {
  const database = await getDatabase();

  database.exec(await getSeedSql());
}

function postSuccess(id: string, result: unknown): void {
  const response: WorkerResponse = {
    id,
    ok: true,
    result,
  };

  workerScope.postMessage(response);
}

function postError(id: string, error: unknown): void {
  const response: WorkerResponse = {
    id,
    ok: false,
    error: getErrorMessage(error),
  };

  workerScope.postMessage(response);
}

workerScope.addEventListener(
  "message",
  async (event: MessageEvent<WorkerRequest>) => {
    const request = event.data;

    try {
      switch (request.type) {
        case "initialize":
          await getDatabase();
          postSuccess(request.id, { ready: true });
          break;

        case "execute":
          postSuccess(request.id, await executeSql(request.sql));
          break;

        case "listTables":
          postSuccess(request.id, await listTables());
          break;

        case "getTableData":
          postSuccess(
            request.id,
            await getTableData(
              request.tableName,
              request.limit,
              request.offset,
            ),
          );
          break;

        case "insertRow":
          postSuccess(
            request.id,
            await insertRow(request.input),
          );
          break;

        case "updateRow":
          postSuccess(
            request.id,
            await updateRow(request.input),
          );
          break;

        case "deleteRow":
          postSuccess(
            request.id,
            await deleteRow(request.input),
          );
          break;

        case "reset":
          await resetDatabase();
          postSuccess(request.id, { reset: true });
          break;
      }
    } catch (error) {
      postError(request.id, error);
    }
  },
);

export {};
