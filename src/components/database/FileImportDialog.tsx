"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";

import { createImportPreview } from "@/lib/import/create-import-preview";
import { normalizeColumnName } from "@/lib/import/normalize-column-name";
import { parseImportFile } from "@/lib/import/parse-import-file";
import { sqliteClient } from "@/lib/sqlite/sqlite-client";

import type { DatabaseTableSummary } from "@/types/database";
import type {
  ImportMode,
  ImportResult,
  ParsedImportFile,
} from "@/types/import";

type FileImportDialogProps = {
  tables: DatabaseTableSummary[];
  onClose: () => void;
  onImported: (
    result: ImportResult,
  ) => Promise<void> | void;
};

const PREVIEW_ROW_LIMIT = 20;
const MAX_IMPORT_ROWS = 100_000;

function getDefaultTableName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(
    /\.[^.]+$/,
    "",
  );

  return normalizeColumnName(
    nameWithoutExtension || "ImportedData",
    0,
  );
}

function formatPreviewValue(value: unknown): string {
  if (value === null) {
    return "NULL";
  }

  return String(value);
}

export function FileImportDialog({
  tables,
  onClose,
  onImported,
}: FileImportDialogProps) {
  const [parsedFile, setParsedFile] =
    useState<ParsedImportFile | null>(null);

  const [selectedSheetName, setSelectedSheetName] =
    useState("");

  const [useFirstRowAsHeader, setUseFirstRowAsHeader] =
    useState(true);

  const [mode, setMode] = useState<ImportMode>("create");
  const [newTableName, setNewTableName] = useState("");
  const [existingTableName, setExistingTableName] =
    useState(tables[0]?.name ?? "");

  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSheet =
    parsedFile?.sheets.find(
      (sheet) => sheet.name === selectedSheetName,
    ) ??
    parsedFile?.sheets[0] ??
    null;

  const preview = useMemo(
    () =>
      selectedSheet
        ? createImportPreview(
            selectedSheet,
            useFirstRowAsHeader,
          )
        : null,
    [selectedSheet, useFirstRowAsHeader],
  );

  const activeExistingTableName = tables.some(
    (table) => table.name === existingTableName,
  )
    ? existingTableName
    : (tables[0]?.name ?? "");

  const targetTableName =
    mode === "create"
      ? newTableName.trim()
      : activeExistingTableName;

  async function selectFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const nextParsedFile = await parseImportFile(file);

      setParsedFile(nextParsedFile);
      setSelectedSheetName(
        nextParsedFile.sheets[0]?.name ?? "",
      );
      setUseFirstRowAsHeader(true);
      setMode("create");
      setNewTableName(
        getDefaultTableName(nextParsedFile.fileName),
      );
    } catch (parseError) {
      setParsedFile(null);
      setSelectedSheetName("");
      setError(
        parseError instanceof Error
          ? parseError.message
          : "The selected file could not be parsed.",
      );
    } finally {
      setIsParsing(false);
    }
  }

  async function importFile() {
    if (!preview) {
      return;
    }

    setError(null);

    if (!targetTableName) {
      setError("Select or enter a target table.");
      return;
    }

    if (preview.columns.length === 0) {
      setError("No importable columns were detected.");
      return;
    }

    if (preview.totalRows === 0) {
      setError("No importable data rows were detected.");
      return;
    }

    if (preview.totalRows > MAX_IMPORT_ROWS) {
      setError(
        `The file contains more than ${MAX_IMPORT_ROWS.toLocaleString(
          "en-US",
        )} rows.`,
      );
      return;
    }

    if (
      mode === "replace" &&
      !window.confirm(
        `Replace table "${targetTableName}"? Its current structure and all rows will be deleted.`,
      )
    ) {
      return;
    }

    setIsImporting(true);

    try {
      const result = await sqliteClient.importData({
        tableName: targetTableName,
        mode,
        columns: preview.columns,
        rows: preview.rows,
      });

      await onImported(result);
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "The file could not be imported.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  const canImport =
    preview !== null &&
    preview.columns.length > 0 &&
    preview.totalRows > 0 &&
    preview.totalRows <= MAX_IMPORT_ROWS &&
    Boolean(targetTableName) &&
    !isParsing &&
    !isImporting;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/65 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-import-title"
        className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3
              id="file-import-title"
              className="text-xl font-bold text-slate-900"
            >
              Import Excel or CSV
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Files are processed locally and never leave your
              browser.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isParsing || isImporting}
            aria-label="Close file import"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <FileSpreadsheet
              size={36}
              className="mx-auto text-emerald-600"
              aria-hidden="true"
            />

            <h4 className="mt-3 font-semibold text-slate-900">
              Select an Excel or CSV file
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              XLSX, XLS, or CSV · Maximum file size 25 MB
            </p>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              <Upload size={16} aria-hidden="true" />

              {isParsing ? "Reading File..." : "Choose File"}

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                disabled={isParsing || isImporting}
                onChange={(event) => void selectFile(event)}
                className="sr-only"
              />
            </label>

            {parsedFile && (
              <p className="mt-3 text-sm font-medium text-slate-700">
                {parsedFile.fileName}
              </p>
            )}
          </section>

          {parsedFile && selectedSheet && preview && (
            <>
              <section className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Worksheet
                  </span>

                  <select
                    value={selectedSheet.name}
                    onChange={(event) =>
                      setSelectedSheetName(event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    {parsedFile.sheets.map((sheet) => (
                      <option
                        key={sheet.name}
                        value={sheet.name}
                      >
                        {sheet.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <span className="text-sm font-semibold text-slate-700">
                    Header
                  </span>

                  <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={useFirstRowAsHeader}
                      onChange={(event) =>
                        setUseFirstRowAsHeader(
                          event.target.checked,
                        )
                      }
                    />
                    Use first row as column names
                  </label>
                </div>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Import mode
                  </span>

                  <select
                    value={mode}
                    onChange={(event) =>
                      setMode(event.target.value as ImportMode)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="create">
                      Create new table
                    </option>
                    <option
                      value="append"
                      disabled={tables.length === 0}
                    >
                      Append rows
                    </option>
                    <option
                      value="replace"
                      disabled={tables.length === 0}
                    >
                      Replace table
                    </option>
                  </select>
                </label>

                {mode === "create" ? (
                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      New table name
                    </span>

                    <input
                      value={newTableName}
                      onChange={(event) =>
                        setNewTableName(event.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>
                ) : (
                  <label>
                    <span className="text-sm font-semibold text-slate-700">
                      Existing table
                    </span>

                    <select
                      value={activeExistingTableName}
                      onChange={(event) =>
                        setExistingTableName(
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
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
                )}
              </section>

              <section>
                <h4 className="font-semibold text-slate-900">
                  Detected Columns
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {preview.columns.length} columns and{" "}
                  {preview.totalRows.toLocaleString("en-US")} rows
                </p>

                <div className="mt-3 overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-3 py-2">Source</th>
                        <th className="px-3 py-2">SQL column</th>
                        <th className="px-3 py-2">Type</th>
                      </tr>
                    </thead>

                    <tbody>
                      {preview.columns.map((column) => (
                        <tr
                          key={column.targetName}
                          className="border-t border-slate-100"
                        >
                          <td className="px-3 py-2">
                            {column.sourceName}
                          </td>
                          <td className="px-3 py-2 font-mono">
                            {column.targetName}
                          </td>
                          <td className="px-3 py-2">
                            {column.detectedType}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-slate-900">
                  Data Preview
                </h4>

                <div className="mt-3 max-h-[320px] overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-100">
                      <tr>
                        {preview.columns.map((column) => (
                          <th
                            key={column.targetName}
                            className="whitespace-nowrap px-3 py-2"
                          >
                            {column.targetName}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {preview.rows
                        .slice(0, PREVIEW_ROW_LIMIT)
                        .map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="border-t border-slate-100"
                          >
                            {preview.columns.map(
                              (column, columnIndex) => (
                                <td
                                  key={column.targetName}
                                  className="whitespace-nowrap px-3 py-2"
                                >
                                  {formatPreviewValue(
                                    row[columnIndex] ?? null,
                                  )}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void importFile()}
            disabled={!canImport}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isImporting
              ? "Importing..."
              : `Import ${
                  preview?.totalRows.toLocaleString("en-US") ?? 0
                } Rows`}
          </button>
        </footer>
      </section>
    </div>
  );
}
