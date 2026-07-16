"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Play, RotateCcw, ShieldCheck, TrainFront } from "lucide-react";

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
    <main className="min-h-screen bg-transparent">
      <header className="border-b border-sky-400/20 bg-[linear-gradient(135deg,#07111f_0%,#0b1b33_55%,#312e81_100%)] text-white shadow-xl shadow-slate-950/20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 ring-1 ring-sky-300/30">
              <TrainFront
                size={28}
                className="text-sky-300"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                All aboard
              </p>

              <h1 className="text-3xl font-black tracking-tight">
                SQLTrain
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Practice SQL safely with your own data.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
              <ShieldCheck size={14} aria-hidden="true" />
              Local and private
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
              {storageInfo?.storageMode === "persistent"
                ? "SQLite · Saved in Browser"
                : "SQLite · Temporary Session"}
            </span>
          </div>
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

      <footer className="mt-8 border-t border-slate-800 bg-[#07111f] px-4 py-6 text-slate-300 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">
              Jump aboard SQLTrain.
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Your SQL queries, files, and database remain in your browser.
            </p>
          </div>

          <a
            href="https://github.com/Eige90"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-sky-300 transition hover:bg-white/5 hover:text-sky-200"
          >
            <ExternalLink size={18} aria-hidden="true" />
            Built by Eige90
          </a>
        </div>
      </footer>

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
