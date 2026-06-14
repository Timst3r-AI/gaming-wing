/**
 * Demo-only save slots backed by the browser's localStorage, exposed as a small
 * external store so React can read it with `useSyncExternalStore` (the blessed
 * way to read browser state without hydration mismatches or effect-driven
 * setState).
 *
 * Governance: "Saves require user action." Nothing here runs unless the User
 * explicitly clicks save/load/reset in the UI. There is no server, no account,
 * and no syncing beyond an optional cross-tab refresh — data lives only in this
 * browser and can be wiped at any time. This is a toy persistence layer, not a
 * database.
 */

const STORAGE_KEY = "gaming-wing:demo:v1";
export const SLOT_COUNT = 3;

/** A single play turn captured by the demo console. */
export interface DemoTurn {
  id: string;
  actor: string;
  kind: string;
  text: string;
}

/** The serializable demo play state that a slot holds. */
export interface DemoState {
  version: 1;
  turns: DemoTurn[];
}

export interface SaveSlot {
  index: number;
  /** ISO timestamp captured at save time (client-side). */
  savedAt: string;
  state: DemoState;
}

/** Slots are stored together under one key as a fixed-length array. */
export type SlotStore = (SaveSlot | null)[];

/** Stable empty reference returned whenever there's nothing saved. */
const EMPTY: SlotStore = Object.freeze(
  Array.from({ length: SLOT_COUNT }, () => null),
) as SlotStore;

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function isDemoState(value: unknown): value is DemoState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.version === 1 && Array.isArray(candidate.turns);
}

function parse(raw: string | null): SlotStore {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    const store: SlotStore = Array.from({ length: SLOT_COUNT }, () => null);
    let filled = false;
    for (let i = 0; i < SLOT_COUNT; i += 1) {
      const entry = parsed[i];
      if (
        entry &&
        typeof entry === "object" &&
        isDemoState((entry as SaveSlot).state)
      ) {
        store[i] = {
          index: i,
          savedAt: String((entry as SaveSlot).savedAt ?? ""),
          state: (entry as SaveSlot).state,
        };
        filled = true;
      }
    }
    return filled ? store : EMPTY;
  } catch {
    return EMPTY;
  }
}

// --- External-store plumbing for useSyncExternalStore ------------------------

type Listener = () => void;
const listeners = new Set<Listener>();

// Cache the parsed snapshot keyed by the raw string so getSnapshot returns a
// stable reference between renders (required by useSyncExternalStore).
let cache: SlotStore = EMPTY;
let cacheRaw: string | null = null;
let cacheValid = false;

function handleStorageEvent(event: StorageEvent) {
  if (event.key === null || event.key === STORAGE_KEY) {
    cacheValid = false;
    listeners.forEach((listener) => listener());
  }
}

export function subscribeSlots(listener: Listener): () => void {
  listeners.add(listener);
  if (isBrowser() && listeners.size === 1) {
    window.addEventListener("storage", handleStorageEvent);
  }
  return () => {
    listeners.delete(listener);
    if (isBrowser() && listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

/** Client snapshot. Returns a cached, reference-stable store. */
export function getSlotsSnapshot(): SlotStore {
  if (!isBrowser()) return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (cacheValid && raw === cacheRaw) return cache;
  cacheRaw = raw;
  cache = parse(raw);
  cacheValid = true;
  return cache;
}

/** Server snapshot. Always empty so SSR and first client render agree. */
export function getServerSlotsSnapshot(): SlotStore {
  return EMPTY;
}

function commit(store: SlotStore): void {
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Storage may be full or blocked; demo saves are best-effort only.
    }
  }
  cacheValid = false;
  listeners.forEach((listener) => listener());
}

// --- Mutations (only ever called from explicit user actions) -----------------

/** Save the given state into a slot, stamping the current client time. */
export function saveToSlot(index: number, state: DemoState): void {
  if (index < 0 || index >= SLOT_COUNT) return;
  const next = getSlotsSnapshot().slice();
  next[index] = { index, savedAt: new Date().toISOString(), state };
  commit(next);
}

/** Clear a single slot. */
export function clearSlot(index: number): void {
  if (index < 0 || index >= SLOT_COUNT) return;
  const next = getSlotsSnapshot().slice();
  next[index] = null;
  commit(next);
}

/** Reset every demo save in this browser. */
export function clearAllSlots(): void {
  commit(Array.from({ length: SLOT_COUNT }, () => null));
}
