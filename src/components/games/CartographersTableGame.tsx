"use client";

import { useRef, useState } from "react";
import {
  clearGameSave,
  loadGameSave,
  saveGameSave,
} from "@/lib/gameSave";
import {
  EventLog,
  GamePanel,
  SaveControls,
  Stat,
  type LogEntry,
} from "@/components/games/GameKit";
import { AIGamerPanel } from "@/components/games/AIGamerPanel";

const SAVE_KEY = "ai-gaming-arena:cartographers-table:v1";
const COLS = 6;
const ROWS = 6;
const SIZE = COLS * ROWS;
const SUMMARY_AT = 9;
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";
const SECONDARY =
  "rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

interface Piece {
  id: string;
  label: string;
  icon: string;
  /** Tile background + ring classes. */
  tile: string;
}

const GRASS = "bg-emerald-950/40 ring-emerald-900/40";

const PIECES: Piece[] = [
  { id: "path", label: "Path", icon: "🟫", tile: "bg-amber-700/30 ring-amber-600/40" },
  { id: "cottage", label: "Cottage", icon: "🏠", tile: "bg-amber-500/20 ring-amber-400/40" },
  { id: "market", label: "Market", icon: "⛺", tile: "bg-rose/20 ring-rose/40" },
  { id: "tower", label: "Tower", icon: "🗼", tile: "bg-nebula/20 ring-nebula/40" },
  { id: "garden", label: "Garden", icon: "🌷", tile: "bg-emerald-500/25 ring-emerald-400/40" },
  { id: "bridge", label: "Bridge", icon: "🌉", tile: "bg-sky/20 ring-sky/40" },
  { id: "lantern", label: "Lantern", icon: "🏮", tile: "bg-accent/25 ring-accent/50" },
  { id: "forest", label: "Forest", icon: "🌲", tile: "bg-emerald-800/40 ring-emerald-700/40" },
  { id: "pond", label: "Pond", icon: "💧", tile: "bg-sky/30 ring-sky/50" },
  { id: "mystery", label: "Mystery", icon: "🔮", tile: "bg-nebula/25 ring-nebula/50" },
];

function pieceById(id: string): Piece | undefined {
  return PIECES.find((p) => p.id === id);
}

interface RealmSave {
  version: 2;
  board: string[];
  placed: number;
}

function isRealmSave(value: unknown): value is RealmSave {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 2 &&
    Array.isArray(v.board) &&
    v.board.length === SIZE &&
    v.board.every((c) => typeof c === "string") &&
    typeof v.placed === "number"
  );
}

function countBoard(board: string[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const cell of board) if (cell) c[cell] = (c[cell] ?? 0) + 1;
  return c;
}

function practical(c: Record<string, number>): string {
  if (!c.cottage) return "Place a cottage near the centre.";
  if ((c.path ?? 0) < 2) return "Lay a path to link things up.";
  if (!c.market) return "A market would gather folk.";
  if (!c.tower) return "Raise a tower on an edge.";
  return "Fill an empty tile with a path.";
}

function flavour(c: Record<string, number>): string {
  if (c.pond && !c.bridge) return "A bridge over that pond?";
  if (c.pond && !c.lantern) return "A lantern by the water 🏮.";
  if (c.forest && !c.lantern) return "A lantern in the woods.";
  if (c.cottage && !c.garden) return "A garden by the cottages 🌷.";
  return "Leave a little mystery 🔮.";
}

function realmTitle(c: Record<string, number>): string {
  if ((c.cottage ?? 0) >= 2) return "A growing village.";
  if ((c.forest ?? 0) >= 2) return "A woodland realm.";
  if (c.pond) return "A realm by the water.";
  return "A realm takes shape.";
}

function emptyBoard(): string[] {
  return Array.from({ length: SIZE }, () => "");
}

export function CartographersTableGame() {
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState<string[]>(emptyBoard);
  const [selected, setSelected] = useState("cottage");
  const [placed, setPlaced] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [
      { id: `c${logId.current}-${Math.random().toString(36).slice(2, 7)}`, text },
      ...prev,
    ]);
  }

  function start() {
    setStarted(true);
    setBoard(emptyBoard());
    setPlaced(0);
    setLog([]);
  }

  function place(i: number) {
    if (board[i] === selected) return;
    setBoard((prev) => {
      const next = prev.slice();
      next[i] = selected;
      return next;
    });
    setPlaced((p) => p + 1);
    const piece = pieceById(selected);
    if (piece) pushLog(`${piece.icon} ${piece.label}`);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 2, board, placed } satisfies RealmSave);
    setStatus(ok ? "Saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isRealmSave);
    if (!data) return setStatus("No valid save found.");
    setStarted(true);
    setBoard(data.board);
    setPlaced(data.placed);
    setStatus(`Loaded — ${data.placed} placed.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const counts = countBoard(board);
  const distinct = Object.keys(counts).length;
  const sel = pieceById(selected);
  const showSummary = started && placed >= SUMMARY_AT;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-4">
        {!started ? (
          <GamePanel>
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted">
                Build a tiny fantasy realm. Pick a piece, then tap a tile.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start
              </button>
            </div>
          </GamePanel>
        ) : (
          <GamePanel>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Stat label="Placed" value={placed} accentText="text-accent" />
                  <Stat label="Pieces" value={distinct} accentText="text-teal" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-foreground ring-1 ring-accent/40">
                  <span aria-hidden>{sel?.icon}</span> Placing: {sel?.label}
                </span>
              </div>

              {/* Board */}
              <div
                className="grid gap-1 rounded-xl border border-border bg-background/40 p-2"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
                role="grid"
                aria-label="Realm board"
              >
                {board.map((cell, i) => {
                  const p = pieceById(cell);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => place(i)}
                      aria-label={`Tile ${(i % COLS) + 1}, ${Math.floor(i / COLS) + 1} — ${p ? p.label : "empty"}`}
                      className={`grid aspect-square place-items-center rounded-md text-xl ring-1 transition hover:brightness-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        p ? p.tile : GRASS
                      }`}
                    >
                      <span aria-hidden>{p?.icon}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Build pieces">
                {PIECES.map((p) => {
                  const active = selected === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(p.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ring-1 transition ${
                        active
                          ? "bg-accent/15 text-foreground ring-accent/60"
                          : "bg-surface-2/50 text-muted ring-border hover:text-foreground"
                      }`}
                    >
                      <span aria-hidden>{p.icon}</span> {p.label}
                    </button>
                  );
                })}
              </div>

              {showSummary ? (
                <div className="flex flex-col gap-2 rounded-xl border border-teal/30 bg-teal/5 p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {realmTitle(counts)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PIECES.filter((p) => counts[p.id]).map((p) => (
                      <span
                        key={p.id}
                        className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
                      >
                        {p.icon} ×{counts[p.id]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <button type="button" onClick={start} className={`${SECONDARY} self-start`}>
                ↻ Reset
              </button>
            </div>
          </GamePanel>
        )}

        <AIGamerPanel
          ai1={{ line: started ? practical(counts) : undefined }}
          ai2={{ line: started ? flavour(counts) : undefined }}
        />
      </div>

      <div className="flex flex-col gap-5">
        <EventLog entries={log} />
        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>
    </div>
  );
}
