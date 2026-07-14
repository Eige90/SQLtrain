"use client";

import { useEffect, useState } from "react";

import { sqliteClient } from "@/lib/sqlite/sqlite-client";
import type {
  DatabaseTableData,
  DatabaseValue,
} from "@/types/database";

type TableDataPanelProps = {
  tableName: string | null;
};

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

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
            limit: 50,
            offset: 0,
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
  }, [tableName]);

  if (!tableName) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        Select a table to inspect its records.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
        Loading {tableName}...
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

  if (!tableData) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <h4 className="font-semibold text-slate-900">
            {tableData.tableName}
          </h4>
          <p className="text-xs text-slate-500">
            Showing {tableData.rows.length} of{" "}
            {tableData.totalRows} records
          </p>
        </div>
      </header>

      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              {tableData.columns.map((column) => (
                <th
                  key={column.name}
                  className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700 last:border-r-0"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="odd:bg-white even:bg-slate-50"
              >
                {tableData.columns.map((column) => (
                  <td
                    key={column.name}
                    className="whitespace-nowrap border-b border-r border-slate-100 px-3 py-2 text-slate-700 last:border-r-0"
                  >
                    {formatDatabaseValue(
                      row.values[column.name],
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
