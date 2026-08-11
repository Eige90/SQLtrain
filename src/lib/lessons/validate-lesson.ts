import { sqliteClient } from "@/lib/sqlite/sqlite-client";

import type {
  DatabaseValue,
  QueryResult,
} from "@/types/database";

import type {
  LessonValidationResult,
  SqlLesson,
} from "@/types/lesson";

function isSafeQueryLessonSql(sql: string): boolean {
  const normalizedSql = sql
    .trim()
    .replace(/;+\s*$/, "");

  const isReadOnlyQuery =
    /^(SELECT|WITH)\b/i.test(normalizedSql) ||
    /^EXPLAIN\s+QUERY\s+PLAN\s+(SELECT|WITH)\b/i.test(
      normalizedSql,
    );

  if (!isReadOnlyQuery) {
    return false;
  }

  if (normalizedSql.includes(";")) {
    return false;
  }

  if (/\bREPLACE\s+INTO\b/i.test(normalizedSql)) {
    return false;
  }

  return !/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|VACUUM|PRAGMA)\b/i.test(
    normalizedSql,
  );
}

function isSafeSandboxSql(sql: string): boolean {
  if (!sql.trim()) {
    return false;
  }

  return !/\b(ATTACH|DETACH|VACUUM|PRAGMA)\b/i.test(
    sql,
  ) &&
    !/\bLOAD_EXTENSION\s*\(/i.test(sql);
}

function bytesToString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) =>
      byte.toString(16).padStart(2, "0"),
    )
    .join("");
}

function normalizeValue(
  value: DatabaseValue,
): string {
  if (value === null) {
    return "null:";
  }

  if (typeof value === "bigint") {
    return `bigint:${value.toString()}`;
  }

  if (typeof value === "number") {
    return `number:${
      Object.is(value, -0) ? 0 : value
    }`;
  }

  if (typeof value === "string") {
    return `string:${value}`;
  }

  if (value instanceof ArrayBuffer) {
    return `blob:${bytesToString(
      new Uint8Array(value),
    )}`;
  }

  if (value instanceof Int8Array) {
    return `blob:${bytesToString(
      new Uint8Array(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      ),
    )}`;
  }

  return `blob:${bytesToString(value)}`;
}

function normalizeColumns(
  result: QueryResult,
): string[] {
  return result.columns.map((column) =>
    column.trim().toLowerCase(),
  );
}

function normalizeRows(
  result: QueryResult,
): string[] {
  return result.rows.map((row) =>
    JSON.stringify(row.map(normalizeValue)),
  );
}

function arraysAreEqual(
  left: string[],
  right: string[],
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (value, index) =>
        value === right[index],
    )
  );
}

function compareResults(
  lesson: SqlLesson,
  submittedResult: QueryResult,
  expectedResult: QueryResult,
): LessonValidationResult {
  const submittedColumns =
    normalizeColumns(submittedResult);

  const expectedColumns =
    normalizeColumns(expectedResult);

  if (
    !arraysAreEqual(
      submittedColumns,
      expectedColumns,
    )
  ) {
    return {
      correct: false,
      message:
        "The selected columns or their order do not match the task.",
    };
  }

  if (
    submittedResult.rows.length !==
    expectedResult.rows.length
  ) {
    return {
      correct: false,
      message:
        `Your result contains ${submittedResult.rows.length} row(s), ` +
        `but the expected result contains ${expectedResult.rows.length}.`,
    };
  }

  const submittedRows =
    normalizeRows(submittedResult);

  const expectedRows =
    normalizeRows(expectedResult);

  if (!lesson.resultOrderMatters) {
    submittedRows.sort();
    expectedRows.sort();
  }

  if (!arraysAreEqual(submittedRows, expectedRows)) {
    return {
      correct: false,
      message:
        lesson.resultOrderMatters
          ? "The data is not in the expected order."
          : "The result does not match the task.",
    };
  }

  return {
    correct: true,
    message:
      "Correct! The train is ready for the next lesson.",
  };
}

async function validateQueryLesson(
  lesson: SqlLesson,
  submittedSql: string,
): Promise<LessonValidationResult> {
  if (!isSafeQueryLessonSql(submittedSql)) {
    return {
      correct: false,
      message:
        "This lesson accepts one read-only SELECT query.",
    };
  }

  let submittedResult: QueryResult;

  try {
    submittedResult =
      await sqliteClient.execute(submittedSql);
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `SQL error: ${error.message}`
          : "The SQL query could not be executed.",
    };
  }

  let expectedResult: QueryResult;

  try {
    expectedResult =
      await sqliteClient.execute(
        lesson.solutionSql,
      );
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `Lesson configuration error: ${error.message}`
          : "The lesson reference query failed.",
    };
  }

  return compareResults(
    lesson,
    submittedResult,
    expectedResult,
  );
}

async function validateSandboxLesson(
  lesson: SqlLesson,
  submittedSql: string,
): Promise<LessonValidationResult> {
  if (!isSafeSandboxSql(submittedSql)) {
    return {
      correct: false,
      message:
        "This command is not allowed inside the lesson sandbox.",
    };
  }

  if (
    !lesson.setupSql ||
    !lesson.verificationSql
  ) {
    return {
      correct: false,
      message:
        "The lesson sandbox is not configured correctly.",
    };
  }

  let submittedResult: QueryResult;

  try {
    submittedResult =
      await sqliteClient.executeLessonSandbox({
        setupSql: lesson.setupSql,
        sql: submittedSql,
        verificationSql:
          lesson.verificationSql,
      });
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `SQL error: ${error.message}`
          : "The sandbox command failed.",
    };
  }

  let expectedResult: QueryResult;

  try {
    expectedResult =
      await sqliteClient.executeLessonSandbox({
        setupSql: lesson.setupSql,
        sql: lesson.solutionSql,
        verificationSql:
          lesson.verificationSql,
      });
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `Lesson configuration error: ${error.message}`
          : "The sandbox reference command failed.",
    };
  }

  return compareResults(
    lesson,
    submittedResult,
    expectedResult,
  );
}

export async function validateSqlLesson(
  lesson: SqlLesson,
  submittedSql: string,
): Promise<LessonValidationResult> {
  if (!submittedSql.trim()) {
    return {
      correct: false,
      message:
        "Enter SQL before checking the answer.",
    };
  }

  if (lesson.executionMode === "sandbox") {
    return validateSandboxLesson(
      lesson,
      submittedSql,
    );
  }

  return validateQueryLesson(
    lesson,
    submittedSql,
  );
}
