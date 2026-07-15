"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

import { DatabaseManagerDialog } from "@/components/database/DatabaseManagerDialog";
import { DatabaseSidebar } from "@/components/database/DatabaseSidebar";
import { SqlEditor } from "@/components/editor/SqlEditor";
import { QueryResults } from "@/components/results/QueryResults";
import { sqliteClient } from "@/lib/sqlite/sqlite-client";
import type {
  DatabaseInitializationResult,
  DatabaseTableSummary,
  QueryResult,
} from "@/types/database";

const DEFAULT_SQL = "SELECT * FROM Customers;";

export function SqlWorkbench() {
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [tables, setTables] = useState<DatabaseTableSummary[]>([]);
  const [storageInfo, setStorageInfo] =
    useState<DatabaseInitializationResult | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const refreshTables = useCallback(async () => {
    setTables(await sqliteClient.listTables());
  }, []);

  useEffect(() => {
    let isActive = true;

    async function initialize() {
      try {
        const initializationResult =
          await sqliteClient.initialize();

        const nextTables = await sqliteClient.listTables();

        if (isActive) {
          setStorageInfo(initializationResult);
          setTables(nextTables);
          setError(null);
        }
      } catch (initializationError) {
        if (isActive) {
          setError(
            initializationError instanceof Error
              ? initializationError.message
              : "Could not initialize SQLite.",
          );
        }
      } finally {
        if (isActive) {
          setIsInitializing(false);
        }
      }
    }

    void initialize();

    return () => {
      isActive = false;
    };
  }, []);

  async function executeSql(sqlToExecute = sql) {
    if (!sqlToExecute.trim() || isInitializing || isExecuting) {
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      setResult(await sqliteClient.execute(sqlToExecute));
      await refreshTables();
    } catch (executionError) {
      setResult(null);
      setError(
        executionError instanceof Error
          ? executionError.message
          : "The SQL statement failed.",
      );
    } finally {
      setIsExecuting(false);
    }
  }

  async function selectTable(tableName: string) {
    const nextSql = `SELECT * FROM ${tableName};`;
    setSql(nextSql);
    await executeSql(nextSql);
  }

  async function restoreDatabase() {
    const shouldRestore = window.confirm(
      "Restore the original Northwind database? All changes from this browser session will be lost.",
    );

    if (!shouldRestore) {
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      await sqliteClient.reset();
      await refreshTables();
      setSql(DEFAULT_SQL);
      setResult(await sqliteClient.execute(DEFAULT_SQL));
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Could not restore the database.",
      );
    } finally {
      setIsExecuting(false);
    }
  }

  function useSqlFromManager(nextSql: string) {
    setSql(nextSql);
    setIsManagerOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SQLTrain</h1>
            <p className="text-sm text-slate-400">Interactive SQL training environment</p>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
            {storageInfo?.storageMode === "persistent"
              ? "SQLite · Saved in Browser"
              : "SQLite · Temporary Session"}
          </span>
        </div>
      </header>

      {storageInfo?.warning && (
        <div className="mx-auto mt-4 max-w-[1600px] px-4 sm:px-6">
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {storageInfo.warning}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1600px] gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div>
                <h2 className="font-semibold text-slate-900">SQL Statement</h2>
                <p className="text-xs text-slate-500">Run SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, and DROP statements.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSql(DEFAULT_SQL)}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Reset Editor
                </button>
                <button
                  type="button"
                  onClick={() => void executeSql()}
                  disabled={isInitializing || isExecuting}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  {isExecuting ? "Running..." : "Run SQL"}
                </button>
              </div>
            </div>
            <SqlEditor value={sql} onChange={setSql} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Result</h2>
            <QueryResults result={result} error={error} />
          </div>
        </section>

        <DatabaseSidebar
          tables={tables}
          isLoading={isInitializing}
          onOpenManager={() => setIsManagerOpen(true)}
          onSelectTable={(tableName) => void selectTable(tableName)}
          onReset={() => void restoreDatabase()}
        />
      </div>

      <DatabaseManagerDialog
        isOpen={isManagerOpen}
        tables={tables}
        onClose={() => setIsManagerOpen(false)}
        onUseSql={useSqlFromManager}
        onDatabaseChanged={refreshTables}
      />
    </main>
  );
}
