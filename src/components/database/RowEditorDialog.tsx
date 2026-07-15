"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";

import type {
  DatabaseColumn,
  DatabaseRecord,
  DatabaseValue,
} from "@/types/database";

type EditorMode = "insert" | "edit";

type RowEditorDialogProps = {
  mode: EditorMode;
  tableName: string;
  columns: DatabaseColumn[];
  initialValues?: DatabaseRecord;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (values: DatabaseRecord) => Promise<void>;
};

type FieldState = {
  include: boolean;
  isNull: boolean;
  value: string;
};

type FieldStateMap = Record<string, FieldState>;

function isBinaryValue(value: DatabaseValue | undefined): boolean {
  return (
    value instanceof Uint8Array ||
    value instanceof Int8Array ||
    value instanceof ArrayBuffer
  );
}

function isBinaryColumn(column: DatabaseColumn): boolean {
  return column.declaredType.toUpperCase().includes("BLOB");
}

function isIntegerColumn(column: DatabaseColumn): boolean {
  return column.declaredType.toUpperCase().includes("INT");
}

function isNumericColumn(column: DatabaseColumn): boolean {
  const declaredType = column.declaredType.toUpperCase();

  return (
    declaredType.includes("REAL") ||
    declaredType.includes("FLOA") ||
    declaredType.includes("DOUB") ||
    declaredType.includes("NUM") ||
    declaredType.includes("DEC")
  );
}

function valueToInput(value: DatabaseValue | undefined): string {
  if (value === null || value === undefined || isBinaryValue(value)) {
    return "";
  }

  return String(value);
}

function createFieldState(
  column: DatabaseColumn,
  mode: EditorMode,
  initialValue: DatabaseValue | undefined,
): FieldState {
  const binary = isBinaryColumn(column) || isBinaryValue(initialValue);

  if (mode === "edit") {
    return {
      include: !binary,
      isNull: initialValue === null,
      value: valueToInput(initialValue),
    };
  }

  const isAutomaticIntegerPrimaryKey =
    column.primaryKeyOrder > 0 && isIntegerColumn(column);

  return {
    include:
      !binary &&
      !isAutomaticIntegerPrimaryKey &&
      column.defaultValue === null,
    isNull: false,
    value: "",
  };
}

function createInitialFields(
  columns: DatabaseColumn[],
  mode: EditorMode,
  initialValues?: DatabaseRecord,
): FieldStateMap {
  const fields: FieldStateMap = {};

  for (const column of columns) {
    fields[column.name] = createFieldState(
      column,
      mode,
      initialValues?.[column.name],
    );
  }

  return fields;
}

function parseFieldValue(
  column: DatabaseColumn,
  rawValue: string,
): DatabaseValue {
  if (isIntegerColumn(column)) {
    const normalizedValue = rawValue.trim();

    if (!/^[+-]?\d+$/.test(normalizedValue)) {
      throw new Error(`${column.name} must be a whole number.`);
    }

    const numericValue = Number(normalizedValue);

    return Number.isSafeInteger(numericValue)
      ? numericValue
      : BigInt(normalizedValue);
  }

  if (isNumericColumn(column)) {
    const numericValue = Number(rawValue.trim());

    if (!Number.isFinite(numericValue)) {
      throw new Error(`${column.name} must be a valid number.`);
    }

    return numericValue;
  }

  return rawValue;
}

export function RowEditorDialog({
  mode,
  tableName,
  columns,
  initialValues,
  isSaving,
  error,
  onClose,
  onSave,
}: RowEditorDialogProps) {
  const [fields, setFields] = useState<FieldStateMap>(() =>
    createInitialFields(columns, mode, initialValues),
  );

  const [validationError, setValidationError] =
    useState<string | null>(null);

  function updateField(
    columnName: string,
    updates: Partial<FieldState>,
  ) {
    setFields((currentFields) => ({
      ...currentFields,
      [columnName]: {
        ...currentFields[columnName],
        ...updates,
      },
    }));
  }

  async function submitRow() {
    setValidationError(null);

    try {
      const values: DatabaseRecord = {};

      for (const column of columns) {
        const field = fields[column.name];

        if (
          !field ||
          !field.include ||
          isBinaryColumn(column)
        ) {
          continue;
        }

        values[column.name] = field.isNull
          ? null
          : parseFieldValue(column, field.value);
      }

      if (Object.keys(values).length === 0) {
        throw new Error(
          mode === "insert"
            ? "Select at least one column to insert."
            : "Select at least one column to update.",
        );
      }

      await onSave(values);
    } catch (submitError) {
      setValidationError(
        submitError instanceof Error
          ? submitError.message
          : "The row could not be saved.",
      );
    }
  }

  const displayedError = validationError ?? error;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="row-editor-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3
              id="row-editor-title"
              className="text-lg font-bold text-slate-900"
            >
              {mode === "insert" ? "Add Row" : "Edit Row"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Table: {tableName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close row editor"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-4 p-6">
          {displayedError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {displayedError}
            </div>
          )}

          {columns.map((column) => {
            const field = fields[column.name];

            if (!field) {
              return null;
            }

            const binary = isBinaryColumn(column);
            const inputDisabled =
              isSaving ||
              binary ||
              !field.include ||
              field.isNull;

            return (
              <div
                key={column.name}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <label
                      htmlFor={`row-field-${column.name}`}
                      className="font-semibold text-slate-900"
                    >
                      {column.name}
                    </label>

                    <p className="mt-1 text-xs text-slate-500">
                      {column.declaredType || "Any type"}
                      {column.primaryKeyOrder > 0
                        ? " · Primary key"
                        : ""}
                      {column.notNull ? " · Required" : ""}
                      {column.defaultValue !== null
                        ? ` · Default: ${String(
                            column.defaultValue,
                          )}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                      <input
                        type="checkbox"
                        checked={field.include}
                        disabled={binary || isSaving}
                        onChange={(event) =>
                          updateField(column.name, {
                            include: event.target.checked,
                          })
                        }
                      />
                      {mode === "insert" ? "Include" : "Update"}
                    </label>

                    <label className="flex items-center gap-2 text-slate-600">
                      <input
                        type="checkbox"
                        checked={field.isNull}
                        disabled={
                          binary ||
                          isSaving ||
                          !field.include
                        }
                        onChange={(event) =>
                          updateField(column.name, {
                            isNull: event.target.checked,
                          })
                        }
                      />
                      NULL
                    </label>
                  </div>
                </div>

                <input
                  id={`row-field-${column.name}`}
                  type={
                    isIntegerColumn(column) ||
                    isNumericColumn(column)
                      ? "number"
                      : "text"
                  }
                  step={
                    isNumericColumn(column) ? "any" : undefined
                  }
                  value={field.value}
                  disabled={inputDisabled}
                  onChange={(event) =>
                    updateField(column.name, {
                      value: event.target.value,
                    })
                  }
                  placeholder={
                    binary
                      ? "Binary editing is not supported yet"
                      : field.isNull
                        ? "NULL"
                        : `Enter ${column.name}`
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            );
          })}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void submitRow()}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Save size={16} aria-hidden="true" />
            {isSaving
              ? "Saving..."
              : mode === "insert"
                ? "Add Row"
                : "Save Changes"}
          </button>
        </footer>
      </section>
    </div>
  );
}
