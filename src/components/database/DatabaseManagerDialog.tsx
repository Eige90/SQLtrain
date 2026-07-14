"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  Eye,
  FileSpreadsheet,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

import { TableDataPanel } from "@/components/database/TableDataPanel";
import type { DatabaseTableSummary } from "@/types/database";

type DatabaseManagerDialogProps = {
  isOpen: boolean;
  tables: DatabaseTableSummary[];
  onClose: () => void;
  onUseSql: (sql: string) => void;
};

const CREATE_TABLE_TEMPLATE = `CREATE TABLE NewTable (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL
);`;

export function DatabaseManagerDialog({
  isOpen,
  tables,
  onClose,
  onUseSql,
}: DatabaseManagerDialogProps) {
  const [selectedTableName, setSelectedTableName] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const selectedTableStillExists = tables.some(
      (table) => table.name === selectedTableName,
    );

    if (!selectedTableStillExists) {
      setSelectedTableName(tables[0]?.name ?? null);
    }
  }, [isOpen, selectedTableName, tables]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="database-manager-title"
        className="max-h-[92vh] w-full max-w-7xl overflow-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="database-manager-title"
              className="text-xl font-bold text-slate-900"
            >
              Database Manager
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Inspect tables and manage your local training database.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close database manager"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Tables
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select a table to preview its records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onUseSql(CREATE_TABLE_TEMPLATE)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={16} aria-hidden="true" />
                  Create Table
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                {tables.map((table) => {
                  const isSelected =
                    table.name === selectedTableName;

                  return (
                    <div
                      key={table.name}
                      className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                        isSelected ? "bg-emerald-50" : "bg-white"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {table.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {table.recordCount} records
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedTableName(table.name)
                          }
                          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                            isSelected
                              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                              : "border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <Eye size={15} aria-hidden="true" />
                          View Data
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUseSql(
                              `SELECT * FROM "${table.name.replaceAll(
                                '"',
                                '""',
                              )}";`,
                            )
                          }
                          className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <PencilLine
                            size={15}
                            aria-hidden="true"
                          />
                          Open in Editor
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <TableDataPanel tableName={selectedTableName} />

            <p className="text-sm leading-6 text-slate-600">
              This preview is currently read-only. Direct row editing,
              insertion, deletion, and pagination will be added next.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <FileSpreadsheet
                  size={18}
                  aria-hidden="true"
                />
                Excel and CSV Import
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                File selection, column mapping, preview, and
                transactional import are planned for a later
                milestone.
              </p>

              <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400"
              >
                Import File — Coming Later
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Cloud size={18} aria-hidden="true" />
                Cloud Connections
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                PostgreSQL, MySQL, and SQL Server connections will
                use a secure backend adapter instead of exposing
                credentials in the browser.
              </p>

              <span className="mt-4 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                Planned
              </span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
