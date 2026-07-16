"use client";

import { useEffect, useState } from "react";

import { sqliteClient } from "@/lib/sqlite/sqlite-client";
import type {
  DatabaseColumn,
  DatabaseTableSummary,
} from "@/types/database";
import type {
  DatabaseRelationship,
  ReferentialAction,
  RelationshipInput,
  RelationshipValidationResult,
} from "@/types/relationship";

type RelationshipsPanelProps = {
  tables: DatabaseTableSummary[];
  onDatabaseChanged: () => Promise<void> | void;
};

const REFERENTIAL_ACTIONS: ReferentialAction[] = [
  "RESTRICT",
  "CASCADE",
  "SET NULL",
  "NO ACTION",
  "SET DEFAULT",
];

function defaultParentTable(
  tables: DatabaseTableSummary[],
): string {
  return tables[0]?.name ?? "";
}

function defaultChildTable(
  tables: DatabaseTableSummary[],
): string {
  const parentTable = defaultParentTable(tables);

  return (
    tables.find((table) => table.name !== parentTable)?.name ??
    parentTable
  );
}

export function RelationshipsPanel({
  tables,
  onDatabaseChanged,
}: RelationshipsPanelProps) {
  const [parentTable, setParentTable] = useState(() =>
    defaultParentTable(tables),
  );

  const [childTable, setChildTable] = useState(() =>
    defaultChildTable(tables),
  );

  const [parentColumns, setParentColumns] = useState<
    DatabaseColumn[]
  >([]);

  const [childColumns, setChildColumns] = useState<
    DatabaseColumn[]
  >([]);

  const [parentColumn, setParentColumn] = useState("");
  const [childColumn, setChildColumn] = useState("");

  const [onUpdate, setOnUpdate] =
    useState<ReferentialAction>("CASCADE");

  const [onDelete, setOnDelete] =
    useState<ReferentialAction>("RESTRICT");

  const [relationships, setRelationships] = useState<
    DatabaseRelationship[]
  >([]);

  const [validation, setValidation] =
    useState<RelationshipValidationResult | null>(null);

  const [isLoadingRelationships, setIsLoadingRelationships] =
    useState(true);

  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRelationships(): Promise<void> {
      try {
        const nextRelationships =
          await sqliteClient.listRelationships();

        if (!cancelled) {
          setRelationships(nextRelationships);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load relationships.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRelationships(false);
        }
      }
    }

    void loadRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadParentColumns(): Promise<void> {
      if (!parentTable) {
        return;
      }

      try {
        const tableData = await sqliteClient.getTableData(
          parentTable,
          {
            limit: 1,
            offset: 0,
          },
        );

        if (cancelled) {
          return;
        }

        setParentColumns(tableData.columns);

        setParentColumn((currentColumn) => {
          const stillExists = tableData.columns.some(
            (column) => column.name === currentColumn,
          );

          return stillExists
            ? currentColumn
            : (tableData.columns[0]?.name ?? "");
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : `Could not load columns for "${parentTable}".`,
          );
        }
      }
    }

    void loadParentColumns();

    return () => {
      cancelled = true;
    };
  }, [parentTable]);

  useEffect(() => {
    let cancelled = false;

    async function loadChildColumns(): Promise<void> {
      if (!childTable) {
        return;
      }

      try {
        const tableData = await sqliteClient.getTableData(
          childTable,
          {
            limit: 1,
            offset: 0,
          },
        );

        if (cancelled) {
          return;
        }

        setChildColumns(tableData.columns);

        setChildColumn((currentColumn) => {
          const stillExists = tableData.columns.some(
            (column) => column.name === currentColumn,
          );

          return stillExists
            ? currentColumn
            : (tableData.columns[0]?.name ?? "");
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : `Could not load columns for "${childTable}".`,
          );
        }
      }
    }

    void loadChildColumns();

    return () => {
      cancelled = true;
    };
  }, [childTable]);

  function clearResult(): void {
    setValidation(null);
    setMessage(null);
    setError(null);
  }

  function createInput(): RelationshipInput {
    return {
      parentTable,
      parentColumn,
      childTable,
      childColumn,
      onUpdate,
      onDelete,
    };
  }

  async function refreshRelationships(): Promise<void> {
    setIsLoadingRelationships(true);

    try {
      setRelationships(
        await sqliteClient.listRelationships(),
      );

      setError(null);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Could not refresh relationships.",
      );
    } finally {
      setIsLoadingRelationships(false);
    }
  }

  async function validateRelationship(): Promise<void> {
    setIsValidating(true);
    setMessage(null);
    setError(null);

    try {
      const result =
        await sqliteClient.validateRelationship(
          createInput(),
        );

      setValidation(result);

      setMessage(
        result.valid
          ? "The relationship is valid and can be created."
          : "The relationship cannot be created yet.",
      );
    } catch (validationError) {
      setValidation(null);

      setError(
        validationError instanceof Error
          ? validationError.message
          : "Relationship validation failed.",
      );
    } finally {
      setIsValidating(false);
    }
  }

  async function createRelationship(): Promise<void> {
    setIsCreating(true);
    setMessage(null);
    setError(null);

    try {
      const result =
        await sqliteClient.createRelationship(
          createInput(),
        );

      setValidation(result.validation);

      setMessage(
        `Relationship created: ${result.relationship.childTable}.${result.relationship.childColumn} → ${result.relationship.parentTable}.${result.relationship.parentColumn}`,
      );

      await refreshRelationships();
      await onDatabaseChanged();
    } catch (creationError) {
      setError(
        creationError instanceof Error
          ? creationError.message
          : "Could not create the relationship.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  const formComplete =
    parentTable.length > 0 &&
    parentColumn.length > 0 &&
    childTable.length > 0 &&
    childColumn.length > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <h3 className="font-semibold text-slate-900">
          Table Relationships
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Connect imported tables using primary and foreign key
          relationships.
        </p>
      </div>

      {tables.length < 2 ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
          At least two tables are required to create a relationship.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <fieldset className="space-y-3 rounded-lg border border-sky-200 bg-sky-50/60 p-3">
            <legend className="px-1 text-sm font-semibold text-sky-900">
              Parent table
            </legend>

            <label className="block text-sm font-medium text-slate-700">
              Table
              <select
                value={parentTable}
                onChange={(event) => {
                  setParentTable(event.target.value);
                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {tables.map((table) => (
                  <option
                    key={table.name}
                    value={table.name}
                  >
                    {table.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Unique key column
              <select
                value={parentColumn}
                onChange={(event) => {
                  setParentColumn(event.target.value);
                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {parentColumns.map((column) => (
                  <option
                    key={column.name}
                    value={column.name}
                  >
                    {column.name}
                    {column.declaredType
                      ? ` · ${column.declaredType}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className="space-y-3 rounded-lg border border-indigo-200 bg-indigo-50/60 p-3">
            <legend className="px-1 text-sm font-semibold text-indigo-900">
              Child table
            </legend>

            <label className="block text-sm font-medium text-slate-700">
              Table
              <select
                value={childTable}
                onChange={(event) => {
                  setChildTable(event.target.value);
                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {tables.map((table) => (
                  <option
                    key={table.name}
                    value={table.name}
                  >
                    {table.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Foreign key column
              <select
                value={childColumn}
                onChange={(event) => {
                  setChildColumn(event.target.value);
                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {childColumns.map((column) => (
                  <option
                    key={column.name}
                    value={column.name}
                  >
                    {column.name}
                    {column.declaredType
                      ? ` · ${column.declaredType}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-slate-700">
              On update
              <select
                value={onUpdate}
                onChange={(event) => {
                  setOnUpdate(
                    event.target.value as ReferentialAction,
                  );

                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
              >
                {REFERENTIAL_ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              On delete
              <select
                value={onDelete}
                onChange={(event) => {
                  setOnDelete(
                    event.target.value as ReferentialAction,
                  );

                  clearResult();
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
              >
                {REFERENTIAL_ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void validateRelationship()}
              disabled={!formComplete || isValidating || isCreating}
              className="rounded-lg border border-sky-300 px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isValidating
                ? "Validating..."
                : "Validate Relationship"}
            </button>

            <button
              type="button"
              onClick={() => void createRelationship()}
              disabled={!formComplete || isValidating || isCreating}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating
                ? "Creating..."
                : "Create Relationship"}
            </button>
          </div>

          {message && (
            <div
              className={`rounded-lg border px-3 py-3 text-sm ${
                validation?.valid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              {message}
            </div>
          )}

          {validation && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-slate-700">
                <dt>Parent type</dt>
                <dd className="font-semibold">
                  {validation.parentAffinity}
                </dd>

                <dt>Child type</dt>
                <dd className="font-semibold">
                  {validation.childAffinity}
                </dd>

                <dt>Empty parent keys</dt>
                <dd className="font-semibold">
                  {validation.parentNullCount}
                </dd>

                <dt>Duplicate parent keys</dt>
                <dd className="font-semibold">
                  {validation.parentDuplicateCount}
                </dd>

                <dt>Missing parent rows</dt>
                <dd className="font-semibold">
                  {validation.orphanCount}
                </dd>
              </dl>

              {validation.problems.length > 0 && (
                <ul className="mt-3 space-y-1 text-red-700">
                  {validation.problems.map((problem) => (
                    <li key={problem}>• {problem}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="mt-5 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-slate-900">
            Existing Relationships
          </h4>

          <button
            type="button"
            onClick={() => void refreshRelationships()}
            disabled={isLoadingRelationships}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {isLoadingRelationships ? (
          <p className="mt-3 text-sm text-slate-500">
            Loading relationships...
          </p>
        ) : relationships.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No relationships have been defined yet.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {relationships.map((relationship) => (
              <div
                key={relationship.id}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
              >
                <p className="font-semibold text-slate-900">
                  {relationship.childTable}.
                  {relationship.childColumn}
                </p>

                <p className="mt-1 text-slate-600">
                  references {relationship.parentTable}.
                  {relationship.parentColumn}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Update: {relationship.onUpdate} · Delete:{" "}
                  {relationship.onDelete}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
