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
import { parseImportFile } from "@/lib/import/parse-import-file";

import type { DatabaseValue } from "@/types/database";
import type { ParsedImportFile } from "@/types/import";

type FileImportDialogProps = {
  onClose: () => void;
};

const PREVIEW_ROW_LIMIT = 20;

function formatPreviewValue(value: DatabaseValue): string {
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

export function FileImportDialog({
  onClose,
}: FileImportDialogProps) {
  const [parsedFile, setParsedFile] =
    useState<ParsedImportFile | null>(null);

  const [selectedSheetName, setSelectedSheetName] =
    useState("");

  const [useFirstRowAsHeader, setUseFirstRowAsHeader] =
    useState(true);

  const [isParsing, setIsParsing] = useState(false);
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
              Select a file, choose a worksheet, and review
              the detected data.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isParsing}
            aria-label="Close file import"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed"
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

          <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex flex-col items-center text-center">
              <FileSpreadsheet
                size={36}
                className="text-emerald-600"
                aria-hidden="true"
              />

              <h4 className="mt-3 font-semibold text-slate-900">
                Select an Excel or CSV file
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Supported formats: XLSX, XLS, and CSV. Maximum
                file size: 25 MB.
              </p>

              <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <Upload size={16} aria-hidden="true" />

                {isParsing ? "Reading File..." : "Choose File"}

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  disabled={isParsing}
                  onChange={(event) => void selectFile(event)}
                  className="sr-only"
                />
              </label>

              {parsedFile && (
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {parsedFile.fileName}
                </p>
              )}
            </div>
          </section>

          {parsedFile && selectedSheet && preview && (
            <>
              <section className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Worksheet
                  </span>

                  <select
                    value={selectedSheet.name}
                    onChange={(event) =>
                      setSelectedSheetName(event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                    Header Settings
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
              </section>

              <section>
                <h4 className="font-semibold text-slate-900">
                  Detected Columns
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {preview.columns.length} columns and{" "}
                  {preview.totalRows} data rows detected.
                </p>

                <div className="mt-3 overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700">
                          Source column
                        </th>

                        <th className="border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700">
                          SQL column
                        </th>

                        <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-700">
                          Detected type
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {preview.columns.map((column) => (
                        <tr
                          key={`${column.sourceName}-${column.targetName}`}
                          className="odd:bg-white even:bg-slate-50"
                        >
                          <td className="border-b border-r border-slate-100 px-3 py-2 text-slate-700">
                            {column.sourceName}
                          </td>

                          <td className="border-b border-r border-slate-100 px-3 py-2 font-mono text-slate-700">
                            {column.targetName}
                          </td>

                          <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
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

                <p className="mt-1 text-sm text-slate-500">
                  Showing up to {PREVIEW_ROW_LIMIT} rows.
                </p>

                <div className="mt-3 max-h-[360px] overflow-auto rounded-xl border border-slate-200">
                  {preview.columns.length > 0 &&
                  preview.rows.length > 0 ? (
                    <table className="min-w-full border-collapse text-left text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr>
                          {preview.columns.map((column) => (
                            <th
                              key={column.targetName}
                              className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700 last:border-r-0"
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
                              className="odd:bg-white even:bg-slate-50"
                            >
                              {preview.columns.map(
                                (column, columnIndex) => {
                                  const value =
                                    row[columnIndex] ?? null;

                                  return (
                                    <td
                                      key={column.targetName}
                                      className={`whitespace-nowrap border-b border-r border-slate-100 px-3 py-2 last:border-r-0 ${
                                        value === null
                                          ? "italic text-slate-400"
                                          : "text-slate-700"
                                      }`}
                                    >
                                      {formatPreviewValue(value)}
                                    </td>
                                  );
                                },
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No importable rows were detected.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
          >
            Import to Database — Next Step
          </button>
        </footer>
      </section>
    </div>
  );
}
