const STORAGE_KEY = "sqltrain.lesson-progress.v1";

export function readCompletedLessonIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (value): value is string =>
        typeof value === "string",
    );
  } catch {
    return [];
  }
}

export function writeCompletedLessonIds(
  lessonIds: string[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueLessonIds = [...new Set(lessonIds)];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(uniqueLessonIds),
  );
}
