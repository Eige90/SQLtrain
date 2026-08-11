const STORAGE_KEY =
  "sqltrain.mystery-teaser-seen.v1";

export function hasSeenMysteryTeaser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.localStorage.getItem(STORAGE_KEY) ===
    "true"
  );
}

export function markMysteryTeaserSeen(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    "true",
  );
}

export function resetMysteryTeaser(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
