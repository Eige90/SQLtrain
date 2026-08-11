import {
  executeMysteryQuery,
  executeMysterySandbox,
} from "@/lib/mystery/mystery-engine";

import type {
  DatabaseValue,
  QueryResult,
} from "@/types/database";

import type {
  MysteryTask,
  MysteryTaskValidationResult,
} from "@/types/mystery";

function bytesToString(
  bytes: Uint8Array,
): string {
  return Array.from(bytes)
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
}

function normalizeValue(
  value: DatabaseValue,
): string {
  if (value === null) {
    return "null:";
  }

  if (
    typeof value === "bigint"
  ) {
    return `bigint:${value.toString()}`;
  }

  if (
    typeof value === "number"
  ) {
    return `number:${
      Object.is(value, -0)
        ? 0
        : value
    }`;
  }

  if (
    typeof value === "string"
  ) {
    return `string:${value}`;
  }

  if (
    value instanceof ArrayBuffer
  ) {
    return `blob:${bytesToString(
      new Uint8Array(value),
    )}`;
  }

  if (
    value instanceof Int8Array
  ) {
    return `blob:${bytesToString(
      new Uint8Array(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      ),
    )}`;
  }

  return `blob:${bytesToString(
    value,
  )}`;
}

function normalizeColumns(
  result: QueryResult,
): string[] {
  return result.columns.map(
    (column) =>
      column
        .trim()
        .toLowerCase(),
  );
}

function normalizeRows(
  result: QueryResult,
): string[] {
  return result.rows.map(
    (row) =>
      JSON.stringify(
        row.map(
          normalizeValue,
        ),
      ),
  );
}

function arraysAreEqual(
  left: string[],
  right: string[],
): boolean {
  return (
    left.length ===
      right.length &&
    left.every(
      (value, index) =>
        value ===
        right[index],
    )
  );
}

function compareResults(
  task: MysteryTask,
  submittedResult: QueryResult,
  expectedResult: QueryResult,
): MysteryTaskValidationResult {
  const submittedColumns =
    normalizeColumns(
      submittedResult,
    );

  const expectedColumns =
    normalizeColumns(
      expectedResult,
    );

  if (
    !arraysAreEqual(
      submittedColumns,
      expectedColumns,
    )
  ) {
    return {
      correct: false,
      message:
        "The selected columns or aliases do not match the evidence request.",
    };
  }

  if (
    submittedResult.rows.length !==
    expectedResult.rows.length
  ) {
    return {
      correct: false,
      message:
        `Your query returned ${submittedResult.rows.length} row(s). ` +
        `The investigation expects ${expectedResult.rows.length}.`,
    };
  }

  const submittedRows =
    normalizeRows(
      submittedResult,
    );

  const expectedRows =
    normalizeRows(
      expectedResult,
    );

  if (
    !task.resultOrderMatters
  ) {
    submittedRows.sort();
    expectedRows.sort();
  }

  if (
    !arraysAreEqual(
      submittedRows,
      expectedRows,
    )
  ) {
    return {
      correct: false,
      message:
        task.resultOrderMatters
          ? "The evidence is correct, but the row order does not match the task."
          : "The result does not match the evidence.",
    };
  }

  return {
    correct: true,
    message:
      "Evidence secured. The next clue is ready.",
  };
}

function validateRequiredPatterns(
  task: MysteryTask,
  submittedSql: string,
): MysteryTaskValidationResult | null {
  const normalized =
    submittedSql.toUpperCase();

  for (
    const required
    of task.requiredSqlPatterns ??
      []
  ) {
    if (
      !normalized.includes(
        required.toUpperCase(),
      )
    ) {
      return {
        correct: false,
        message:
          `This task requires you to use ${required}.`,
      };
    }
  }

  return null;
}

async function validateQueryTask(
  task: MysteryTask,
  submittedSql: string,
): Promise<MysteryTaskValidationResult> {
  let submittedResult:
    QueryResult;

  try {
    submittedResult =
      await executeMysteryQuery(
        submittedSql,
      );
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `SQL error: ${error.message}`
          : "The query could not be executed.",
    };
  }

  let expectedResult:
    QueryResult;

  try {
    expectedResult =
      await executeMysteryQuery(
        task.solutionSql,
      );
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `Mystery configuration error: ${error.message}`
          : "The reference query failed.",
    };
  }

  return compareResults(
    task,
    submittedResult,
    expectedResult,
  );
}

async function validateSandboxTask(
  task: MysteryTask,
  submittedSql: string,
): Promise<MysteryTaskValidationResult> {
  if (
    !task.verificationSql
  ) {
    return {
      correct: false,
      message:
        "This mystery sandbox task is not configured correctly.",
    };
  }

  let submittedResult:
    QueryResult;

  try {
    submittedResult =
      await executeMysterySandbox({
        setupSql:
          task.setupSql,
        sql: submittedSql,
        verificationSql:
          task.verificationSql,
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

  let expectedResult:
    QueryResult;

  try {
    expectedResult =
      await executeMysterySandbox({
        setupSql:
          task.setupSql,
        sql:
          task.solutionSql,
        verificationSql:
          task.verificationSql,
      });
  } catch (error) {
    return {
      correct: false,
      message:
        error instanceof Error
          ? `Mystery configuration error: ${error.message}`
          : "The sandbox reference command failed.",
    };
  }

  return compareResults(
    task,
    submittedResult,
    expectedResult,
  );
}

export async function validateMysteryTask(
  task: MysteryTask,
  submittedSql: string,
): Promise<MysteryTaskValidationResult> {
  if (
    !submittedSql.trim()
  ) {
    return {
      correct: false,
      message:
        "Enter SQL before checking the evidence.",
    };
  }

  const patternError =
    validateRequiredPatterns(
      task,
      submittedSql,
    );

  if (patternError) {
    return patternError;
  }

  if (
    task.executionMode ===
    "sandbox"
  ) {
    return validateSandboxTask(
      task,
      submittedSql,
    );
  }

  return validateQueryTask(
    task,
    submittedSql,
  );
}
