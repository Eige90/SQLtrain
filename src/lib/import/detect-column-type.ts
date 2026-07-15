import type {
  ImportColumnType,
  ImportedCellValue,
} from "@/types/import";

function isEmpty(value: ImportedCellValue): boolean {
  return (
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isInteger(value: ImportedCellValue): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value)
  );
}

function isNumber(value: ImportedCellValue): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

export function detectColumnType(
  values: ImportedCellValue[],
): ImportColumnType {
  const populatedValues = values.filter(
    (value) => !isEmpty(value),
  );

  if (populatedValues.length === 0) {
    return "TEXT";
  }

  if (
    populatedValues.every(
      (value) => typeof value === "boolean",
    )
  ) {
    return "BOOLEAN";
  }

  if (
    populatedValues.every(
      (value) => value instanceof Date,
    )
  ) {
    return "DATE";
  }

  if (populatedValues.every(isInteger)) {
    return "INTEGER";
  }

  if (populatedValues.every(isNumber)) {
    return "REAL";
  }

  return "TEXT";
}
