"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { RowEditorDialog } from "@/components/database/RowEditorDialog";
import { sqliteClient } from "@/lib/sqlite/sqlite-client";
import type {
  DatabaseRecord,
  DatabaseRow,
  DatabaseTableData,
  DatabaseValue,
} from "@/types/database";

type TableDataPanelProps = {
  tableName: string | null;
  onDatabaseChanged: () => Promise<void> | void;
};

type EditorMode = "insert" | "edit";

const PAGE_SIZE = 50;

function formatDatabaseValue(value: DatabaseValue): string {
  if (value === null) {
    return "NULL";
  }

  if (
    value instanceof Uint8Array ||
    value instanceof Int8Array ||
    value instanceof ArrayBuffer
  ) {
    return "[Binary data]";
  }

  return String(value);
}

export function TableDataPanel({
  tableName,
  onDatabaseChanged,
}: TableDataPanelProps) {
  const [tableData, setTableData] =
    useState<DatabaseTableData | null>(null);

  const [offset, setOffset] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(
    null,
  );
  const [mutationError, setMutationError] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorMode, setEditorMode] =
    useState<EditorMode | null>(null);
  const [editingRow, setEditingRow] =
    useState<DatabaseRow | null>(null);

  useEffect(() => {
    setOffset(0);
    setEditorMode(null);
    setEditingRow(null);
    setMutationError(null);
  }, [tableName]);

  useEffect(() => {
    let isActive = true;

    async function loadTableData() {
      if (!tableName) {
        setTableData(null);
        setLoadError(null);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const nextTableData = await sqliteClient.getTableData(
          tableName,
          {
            limit: PAGE_SIZE,
            offset,
          },
        );

        if (isActive) {
          setTableData(nextTableData);
        }
      } catch (error) {
        if (isActive) {
          setTableData(null);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load the table.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadTableData();

    return () => {
      isActive = false;
    };
  }, [offset, reloadKey, tableName]);

  if (!tableName) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        Select a table to inspect its records.
      </div>
    );
  }

  async function saveRow(values: DatabaseRecord) {
    if (!tableName || !editorMode) {
      return;
    }

    setIsSaving(true);
    setMutationError(null);

    try {
      if (editorMode === "insert") {
        await sqliteClient.insertRow({
          tableName,
          values,
        });
      } else {
        if (!editingRow) {
          throw new Error("No row was selected for editing.");
        }

        await sqliteClient.updateRow({
          tableName,
          identity: editingRow.identity,
          values,
        });
      }

      setEditorMode(null);
      setEditingRow(null);
      await onDatabaseChanged();
      setReloadKey((currentValue) => currentValue + 1);
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "The row could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRow(row: DatabaseRow) {
    if (!tableName || !tableData) {
      return;
    }

    const confirmed = window.confirm(
      `Delete this row from "${tableName}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setMutationError(null);

    try {
      await sqliteClient.deleteRow({
        tableName,
        identity: row.identity,
      });

      await onDatabaseChanged();

      if (tableData.rows.length === 1 && offset > 0) {
        setOffset((currentOffset) =>
          Math.max(0, currentOffset - PAGE_SIZE),
        );
      } else {
        setReloadKey((currentValue) => currentValue + 1);
      }
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "The row could not be deleted.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openInsertEditor() {
    setMutationError(null);
    setEditingRow(null);
    setEditorMode("insert");
  }

  function openEditEditor(row: DatabaseRow) {
    setMutationError(null);
    setEditingRow(row);
    setEditorMode("edit");
  }

  const firstVisibleRow =
    tableData && tableData.totalRows > 0
      ? tableData.offset + 1
      : 0;

  const lastVisibleRow = tableData
    ? Math.min(
        tableData.offset + tableData.rows.length,
        tableData.totalRows,
      )
    : 0;

  const canGoBack = offset > 0;

  const canGoForward = tableData
    ? offset + tableData.limit < tableData.totalRows
    : false;

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-slate-200">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <h4 className="font-semibold text-slate-900">
              {tableName}
            </h4>

            <p className="text-xs text-slate-500">
              {isLoading
                ? "Loading records..."
                : `Showing ${firstVisibleRow}–${lastVisibleRow} of ${
                    tableData?.totalRows ?? 0
                  } records`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openInsertEditor}
              disabled={
                isLoading ||
                isSaving ||
                !tableData
              }
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              <Plus size={15} aria-hidden="true" />
              Add Row
            </button>

            <button
              type="button"
              onClick={() =>
                setReloadKey(
                  (currentValue) => currentValue + 1,
                )
              }
              disabled={isLoading || isSaving}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <RefreshCw
                size={15}
                className={isLoading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                setOffset((currentOffset) =>
                  Math.max(
                    0,
                    currentOffset - PAGE_SIZE,
                  ),
                )
              }
              disabled={
                !canGoBack || isLoading || isSaving
              }
              aria-label="Previous page"
              className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                setOffset(
                  (currentOffset) =>
                    currentOffset + PAGE_SIZE,
                )
              }
              disabled={
                !canGoForward || isLoading || isSaving
              }
              aria-label="Next page"
              className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        {(loadError || mutationError) && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError ?? mutationError}
          </div>
        )}

        <div className="max-h-[440px] overflow-auto">
          {tableData && tableData.rows.length > 0 ? (
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr>
                  {tableData.columns.map((column) => (
                    <th
                      key={column.name}
                      className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700"
                    >
                      <div>{column.name}</div>

                      <div className="mt-0.5 text-[10px] font-normal uppercase tracking-wide text-slate-400">
                        {column.declaredType || "Any"}
                        {column.primaryKeyOrder > 0
                          ? " · Primary key"
                          : ""}
                      </div>
                    </th>
                  ))}

                  <th className="sticky right-0 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr
                    key={`${tableData.offset}-${rowIndex}`}
                    className="odd:bg-white even:bg-slate-50"
                  >
                    {tableData.columns.map((column) => {
                      const value =
                        row.values[column.name];

                      return (
                        <td
                          key={column.name}
                          className={`whitespace-nowrap border-b border-r border-slate-100 px-3 py-2 ${
                            value === null
                              ? "italic text-slate-400"
                              : "text-slate-700"
                          }`}
                        >
                          {formatDatabaseValue(value)}
                        </td>
                      );
                    })}

                    <td className="sticky right-0 whitespace-nowrap border-b border-slate-100 bg-inherit px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditEditor(row)
                          }
                          disabled={isSaving}
                          className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
                        >
                          <Pencil
                            size={13}
                            aria-hidden="true"
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void deleteRow(row)
                          }
                          disabled={isSaving}
                          className="flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed"
                        >
                          <Trash2
                            size={13}
                            aria-hidden="true"
                          />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              {isLoading
                ? "Loading records..."
                : "This table does not contain any records."}
            </div>
          )}
        </div>
      </section>

      <RowEditorDialog
        isOpen={editorMode !== null}
        mode={editorMode ?? "insert"}
        tableName={tableName}
        columns={tableData?.columns ?? []}
        initialValues={editingRow?.values}
        isSaving={isSaving}
        error={mutationError}
        onClose={() => {
          if (!isSaving) {
            setEditorMode(null);
            setEditingRow(null);
            setMutationError(null);
          }
        }}
        onSave={saveRow}
      />
    </>
  );
}
