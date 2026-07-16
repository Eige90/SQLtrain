"use client";

import { useState } from "react";
import {
  Eye,
  FileSpreadsheet,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

import { DeleteTableButton } from "@/components/database/DeleteTableButton";
import { FileImportDialog } from "@/components/database/FileImportDialog";
import { RelationshipsPanel } from "@/components/database/RelationshipsPanel";
import { TableDataPanel } from "@/components/database/TableDataPanel";
import type { DatabaseTableSummary } from "@/types/database";

type DatabaseManagerDialogProps = {
  isOpen: boolean;
  tables: DatabaseTableSummary[];
  onClose: () => void;
  onUseSql: (sql: string) => void;
  onDatabaseChanged: () => Promise<void> | void;
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
  onDatabaseChanged,
}: DatabaseManagerDialogProps) {
  const [selectedTableName, setSelectedTableName] =
    useState<string | null>(null);

  const [isImportDialogOpen, setIsImportDialogOpen] =
    useState(false);

  const activeTableName: string | null = tables.some(
    (table) => table.name === selectedTableName,
  )
    ? selectedTableName
    : (tables[0]?.name ?? null);

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
              Inspect and edit your local training database.
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
                    Select a table to inspect and edit its records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUseSql(CREATE_TABLE_TEMPLATE)
                  }
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={16} aria-hidden="true" />
                  Create Table
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                {tables.map((table) => {
                  const isSelected =
                    table.name === activeTableName;

                  return (
                    <div
                      key={table.name}
                      className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                        isSelected
                          ? "bg-emerald-50"
                          : "bg-white"
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

                        <DeleteTableButton
                          tableName={table.name}
                          recordCount={table.recordCount}
                          onDeleted={onDatabaseChanged}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <TableDataPanel
              key={activeTableName ?? "no-table"}
              tableName={activeTableName}
              onDatabaseChanged={onDatabaseChanged}
            />
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
                Import XLSX, XLS, or CSV files directly in your
                browser. Files remain on your device and are not
                uploaded to a server.
              </p>

              <button
                type="button"
                onClick={() => setIsImportDialogOpen(true)}
                className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Import Excel or CSV
              </button>
            </div>

            <RelationshipsPanel
              key={
                tables
                  .map((table) => table.name)
                  .join("|") || "no-tables"
              }
              tables={tables}
              onDatabaseChanged={onDatabaseChanged}
            />
          </aside>
        </div>
      </section>

      {isImportDialogOpen && (
        <FileImportDialog
          tables={tables}
          onClose={() => setIsImportDialogOpen(false)}
          onImported={async (result) => {
            await onDatabaseChanged();
            setSelectedTableName(result.tableName);
            setIsImportDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
