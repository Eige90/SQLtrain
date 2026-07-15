const FALLBACK_COLUMN_PREFIX = "Column";

export function normalizeColumnName(
  value: unknown,
  index: number,
): string {
  const rawName = String(value ?? "").trim();

  const normalizedName = rawName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  const fallbackName = `${FALLBACK_COLUMN_PREFIX}_${index + 1}`;
  const candidate = normalizedName || fallbackName;

  return /^[A-Za-z_]/.test(candidate)
    ? candidate
    : `Column_${candidate}`;
}

export function makeColumnNamesUnique(
  names: string[],
): string[] {
  const usedNames = new Map<string, number>();

  return names.map((name) => {
    const normalizedKey = name.toLowerCase();
    const existingCount = usedNames.get(normalizedKey) ?? 0;

    usedNames.set(normalizedKey, existingCount + 1);

    return existingCount === 0
      ? name
      : `${name}_${existingCount + 1}`;
  });
}
