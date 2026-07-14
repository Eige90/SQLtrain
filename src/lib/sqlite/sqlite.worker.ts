/// <reference lib="webworker" />

import sqlite3InitModule, {
  type Database,
  type SqlValue,
} from "@sqlite.org/sqlite-wasm";

import type {
  DatabaseTableSummary,
  QueryResult,
} from "../../types/database";

type WorkerRequest =
  | { id: string; type: "initialize" }
  | { id: string; type: "execute"; sql: string }
  | { id: string; type: "listTables" }
  | { id: string; type: "reset" };

type WorkerResponse =
  | { id: string; ok: true; result: unknown }
  | { id: string; ok: false; error: string };

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

const workerScope = self as DedicatedWorkerGlobalScope;

let databasePromise: Promise<Database> | null = null;
let seedSqlPromise: Promise<string> | null = null;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown SQLite error.";
}

function getSeedSql(): Promise<string> {
  if (!seedSqlPromise) {
    seedSqlPromise = fetch("/databases/northwind.sql", {
      cache: "no-store",
    }).then(async (response) => {
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
    affectedRows: Math.max(0, totalChangesAfter - totalChangesBefore),
    executionTimeMs,
  };
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function listTables(): Promise<DatabaseTableSummary[]> {
  const database = await getDatabase();

  const tableRows = database.exec({
    sql: `
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%';
    `,
    rowMode: "array",
    returnValue: "resultRows",
  }) as SqlValue[][];

  const summaries = tableRows.map(([rawName]) => {
    const name = String(rawName);
    const countRows = database.exec({
      sql: `SELECT COUNT(*) FROM ${quoteIdentifier(name)};`,
      rowMode: "array",
      returnValue: "resultRows",
    }) as SqlValue[][];

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

    const normalizedLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const normalizedRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    return normalizedLeftIndex - normalizedRightIndex || left.name.localeCompare(right.name);
  });
}

async function resetDatabase(): Promise<void> {
  const database = await getDatabase();
  database.exec(await getSeedSql());
}

function postSuccess(id: string, result: unknown): void {
  const response: WorkerResponse = { id, ok: true, result };
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
