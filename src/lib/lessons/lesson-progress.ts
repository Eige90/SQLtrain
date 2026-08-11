const STORAGE_KEY =
  "sqltrain.lesson-progress.v1";

const CHANGE_EVENT =
  "sqltrain.lesson-progress.changed";

const EMPTY_SNAPSHOT = "[]";

export function parseCompletedLessonIdsSnapshot(
  snapshot: string,
): string[] {
  try {
    const parsedValue: unknown =
      JSON.parse(snapshot);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return [
      ...new Set(
        parsedValue.filter(
          (value): value is string =>
            typeof value === "string",
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function readLessonProgressSnapshot(): string {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  return (
    window.localStorage.getItem(
      STORAGE_KEY,
    ) ?? EMPTY_SNAPSHOT
  );
}

export function getLessonProgressServerSnapshot(): string {
  return EMPTY_SNAPSHOT;
}

export function subscribeToLessonProgress(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (
    event: StorageEvent,
  ): void => {
    if (
      event.key === STORAGE_KEY ||
      event.key === null
    ) {
      onStoreChange();
    }
  };

  window.addEventListener(
    "storage",
    handleStorage,
  );

  window.addEventListener(
    CHANGE_EVENT,
    onStoreChange,
  );

  // React hydrates with the server snapshot first.
  // Re-check localStorage immediately after the
  // browser subscription is established.
  queueMicrotask(
    onStoreChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage,
    );

    window.removeEventListener(
      CHANGE_EVENT,
      onStoreChange,
    );
  };
}

export function readCompletedLessonIds(): string[] {
  return parseCompletedLessonIdsSnapshot(
    readLessonProgressSnapshot(),
  );
}

export function writeCompletedLessonIds(
  lessonIds: string[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueLessonIds = [
    ...new Set(
      lessonIds.filter(
        (lessonId) =>
          typeof lessonId === "string",
      ),
    ),
  ];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      uniqueLessonIds,
    ),
  );

  window.dispatchEvent(
    new Event(
      CHANGE_EVENT,
    ),
  );
}
