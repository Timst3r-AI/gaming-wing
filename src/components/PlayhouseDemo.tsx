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
 * The gaming console — a self-contained taste of the game loop:
 *
 *  - Current play lives in local component state (`turns`).
 *  - Taking a turn appends a canned template — no engine, model, or network.
 *  - Saves are explicit (governance: "Saves require user action") and live only
 *    in this browser's localStorage across three save cartridges.
 *
 * Everything resets on demand. None of it is memory, truth, or identity.
 */
export function PlayhouseDemo() {
  const [turns, setTurns] = useState<DemoTurn[]>([]);
  // Read the localStorage save cartridges as an external store: stable on the
  // server, hydration-safe, and re-rendered whenever a save/eject mutates them.
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

  function handleEject(index: number) {
    clearSlot(index);
  }

  function handleResetAll() {
    clearAllSlots();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
      {/* Handheld console */}
      <div className="gw-chassis relative overflow-hidden rounded-[1.75rem] border border-border-strong/60 bg-surface/70 p-3 shadow-2xl shadow-black/40 sm:p-4">
        {/* Corner screws */}
        {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map(
          (pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute ${pos} h-2 w-2 rounded-full bg-background ring-1 ring-border-strong/70`}
            />
          ),
        )}

        {/* Brand bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-1.5">
          <span className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-faint">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-teal gw-pulse"
            />
            GW · Handheld
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-muted ring-1 ring-border">
            Turn {turns.length}
          </span>
        </div>

        {/* Screen */}
        <div className="relative mt-1 rounded-2xl border border-border-strong/50 bg-background/70 p-3 shadow-inner sm:p-4">
          <div
            aria-hidden
            className="gw-scanlines pointer-events-none absolute inset-0 rounded-2xl opacity-70"
          />
          <div className="relative mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            <span className="text-teal">● game-log</span>
            <span>local session</span>
          </div>
          <div className="relative max-h-[20rem] overflow-y-auto pr-1">
            <EventFeed events={turnsToEvents(turns)} />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-3 flex flex-wrap items-center gap-3 px-2 pb-1 sm:justify-between">
          {/* D-pad (decorative, desktop only) */}
          <div aria-hidden className="relative hidden h-16 w-16 shrink-0 sm:block">
            <span className="absolute left-1/2 top-1/2 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-2 ring-1 ring-border" />
            <span className="absolute left-1/2 top-1/2 h-16 w-5 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-2 ring-1 ring-border" />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-strong/70" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-none">
            <button
              type="button"
              onClick={resetPlay}
              disabled={turns.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-40"
            >
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-full bg-surface-2 font-display text-xs font-bold text-faint ring-1 ring-border"
              >
                B
              </span>
              Clear
            </button>
            <button
              type="button"
              onClick={takeTurn}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft hover:shadow-accent/30 active:scale-95"
            >
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-full bg-background/20 font-display text-xs font-bold"
              >
                A
              </span>
              Take a turn
            </button>
          </div>
        </div>
      </div>

      {/* Save cartridge bay */}
      <div className="flex flex-col rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
            <span aria-hidden>🎮</span> Save cartridges
          </h3>
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-medium text-faint underline-offset-2 transition-colors hover:text-rose hover:underline"
          >
            Eject all
          </button>
        </div>
        <p className="mt-1 text-xs text-faint">
          Browser saves only — stored in this browser, written by your action.
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {Array.from({ length: SLOT_COUNT }, (_, index) => {
            const slot = slots[index];
            const filled = Boolean(slot);
            const cartNo = String(index + 1).padStart(2, "0");
            return (
              <li
                key={index}
                className={`gw-cartridge relative p-4 ring-1 ring-inset transition-colors ${
                  filled
                    ? "bg-teal/5 ring-teal/50"
                    : "bg-surface ring-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-foreground">
                    <span
                      aria-hidden
                      className={`h-2.5 w-2.5 rounded-sm ${
                        filled ? "bg-teal" : "bg-border-strong"
                      }`}
                    />
                    SLOT {cartNo}
                  </span>
                  <span className="text-xs text-faint">
                    {filled && slot
                      ? `${slot.state.turns.length} turn${
                          slot.state.turns.length === 1 ? "" : "s"
                        } · ${formatSavedAt(slot.savedAt)}`
                      : "Empty bay"}
                  </span>
                </div>

                {/* Cartridge contacts */}
                <div aria-hidden className="mt-3 flex gap-1">
                  {Array.from({ length: 8 }, (_, c) => (
                    <span
                      key={c}
                      className={`h-1.5 flex-1 rounded-sm ${
                        filled ? "bg-teal/40" : "bg-surface-2"
                      }`}
                    />
                  ))}
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
                    onClick={() => handleEject(index)}
                    disabled={!filled}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:text-rose disabled:opacity-40"
                  >
                    Eject
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 flex items-start gap-2 rounded-lg bg-surface-2/60 p-3 text-xs leading-5 text-faint ring-1 ring-border">
          <span aria-hidden>🛡️</span>
          <span>
            Reminder: play is not memory. These cartridges are a demo of
            explicit, user-driven browser saves — nothing here syncs anywhere.
          </span>
        </p>
      </div>
    </div>
  );
}
