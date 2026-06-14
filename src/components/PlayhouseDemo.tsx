"use client";

import { useState, useSyncExternalStore } from "react";
import { TURN_TEMPLATES } from "@/data/turnTemplates";
import {
  clearAllSlots,
  clearSlot,
  getServerSlotsSnapshot,
  getSlotsSnapshot,
  saveToSlot,
  SLOT_COUNT,
  subscribeSlots,
  type DemoTurn,
} from "@/lib/storage";
import type { GameEvent } from "@/lib/types";
import { EventFeed } from "@/components/EventFeed";

function makeTurnId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function turnsToEvents(turns: DemoTurn[]): GameEvent[] {
  return turns.map((turn, index) => ({
    id: turn.id,
    sessionId: "demo",
    order: index + 1,
    kind: turn.kind as GameEvent["kind"],
    actor: turn.actor,
    text: turn.text,
  }));
}

function formatSavedAt(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The Playhouse Demo console. A self-contained taste of the game loop:
 *
 *  - Current play lives in local component state (`turns`).
 *  - Taking a turn appends a canned template — no engine, model, or network.
 *  - Saves are explicit (governance: "Saves require user action") and live only
 *    in this browser's localStorage across three demo slots.
 *
 * Everything resets on demand. None of it is memory, truth, or identity.
 */
export function PlayhouseDemo() {
  const [turns, setTurns] = useState<DemoTurn[]>([]);
  // Read the localStorage slots as an external store: stable on the server,
  // hydration-safe, and re-rendered whenever a save/clear mutates them.
  const slots = useSyncExternalStore(
    subscribeSlots,
    getSlotsSnapshot,
    getServerSlotsSnapshot,
  );

  function takeTurn() {
    const template = TURN_TEMPLATES[Math.floor(Math.random() * TURN_TEMPLATES.length)];
    setTurns((prev) => [
      ...prev,
      {
        id: makeTurnId(),
        actor: template.actor,
        kind: template.kind,
        text: template.text,
      },
    ]);
  }

  function resetPlay() {
    setTurns([]);
  }

  function handleSave(index: number) {
    if (turns.length === 0) return;
    saveToSlot(index, { version: 1, turns });
  }

  function handleLoad(index: number) {
    const slot = slots[index];
    if (slot) setTurns(slot.state.turns);
  }

  function handleClearSlot(index: number) {
    clearSlot(index);
  }

  function handleResetAll() {
    clearAllSlots();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Console */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-2 gw-glow">
        {/* Bezel header */}
        <div className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-rose/80" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-teal/80" />
            <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-teal gw-twinkle"
              />
              Playhouse Demo
            </span>
          </div>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-muted ring-1 ring-border">
            Turn {turns.length}
          </span>
        </div>

        {/* Screen */}
        <div className="relative rounded-xl border border-border bg-background/50 p-4 sm:p-5">
          <div
            aria-hidden
            className="gw-scanlines pointer-events-none absolute inset-0 rounded-xl opacity-70"
          />
          <div className="relative max-h-[22rem] overflow-y-auto pr-1">
            <EventFeed events={turnsToEvents(turns)} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
          <p className="text-xs text-faint">
            Take a few turns, then save your play to a slot.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={takeTurn}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft hover:shadow-accent/30 active:scale-95"
            >
              <span aria-hidden className="text-xs">
                ▶
              </span>
              Take a turn
            </button>
            <button
              type="button"
              onClick={resetPlay}
              disabled={turns.length === 0}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Save slots — memory cartridges */}
      <div className="flex flex-col rounded-2xl border border-border bg-surface/60 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <span aria-hidden>💾</span> Save slots
          </h3>
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-medium text-faint underline-offset-2 transition-colors hover:text-rose hover:underline"
          >
            Reset all
          </button>
        </div>
        <p className="mt-1 text-xs text-faint">
          Stored only in this browser. Saving requires your action.
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {Array.from({ length: SLOT_COUNT }, (_, index) => {
            const slot = slots[index];
            const filled = Boolean(slot);
            return (
              <li
                key={index}
                className={`rounded-xl border p-4 transition-colors ${
                  filled
                    ? "border-teal/40 bg-teal/5"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span
                      aria-hidden
                      className={`grid h-6 w-6 place-items-center rounded-md text-xs ring-1 ${
                        filled
                          ? "bg-teal/15 text-teal ring-teal/40"
                          : "bg-surface-2 text-faint ring-border"
                      }`}
                    >
                      {filled ? "▣" : "▢"}
                    </span>
                    Slot {index + 1}
                  </span>
                  <span className="text-xs text-faint">
                    {filled && slot
                      ? `${slot.state.turns.length} turn${
                          slot.state.turns.length === 1 ? "" : "s"
                        } · ${formatSavedAt(slot.savedAt)}`
                      : "Empty"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSave(index)}
                    disabled={turns.length === 0}
                    className="rounded-md bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-border transition-colors hover:bg-surface-3 disabled:opacity-40"
                  >
                    Save here
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoad(index)}
                    disabled={!filled}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearSlot(index)}
                    disabled={!filled}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:text-rose disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex items-start gap-2 rounded-lg bg-surface-2/60 p-3 text-xs leading-5 text-faint ring-1 ring-border">
          <span aria-hidden>🛡️</span>
          <span>
            Reminder: play is not memory. These slots are a demo of explicit,
            user-driven saving — nothing here syncs anywhere.
          </span>
        </p>
      </div>
    </div>
  );
}
