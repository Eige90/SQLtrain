"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { sqliteClient } from "@/lib/sqlite/sqlite-client";

type DeleteTableButtonProps = {
  tableName: string;
  recordCount: number;
  onDeleted: () => Promise<void> | void;
};

const DEFAULT_TABLES = new Set([
  "Customers",
  "Categories",
  "Employees",
  "OrderDetails",
  "Orders",
  "Products",
  "Shippers",
  "Suppliers",
]);

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function findReferencingTables(
  targetTableName: string,
): Promise<string[]> {
  const tableResult = await sqliteClient.execute(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `);

  const referencingTables = new Set<string>();
  const normalizedTargetName = targetTableName.toLowerCase();

  for (const [rawTableName] of tableResult.rows) {
    const tableName = String(rawTableName ?? "");

    if (
      !tableName ||
      tableName.toLowerCase() === normalizedTargetName
    ) {
      continue;
    }

    const foreignKeyResult = await sqliteClient.execute(
      `PRAGMA foreign_key_list(${quoteIdentifier(tableName)});`,
    );

    const referencedTableColumnIndex =
      foreignKeyResult.columns.findIndex(
        (columnName) =>
          columnName.toLowerCase() === "table",
      );

    if (referencedTableColumnIndex === -1) {
      continue;
    }

    const referencesTarget = foreignKeyResult.rows.some(
      (row) =>
        String(
          row[referencedTableColumnIndex] ?? "",
        ).toLowerCase() === normalizedTargetName,
    );

    if (referencesTarget) {
      referencingTables.add(tableName);
    }
  }

  return [...referencingTables].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function DeleteTableButton({
  tableName,
  recordCount,
  onDeleted,
}: DeleteTableButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteTable(): Promise<void> {
    setIsDeleting(true);

    try {
      const referencingTables =
        await findReferencingTables(tableName);

      if (referencingTables.length > 0) {
        window.alert(
          `Table "${tableName}" cannot be deleted because it is referenced by:\n\n` +
            referencingTables
              .map((name) => `• ${name}`)
              .join("\n") +
            `\n\nDelete the referencing table first, then try again.`,
        );

        return;
      }

      const isDefaultTable = DEFAULT_TABLES.has(tableName);

      const warning = isDefaultTable
        ? `Delete the Northwind table "${tableName}" with ${recordCount} records?\n\nYou can restore the original database later with Restore Database.`
        : `Delete table "${tableName}" with ${recordCount} records?\n\nThis action cannot be undone.`;

      if (!window.confirm(warning)) {
        return;
      }

      await sqliteClient.execute(
        `DROP TABLE ${quoteIdentifier(tableName)};`,
      );

      await onDeleted();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Could not delete table "${tableName}".`;

      if (message.toUpperCase().includes("FOREIGN KEY")) {
        window.alert(
          `Table "${tableName}" is still referenced by another table and cannot be deleted safely.`,
        );
      } else {
        window.alert(message);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void deleteTable()}
      disabled={isDeleting}
      className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={15} aria-hidden="true" />

      {isDeleting ? "Checking..." : "Delete"}
    </button>
  );
}
