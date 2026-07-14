import type { DatabaseValue, QueryResult } from "@/types/database";

type QueryResultsProps = {
  result: QueryResult | null;
  error: string | null;
};

function formatValue(value: DatabaseValue): string {
  if (value === null) {
    return "NULL";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Uint8Array || value instanceof Int8Array) {
    return `[BLOB: ${value.byteLength} bytes]`;
  }

  if (value instanceof ArrayBuffer) {
    return `[BLOB: ${value.byteLength} bytes]`;
  }

  return String(value);
}

export function QueryResults({ result, error }: QueryResultsProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">SQL error</p>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{error}</pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Run a SQL statement to see the result.
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        Statement completed successfully. {result.affectedRows} row(s) changed in {result.executionTimeMs.toFixed(2)} ms.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <span>{result.rows.length} row(s)</span>
        <span>{result.executionTimeMs.toFixed(2)} ms</span>
      </div>

      <div className="max-h-[420px] overflow-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-100 text-left text-slate-700">
            <tr>
              {result.columns.map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 font-semibold last:border-r-0"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-white even:bg-slate-50">
                {row.map((value, columnIndex) => (
                  <td
                    key={`${rowIndex}-${columnIndex}`}
                    className="max-w-80 whitespace-pre-wrap border-b border-r border-slate-100 px-3 py-2 align-top text-slate-700 last:border-r-0"
                  >
                    {formatValue(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
