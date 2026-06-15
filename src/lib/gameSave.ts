/**
 * Browser-only save helpers for The AI Gaming Arena games.
 *
 * Governance: browser saves are local convenience only. Nothing becomes memory,
 * nothing leaves the browser, and no personal or identity data is stored —
 * games persist score/progress only. Every read is validated defensively so a
 * missing or malformed save fails safe (returns null) rather than throwing.
 *
 * Save keys are namespaced per game, e.g. "ai-gaming-arena:riddle-relay:v1".
 */

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/** Read and validate a save. Returns null if absent, malformed, or unavailable. */
export function loadGameSave<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Write a save. Returns whether it succeeded (storage may be full/blocked). */
export function saveGameSave(key: string, value: unknown): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Remove a save. */
export function clearGameSave(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // best-effort only
  }
}

/** Small helper for typed validators: checks a plain object with version === 1. */
export function isV1Object(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>).version === 1
  );
}
