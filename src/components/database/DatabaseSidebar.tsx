"use client";

import { Database, RotateCcw, Settings2 } from "lucide-react";

import type { DatabaseTableSummary } from "@/types/database";

type DatabaseSidebarProps = {
  tables: DatabaseTableSummary[];
  isLoading: boolean;
  onOpenManager: () => void;
  onSelectTable: (tableName: string) => void;
  onReset: () => void;
};

export function DatabaseSidebar({
  tables,
  isLoading,
  onOpenManager,
  onSelectTable,
  onReset,
}: DatabaseSidebarProps) {
  return (
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onOpenManager}
        className="flex w-full items-center justify-between border-b border-slate-200 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <Database size={18} aria-hidden="true" />
          Your Database
        </span>
        <Settings2 size={17} aria-hidden="true" className="text-slate-500" />
      </button>

      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Tablenames</span>
        <span>Records</span>
      </div>

      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className="px-5 py-6 text-sm text-slate-500">Loading database...</div>
        ) : (
          tables.map((table) => (
            <button
              type="button"
              key={table.name}
              onClick={() => onSelectTable(table.name)}
              className="grid w-full grid-cols-[1fr_auto] gap-4 px-5 py-2.5 text-left text-sm transition hover:bg-emerald-50"
            >
              <span className="font-medium text-emerald-700">{table.name}</span>
              <span className="tabular-nums text-slate-600">{table.recordCount}</span>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Restore Database
        </button>
      </div>
    </aside>
  );
}
