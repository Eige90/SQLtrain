"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { sqliteClient } from "@/lib/sqlite/sqlite-client";
import type {
  DatabaseTableData,
  DatabaseValue,
} from "@/types/database";

type TableDataPanelProps = {
  tableName: string | null;
};

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
}: TableDataPanelProps) {
  const [tableData, setTableData] =
    useState<DatabaseTableData | null>(null);

  const [offset, setOffset] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOffset(0);
  }, [tableName]);

  useEffect(() => {
    let isActive = true;

    async function loadTableData() {
      if (!tableName) {
        setTableData(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

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
      } catch (loadError) {
        if (isActive) {
          setTableData(null);
          setError(
            loadError instanceof Error
              ? loadError.message
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

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setReloadKey((currentValue) => currentValue + 1)
            }
            disabled={isLoading}
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
                Math.max(0, currentOffset - PAGE_SIZE),
              )
            }
            disabled={!canGoBack || isLoading}
            aria-label="Previous page"
            className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() =>
              setOffset(
                (currentOffset) => currentOffset + PAGE_SIZE,
              )
            }
            disabled={!canGoForward || isLoading}
            aria-label="Next page"
            className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="max-h-[420px] overflow-auto">
        {tableData && tableData.rows.length > 0 ? (
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr>
                {tableData.columns.map((column) => (
                  <th
                    key={column.name}
                    className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700 last:border-r-0"
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
              </tr>
            </thead>

            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr
                  key={`${tableData.offset}-${rowIndex}`}
                  className="odd:bg-white even:bg-slate-50"
                >
                  {tableData.columns.map((column) => {
                    const value = row.values[column.name];

                    return (
                      <td
                        key={column.name}
                        className={`whitespace-nowrap border-b border-r border-slate-100 px-3 py-2 last:border-r-0 ${
                          value === null
                            ? "italic text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {formatDatabaseValue(value)}
                      </td>
                    );
                  })}
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
  );
}
