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

import type {
  ImportColumn,
  ImportRequest,
  ImportResult,
} from "../../types/import";

import type {
  ColumnAffinity,
  CreateRelationshipResult,
  DatabaseRelationship,
  ReferentialAction,
  RelationshipInput,
  RelationshipValidationResult,
} from "../../types/relationship";

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
  | { id: string; type: "importData"; input: ImportRequest }
  | { id: string; type: "listRelationships" }
  | {
      id: string;
      type: "validateRelationship";
      input: RelationshipInput;
    }
  | {
      id: string;
      type: "createRelationship";
      input: RelationshipInput;
    }
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
const MAX_IMPORT_ROWS = 100_000;
const MAX_BOUND_PARAMETERS = 900;
const IMPORT_SAVEPOINT = "sqltrain_file_import";
const RELATIONSHIP_SAVEPOINT = "sqltrain_relationship";

const PERSISTENT_DATABASE_PATH = "/sqltrain.sqlite3";
const OPFS_POOL_NAME = "sqltrain-opfs-sahpool";
const OPFS_POOL_DIRECTORY = "/sqltrain-opfs-sahpool";
const OPFS_POOL_CAPACITY = 8;

const workerScope = self as DedicatedWorkerGlobalScope;

let databasePromise: Promise<Database> | null = null;
let seedSqlPromise: Promise<string> | null = null;

let storageMode: "persistent" | "memory" = "memory";
let storageWarning: string | null = null;

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

function databaseHasUserTables(
  database: Database,
): boolean {
  const rows = selectRows(
    database,
    `
      SELECT 1
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
      LIMIT 1;
    `,
  );

  return rows.length > 0;
}

async function seedDatabaseIfEmpty(
  database: Database,
): Promise<void> {
  if (!databaseHasUserTables(database)) {
    database.exec(await getSeedSql());
  }
}

async function createDatabase(): Promise<Database> {
  const sqlite3 = await sqlite3InitModule();

  try {
    const poolUtil = await sqlite3.installOpfsSAHPoolVfs({
      name: OPFS_POOL_NAME,
      directory: OPFS_POOL_DIRECTORY,
      initialCapacity: OPFS_POOL_CAPACITY,
    });

    const database = new poolUtil.OpfsSAHPoolDb(
      PERSISTENT_DATABASE_PATH,
    );

    await seedDatabaseIfEmpty(database);
    database.exec("PRAGMA foreign_keys = ON;");

    storageMode = "persistent";
    storageWarning = null;

    return database;
  } catch (persistentStorageError) {
    const database = new sqlite3.oo1.DB(":memory:", "c");

    database.exec(await getSeedSql());
    database.exec("PRAGMA foreign_keys = ON;");

    storageMode = "memory";
    storageWarning =
      "Persistent browser storage is unavailable. " +
      "Changes will be lost after reloading this page. " +
      getErrorMessage(persistentStorageError);

    return database;
  }
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

function validateImportTableName(tableName: string): string {
  const normalizedName = tableName.trim();

  if (!normalizedName) {
    throw new Error("A target table name is required.");
  }

  if (normalizedName.toLowerCase().startsWith("sqlite_")) {
    throw new Error(
      'Table names starting with "sqlite_" are reserved.',
    );
  }

  return normalizedName;
}

function tableExists(
  database: Database,
  tableName: string,
): boolean {
  const rows = selectRows(
    database,
    `
      SELECT 1
      FROM sqlite_master
      WHERE type = 'table'
        AND name = ?1
      LIMIT 1;
    `,
    [tableName],
  );

  return rows.length > 0;
}

function getIncludedImportColumns(
  columns: ImportColumn[],
): Array<{
  column: ImportColumn;
  sourceIndex: number;
}> {
  const includedColumns = columns
    .map((column, sourceIndex) => ({
      column,
      sourceIndex,
    }))
    .filter(({ column }) => column.include);

  if (includedColumns.length === 0) {
    throw new Error(
      "Select at least one column for the import.",
    );
  }

  const usedNames = new Set<string>();

  for (const { column } of includedColumns) {
    const targetName = column.targetName.trim();

    if (!targetName) {
      throw new Error(
        "Every included column requires a target name.",
      );
    }

    const normalizedName = targetName.toLowerCase();

    if (usedNames.has(normalizedName)) {
      throw new Error(
        `Duplicate target column "${targetName}".`,
      );
    }

    usedNames.add(normalizedName);
  }

  return includedColumns;
}

function getSqliteColumnType(
  column: ImportColumn,
): string {
  switch (column.detectedType) {
    case "INTEGER":
    case "REAL":
    case "TEXT":
      return column.detectedType;

    case "BOOLEAN":
      return "INTEGER";

    case "DATE":
      return "TEXT";
  }
}

function createImportTable(
  database: Database,
  tableName: string,
  columns: Array<{
    column: ImportColumn;
    sourceIndex: number;
  }>,
): void {
  const columnDefinitions = columns
    .map(
      ({ column }) =>
        `${quoteIdentifier(column.targetName.trim())} ${getSqliteColumnType(
          column,
        )}`,
    )
    .join(", ");

  database.exec(`
    CREATE TABLE ${quoteIdentifier(tableName)} (
      ${columnDefinitions}
    );
  `);
}

function insertImportRows(
  database: Database,
  tableName: string,
  targetColumnNames: string[],
  sourceColumnIndexes: number[],
  rows: DatabaseValue[][],
): number {
  if (rows.length === 0) {
    return 0;
  }

  const rowSize = targetColumnNames.length;
  const rowsPerBatch = Math.max(
    1,
    Math.floor(MAX_BOUND_PARAMETERS / rowSize),
  );

  const columnSql = targetColumnNames
    .map(quoteIdentifier)
    .join(", ");

  let importedRows = 0;

  for (
    let batchStart = 0;
    batchStart < rows.length;
    batchStart += rowsPerBatch
  ) {
    const batchRows = rows.slice(
      batchStart,
      batchStart + rowsPerBatch,
    );

    const placeholders = batchRows
      .map(
        () =>
          `(${targetColumnNames.map(() => "?").join(", ")})`,
      )
      .join(", ");

    const bindValues: SqlValue[] = [];

    for (const row of batchRows) {
      for (const sourceIndex of sourceColumnIndexes) {
        bindValues.push(
          normalizeSqlValue(row[sourceIndex] ?? null),
        );
      }
    }

    database.exec({
      sql: `
        INSERT INTO ${quoteIdentifier(tableName)}
          (${columnSql})
        VALUES
          ${placeholders};
      `,
      bind: bindValues,
    });

    importedRows += batchRows.length;
  }

  return importedRows;
}

async function importData(
  input: ImportRequest,
): Promise<ImportResult> {
  const database = await getDatabase();
  const tableName = validateImportTableName(input.tableName);

  if (input.rows.length === 0) {
    throw new Error("The import does not contain any data rows.");
  }

  if (input.rows.length > MAX_IMPORT_ROWS) {
    throw new Error(
      `A single import may contain at most ${MAX_IMPORT_ROWS.toLocaleString(
        "en-US",
      )} rows.`,
    );
  }

  const includedColumns = getIncludedImportColumns(
    input.columns,
  );

  database.exec(`SAVEPOINT ${IMPORT_SAVEPOINT};`);

  try {
    let targetColumnNames: string[];

    if (input.mode === "append") {
      const existingColumns = await getTableColumns(
        database,
        tableName,
      );

      const existingColumnsByName = new Map(
        existingColumns.map((column) => [
          column.name.toLowerCase(),
          column.name,
        ]),
      );

      targetColumnNames = includedColumns.map(
        ({ column }) => {
          const requestedName = column.targetName.trim();

          const existingName = existingColumnsByName.get(
            requestedName.toLowerCase(),
          );

          if (!existingName) {
            throw new Error(
              `Column "${requestedName}" does not exist in table "${tableName}".`,
            );
          }

          return existingName;
        },
      );
    } else {
      const alreadyExists = tableExists(database, tableName);

      if (input.mode === "create" && alreadyExists) {
        throw new Error(
          `Table "${tableName}" already exists.`,
        );
      }

      if (input.mode === "replace" && alreadyExists) {
        database.exec(
          `DROP TABLE ${quoteIdentifier(tableName)};`,
        );
      }

      createImportTable(
        database,
        tableName,
        includedColumns,
      );

      targetColumnNames = includedColumns.map(
        ({ column }) => column.targetName.trim(),
      );
    }

    const importedRows = insertImportRows(
      database,
      tableName,
      targetColumnNames,
      includedColumns.map(
        ({ sourceIndex }) => sourceIndex,
      ),
      input.rows,
    );

    database.exec(`RELEASE SAVEPOINT ${IMPORT_SAVEPOINT};`);

    return {
      tableName,
      importedRows,
      mode: input.mode,
    };
  } catch (error) {
    try {
      database.exec(
        `ROLLBACK TO SAVEPOINT ${IMPORT_SAVEPOINT};`,
      );

      database.exec(
        `RELEASE SAVEPOINT ${IMPORT_SAVEPOINT};`,
      );
    } catch {
      // Preserve the original import error.
    }

    throw error;
  }
}

const REFERENTIAL_ACTIONS =
  new Set<ReferentialAction>([
    "NO ACTION",
    "RESTRICT",
    "SET NULL",
    "SET DEFAULT",
    "CASCADE",
  ]);

type TableColumnInfo = {
  name: string;
  declaredType: string;
  primaryKeyOrder: number;
};

function normalizeReferentialAction(
  value: string,
): ReferentialAction {
  const normalized =
    value.trim().toUpperCase() as ReferentialAction;

  if (!REFERENTIAL_ACTIONS.has(normalized)) {
    throw new Error(
      `Unsupported referential action: ${value}`,
    );
  }

  return normalized;
}

function getColumnAffinity(
  declaredType: string,
): ColumnAffinity {
  const normalized = declaredType.trim().toUpperCase();

  if (normalized.includes("INT")) {
    return "INTEGER";
  }

  if (
    normalized.includes("CHAR") ||
    normalized.includes("CLOB") ||
    normalized.includes("TEXT")
  ) {
    return "TEXT";
  }

  if (
    normalized.length === 0 ||
    normalized.includes("BLOB")
  ) {
    return "BLOB";
  }

  if (
    normalized.includes("REAL") ||
    normalized.includes("FLOA") ||
    normalized.includes("DOUB")
  ) {
    return "REAL";
  }

  return "NUMERIC";
}

function affinitiesAreCompatible(
  parentAffinity: ColumnAffinity,
  childAffinity: ColumnAffinity,
): boolean {
  if (parentAffinity === childAffinity) {
    return true;
  }

  const numericAffinities = new Set<ColumnAffinity>([
    "INTEGER",
    "REAL",
    "NUMERIC",
  ]);

  return (
    numericAffinities.has(parentAffinity) &&
    numericAffinities.has(childAffinity)
  );
}

function getRelationshipTableColumns(
  database: Database,
  tableName: string,
): TableColumnInfo[] {
  const rows = selectRows(
    database,
    `PRAGMA table_info(${quoteIdentifier(tableName)});`,
  );

  return rows.map((row) => ({
    name: String(row[1] ?? ""),
    declaredType: String(row[2] ?? ""),
    primaryKeyOrder: Number(row[5] ?? 0),
  }));
}

function getTableColumn(
  database: Database,
  tableName: string,
  columnName: string,
): TableColumnInfo {
  const columns = getRelationshipTableColumns(database, tableName);

  if (columns.length === 0) {
    throw new Error(
      `Table "${tableName}" does not exist.`,
    );
  }

  const normalizedColumnName = columnName.toLowerCase();

  const column = columns.find(
    (candidate) =>
      candidate.name.toLowerCase() === normalizedColumnName,
  );

  if (!column) {
    throw new Error(
      `Column "${columnName}" does not exist in table "${tableName}".`,
    );
  }

  return column;
}

function countFirstValue(rows: SqlValue[][]): number {
  return Number(rows[0]?.[0] ?? 0);
}

function listRelationshipsFromDatabase(
  database: Database,
): DatabaseRelationship[] {
  const tableRows = selectRows(
    database,
    `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
      ORDER BY name COLLATE NOCASE;
    `,
  );

  const relationships: DatabaseRelationship[] = [];

  for (const [rawTableName] of tableRows) {
    const childTable = String(rawTableName ?? "");

    const foreignKeyRows = selectRows(
      database,
      `PRAGMA foreign_key_list(${quoteIdentifier(
        childTable,
      )});`,
    );

    for (const row of foreignKeyRows) {
      const foreignKeyId = Number(row[0] ?? 0);
      const sequence = Number(row[1] ?? 0);
      const parentTable = String(row[2] ?? "");
      const childColumn = String(row[3] ?? "");
      const parentColumn = String(row[4] ?? "");

      relationships.push({
        id: `${childTable}:${foreignKeyId}:${sequence}`,
        childTable,
        childColumn,
        parentTable,
        parentColumn,
        onUpdate: normalizeReferentialAction(
          String(row[5] ?? "NO ACTION"),
        ),
        onDelete: normalizeReferentialAction(
          String(row[6] ?? "NO ACTION"),
        ),
        match: String(row[7] ?? "NONE"),
      });
    }
  }

  return relationships.sort((left, right) => {
    const childComparison = left.childTable.localeCompare(
      right.childTable,
    );

    if (childComparison !== 0) {
      return childComparison;
    }

    return left.childColumn.localeCompare(
      right.childColumn,
    );
  });
}

async function listRelationships(): Promise<
  DatabaseRelationship[]
> {
  const database = await getDatabase();

  return listRelationshipsFromDatabase(database);
}

async function validateRelationship(
  input: RelationshipInput,
): Promise<RelationshipValidationResult> {
  const database = await getDatabase();

  if (
    input.parentTable.toLowerCase() ===
    input.childTable.toLowerCase()
  ) {
    throw new Error(
      "Self-referencing relationships are not supported yet.",
    );
  }

  const parentColumn = getTableColumn(
    database,
    input.parentTable,
    input.parentColumn,
  );

  const childColumn = getTableColumn(
    database,
    input.childTable,
    input.childColumn,
  );

  const parentAffinity = getColumnAffinity(
    parentColumn.declaredType,
  );

  const childAffinity = getColumnAffinity(
    childColumn.declaredType,
  );

  const parentNullCount = countFirstValue(
    selectRows(
      database,
      `
        SELECT COUNT(*)
        FROM ${quoteIdentifier(input.parentTable)}
        WHERE ${quoteIdentifier(input.parentColumn)} IS NULL;
      `,
    ),
  );

  const parentDuplicateCount = countFirstValue(
    selectRows(
      database,
      `
        SELECT COUNT(*)
        FROM (
          SELECT ${quoteIdentifier(input.parentColumn)}
          FROM ${quoteIdentifier(input.parentTable)}
          WHERE ${quoteIdentifier(input.parentColumn)} IS NOT NULL
          GROUP BY ${quoteIdentifier(input.parentColumn)}
          HAVING COUNT(*) > 1
        );
      `,
    ),
  );

  const orphanCount = countFirstValue(
    selectRows(
      database,
      `
        SELECT COUNT(*)
        FROM ${quoteIdentifier(input.childTable)} AS child
        WHERE child.${quoteIdentifier(input.childColumn)} IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM ${quoteIdentifier(input.parentTable)} AS parent
            WHERE parent.${quoteIdentifier(input.parentColumn)}
              = child.${quoteIdentifier(input.childColumn)}
          );
      `,
    ),
  );

  const existing = listRelationshipsFromDatabase(
    database,
  ).some(
    (relationship) =>
      relationship.parentTable.toLowerCase() ===
        input.parentTable.toLowerCase() &&
      relationship.parentColumn.toLowerCase() ===
        input.parentColumn.toLowerCase() &&
      relationship.childTable.toLowerCase() ===
        input.childTable.toLowerCase() &&
      relationship.childColumn.toLowerCase() ===
        input.childColumn.toLowerCase(),
  );

  const problems: string[] = [];

  if (existing) {
    problems.push("This relationship already exists.");
  }

  if (parentNullCount > 0) {
    problems.push(
      `The parent column contains ${parentNullCount} empty value(s).`,
    );
  }

  if (parentDuplicateCount > 0) {
    problems.push(
      `The parent column contains ${parentDuplicateCount} duplicated key value(s).`,
    );
  }

  if (orphanCount > 0) {
    problems.push(
      `The child table contains ${orphanCount} value(s) without a matching parent row.`,
    );
  }

  if (
    !affinitiesAreCompatible(
      parentAffinity,
      childAffinity,
    )
  ) {
    problems.push(
      `The column types are incompatible (${parentAffinity} and ${childAffinity}).`,
    );
  }

  return {
    valid: problems.length === 0,
    existing,
    parentNullCount,
    parentDuplicateCount,
    orphanCount,
    parentAffinity,
    childAffinity,
    problems,
  };
}

function identifierSlug(value: string): string {
  const result = value
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);

  return result || "value";
}

function ensureUniqueParentIndex(
  database: Database,
  tableName: string,
  columnName: string,
): void {
  const tableColumns = getRelationshipTableColumns(
    database,
    tableName,
  );

  const primaryKeyColumns = tableColumns
    .filter((column) => column.primaryKeyOrder > 0)
    .sort(
      (left, right) =>
        left.primaryKeyOrder - right.primaryKeyOrder,
    );

  if (
    primaryKeyColumns.length === 1 &&
    primaryKeyColumns[0].name.toLowerCase() ===
      columnName.toLowerCase()
  ) {
    return;
  }

  const indexRows = selectRows(
    database,
    `PRAGMA index_list(${quoteIdentifier(tableName)});`,
  );

  for (const indexRow of indexRows) {
    const indexName = String(indexRow[1] ?? "");
    const isUnique = Number(indexRow[2] ?? 0) === 1;
    const isPartial = Number(indexRow[4] ?? 0) === 1;

    if (!indexName || !isUnique || isPartial) {
      continue;
    }

    const indexColumns = selectRows(
      database,
      `PRAGMA index_info(${quoteIdentifier(
        indexName,
      )});`,
    )
      .map((row) => String(row[2] ?? ""))
      .filter(Boolean);

    if (
      indexColumns.length === 1 &&
      indexColumns[0].toLowerCase() ===
        columnName.toLowerCase()
    ) {
      return;
    }
  }

  const indexName = [
    "sqltrain_uq",
    identifierSlug(tableName),
    identifierSlug(columnName),
    Date.now().toString(36),
  ].join("_");

  database.exec(
    `
      CREATE UNIQUE INDEX ${quoteIdentifier(indexName)}
      ON ${quoteIdentifier(tableName)}
        (${quoteIdentifier(columnName)});
    `,
  );
}

function buildRelationshipTableSql(
  originalSql: string,
  temporaryTableName: string,
  input: RelationshipInput,
  onUpdate: ReferentialAction,
  onDelete: ReferentialAction,
): string {
  const openingParenthesis = originalSql.indexOf("(");
  const closingParenthesis = originalSql.lastIndexOf(")");

  if (
    openingParenthesis === -1 ||
    closingParenthesis <= openingParenthesis
  ) {
    throw new Error(
      `Table "${input.childTable}" cannot be rebuilt automatically.`,
    );
  }

  const definitions = originalSql
    .slice(
      openingParenthesis + 1,
      closingParenthesis,
    )
    .trim();

  const suffix = originalSql
    .slice(closingParenthesis + 1)
    .trim()
    .replace(/;$/, "")
    .trim();

  const constraintName = [
    "fk",
    identifierSlug(input.childTable),
    identifierSlug(input.childColumn),
    identifierSlug(input.parentTable),
    identifierSlug(input.parentColumn),
  ].join("_");

  const constraint = [
    `CONSTRAINT ${quoteIdentifier(constraintName)}`,
    `FOREIGN KEY (${quoteIdentifier(input.childColumn)})`,
    `REFERENCES ${quoteIdentifier(input.parentTable)}`,
    `(${quoteIdentifier(input.parentColumn)})`,
    `ON UPDATE ${onUpdate}`,
    `ON DELETE ${onDelete}`,
  ].join(" ");

  return [
    `CREATE TABLE ${quoteIdentifier(temporaryTableName)}`,
    `(${definitions}, ${constraint})`,
    suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .concat(";");
}

async function createRelationship(
  input: RelationshipInput,
): Promise<CreateRelationshipResult> {
  const validation = await validateRelationship(input);

  if (!validation.valid) {
    throw new Error(validation.problems.join(" "));
  }

  const database = await getDatabase();

  const onUpdate = normalizeReferentialAction(
    input.onUpdate,
  );

  const onDelete = normalizeReferentialAction(
    input.onDelete,
  );

  const originalSqlRows = selectRows(
    database,
    `
      SELECT sql
      FROM sqlite_master
      WHERE type = 'table'
        AND name = ? COLLATE NOCASE
      LIMIT 1;
    `,
    [input.childTable],
  );

  const originalSql = String(
    originalSqlRows[0]?.[0] ?? "",
  );

  if (!originalSql) {
    throw new Error(
      `Could not read the schema of table "${input.childTable}".`,
    );
  }

  const childColumns = getRelationshipTableColumns(
    database,
    input.childTable,
  );

  if (childColumns.length === 0) {
    throw new Error(
      `Table "${input.childTable}" has no columns.`,
    );
  }

  const schemaObjectRows = selectRows(
    database,
    `
      SELECT type, name, sql
      FROM sqlite_master
      WHERE tbl_name = ? COLLATE NOCASE
        AND type IN ('index', 'trigger')
        AND sql IS NOT NULL
      ORDER BY type, name;
    `,
    [input.childTable],
  );

  const temporaryTableName =
    `__sqltrain_relationship_${Date.now().toString(36)}`;

  const columnList = childColumns
    .map((column) => quoteIdentifier(column.name))
    .join(", ");

  database.exec("PRAGMA foreign_keys = OFF;");
  database.exec(
    `SAVEPOINT ${RELATIONSHIP_SAVEPOINT};`,
  );

  try {
    ensureUniqueParentIndex(
      database,
      input.parentTable,
      input.parentColumn,
    );

    database.exec(
      buildRelationshipTableSql(
        originalSql,
        temporaryTableName,
        input,
        onUpdate,
        onDelete,
      ),
    );

    database.exec(
      `
        INSERT INTO ${quoteIdentifier(temporaryTableName)}
          (${columnList})
        SELECT ${columnList}
        FROM ${quoteIdentifier(input.childTable)};
      `,
    );

    const foreignKeyProblems = selectRows(
      database,
      `PRAGMA foreign_key_check(${quoteIdentifier(
        temporaryTableName,
      )});`,
    );

    if (foreignKeyProblems.length > 0) {
      throw new Error(
        "Foreign key validation failed while rebuilding the table.",
      );
    }

    database.exec(
      `
        DROP TABLE ${quoteIdentifier(input.childTable)};
        ALTER TABLE ${quoteIdentifier(temporaryTableName)}
          RENAME TO ${quoteIdentifier(input.childTable)};
      `,
    );

    for (const schemaObjectRow of schemaObjectRows) {
      const schemaSql = String(
        schemaObjectRow[2] ?? "",
      );

      if (schemaSql) {
        database.exec(schemaSql);
      }
    }

    database.exec(
      `RELEASE SAVEPOINT ${RELATIONSHIP_SAVEPOINT};`,
    );
  } catch (error) {
    try {
      database.exec(
        `ROLLBACK TO SAVEPOINT ${RELATIONSHIP_SAVEPOINT};`,
      );

      database.exec(
        `RELEASE SAVEPOINT ${RELATIONSHIP_SAVEPOINT};`,
      );
    } finally {
      database.exec("PRAGMA foreign_keys = ON;");
    }

    throw error;
  }

  database.exec("PRAGMA foreign_keys = ON;");

  const relationship = listRelationshipsFromDatabase(
    database,
  ).find(
    (candidate) =>
      candidate.parentTable.toLowerCase() ===
        input.parentTable.toLowerCase() &&
      candidate.parentColumn.toLowerCase() ===
        input.parentColumn.toLowerCase() &&
      candidate.childTable.toLowerCase() ===
        input.childTable.toLowerCase() &&
      candidate.childColumn.toLowerCase() ===
        input.childColumn.toLowerCase(),
  );

  if (!relationship) {
    throw new Error(
      "The relationship was created but could not be read back.",
    );
  }

  return {
    created: true,
    relationship,
    validation,
  };
}

async function resetDatabase(): Promise<void> {
  const database = await getDatabase();

  database.exec("PRAGMA foreign_keys = OFF;");

  try {
    const viewRows = selectRows(
      database,
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'view'
          AND name NOT LIKE 'sqlite_%';
      `,
    );

    for (const [rawViewName] of viewRows) {
      database.exec(
        `DROP VIEW IF EXISTS ${quoteIdentifier(
          String(rawViewName),
        )};`,
      );
    }

    const tableRows = selectRows(
      database,
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%';
      `,
    );

    for (const [rawTableName] of tableRows) {
      database.exec(
        `DROP TABLE IF EXISTS ${quoteIdentifier(
          String(rawTableName),
        )};`,
      );
    }

    database.exec(await getSeedSql());
  } finally {
    database.exec("PRAGMA foreign_keys = ON;");
  }
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

          postSuccess(request.id, {
            ready: true,
            storageMode,
            warning: storageWarning,
          });
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

        case "importData":
          postSuccess(
            request.id,
            await importData(request.input),
          );
          break;

        case "listRelationships":
          postSuccess(
            request.id,
            await listRelationships(),
          );
          break;

        case "validateRelationship":
          postSuccess(
            request.id,
            await validateRelationship(request.input),
          );
          break;

        case "createRelationship":
          postSuccess(
            request.id,
            await createRelationship(request.input),
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
