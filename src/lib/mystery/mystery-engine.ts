import {
  sqliteClient,
} from "@/lib/sqlite/sqlite-client";

import type {
  QueryResult,
} from "@/types/database";

let cachedSeedSql: string | null =
  null;

function normalizeReadOnlySql(
  sql: string,
): string {
  const normalized = sql
    .trim()
    .replace(/;+\s*$/, "");

  if (!normalized) {
    throw new Error(
      "Enter SQL before running the query.",
    );
  }

  if (
    !/^(SELECT|WITH)\b/i.test(
      normalized,
    )
  ) {
    throw new Error(
      "This mystery task accepts one read-only SELECT query.",
    );
  }

  if (
    normalized.includes(";")
  ) {
    throw new Error(
      "Only one SQL statement is allowed for this investigation task.",
    );
  }

  if (
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|VACUUM|PRAGMA)\b/i.test(
      normalized,
    )
  ) {
    throw new Error(
      "This mystery task is read-only.",
    );
  }

  return normalized;
}

function validateSandboxSql(
  sql: string,
): string {
  const normalized =
    sql.trim();

  if (!normalized) {
    throw new Error(
      "Enter SQL before running the command.",
    );
  }

  if (
    /\b(ATTACH|DETACH|VACUUM|PRAGMA)\b/i.test(
      normalized,
    ) ||
    /\bLOAD_EXTENSION\s*\(/i.test(
      normalized,
    )
  ) {
    throw new Error(
      "This command is not allowed inside the isolated mystery sandbox.",
    );
  }

  return normalized;
}

export async function loadMysterySeedSql(): Promise<string> {
  if (cachedSeedSql) {
    return cachedSeedSql;
  }

  const basePath =
    process.env
      .NEXT_PUBLIC_BASE_PATH ??
    "";

  const response =
    await fetch(
      `${basePath}/databases/mystery.sql`,
    );

  if (!response.ok) {
    throw new Error(
      `Could not load the mystery database (${response.status}).`,
    );
  }

  cachedSeedSql =
    await response.text();

  return cachedSeedSql;
}

export async function executeMysteryQuery(
  sql: string,
): Promise<QueryResult> {
  const safeSql =
    normalizeReadOnlySql(sql);

  const seedSql =
    await loadMysterySeedSql();

  return sqliteClient.executeLessonSandbox({
    setupSql: seedSql,
    sql: "SELECT 1;",
    verificationSql: safeSql,
  });
}

export async function executeMysterySandbox(
  input: {
    sql: string;
    setupSql?: string;
    verificationSql: string;
  },
): Promise<QueryResult> {
  const safeSql =
    validateSandboxSql(
      input.sql,
    );

  const seedSql =
    await loadMysterySeedSql();

  const setupSql = [
    seedSql,
    input.setupSql ?? "",
  ]
    .filter(Boolean)
    .join("\n");

  return sqliteClient.executeLessonSandbox({
    setupSql,
    sql: safeSql,
    verificationSql:
      input.verificationSql,
  });
}
