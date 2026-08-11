import type {
  MysteryProgress,
} from "@/types/mystery";

const STORAGE_KEY =
  "sqltrain.mystery-progress.v1";

const EMPTY_PROGRESS: MysteryProgress = {
  completedTaskIds: [],
  completedLevelIds: [],
  activeLevelId: null,
  activeTaskId: null,
};

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function readMysteryProgress(): MysteryProgress {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS;
  }

  try {
    const storedValue =
      window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return EMPTY_PROGRESS;
    }

    const parsedValue = JSON.parse(
      storedValue,
    ) as Partial<MysteryProgress>;

    return {
      completedTaskIds: Array.isArray(
        parsedValue.completedTaskIds,
      )
        ? unique(
            parsedValue.completedTaskIds.filter(
              (value): value is string =>
                typeof value === "string",
            ),
          )
        : [],

      completedLevelIds: Array.isArray(
        parsedValue.completedLevelIds,
      )
        ? unique(
            parsedValue.completedLevelIds.filter(
              (value): value is string =>
                typeof value === "string",
            ),
          )
        : [],

      activeLevelId:
        typeof parsedValue.activeLevelId ===
        "string"
          ? parsedValue.activeLevelId
          : null,

      activeTaskId:
        typeof parsedValue.activeTaskId ===
        "string"
          ? parsedValue.activeTaskId
          : null,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeMysteryProgress(
  progress: MysteryProgress,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...progress,
      completedTaskIds: unique(
        progress.completedTaskIds,
      ),
      completedLevelIds: unique(
        progress.completedLevelIds,
      ),
    }),
  );
}

export function resetMysteryProgress(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
