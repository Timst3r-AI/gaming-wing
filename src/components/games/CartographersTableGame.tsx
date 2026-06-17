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
  type LogEntry,
} from "@/components/games/GameKit";
import { AIGamerPanel } from "@/components/games/AIGamerPanel";

const SAVE_KEY = "ai-gaming-arena:cartographers-table:v1";
const COLS = 6;
const ROWS = 6;
const SIZE = COLS * ROWS;
const GOAL = 9;
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";
const SECONDARY =
  "rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

interface Piece {
  id: string;
  label: string;
  icon: string;
  tile: string;
}

const GRASS = "bg-emerald-950/40 ring-emerald-900/40";

const PIECES: Piece[] = [
  { id: "path", label: "Path", icon: "🟫", tile: "bg-amber-700/30 ring-amber-600/40" },
  { id: "cottage", label: "Cottage", icon: "🏠", tile: "bg-amber-500/20 ring-amber-400/40" },
  { id: "market", label: "Market", icon: "🛖", tile: "bg-rose/20 ring-rose/40" },
  { id: "tower", label: "Tower", icon: "🗼", tile: "bg-nebula/20 ring-nebula/40" },
  { id: "garden", label: "Garden", icon: "🌷", tile: "bg-emerald-500/25 ring-emerald-400/40" },
  { id: "bridge", label: "Bridge", icon: "🌉", tile: "bg-sky/20 ring-sky/40" },
  { id: "lantern", label: "Lantern", icon: "🏮", tile: "bg-accent/25 ring-accent/50" },
  { id: "forest", label: "Forest", icon: "🌲", tile: "bg-emerald-800/40 ring-emerald-700/40" },
  { id: "pond", label: "Pond", icon: "💧", tile: "bg-sky/30 ring-sky/50" },
  { id: "mystery", label: "Mystery", icon: "🔮", tile: "bg-nebula/25 ring-nebula/50" },
];

// Pieces that bring a little resident/agent token to live on the tile.
const TOKEN: Record<string, string> = {
  cottage: "🧑‍🌾",
  market: "🧙",
  forest: "🐇",
  lantern: "🧚",
};

function pieceById(id: string | null): Piece | undefined {
  return id ? PIECES.find((p) => p.id === id) : undefined;
}

// --- board helpers (all deterministic) --------------------------------------

function neighbors(i: number): number[] {
  const x = i % COLS;
  const y = Math.floor(i / COLS);
  const out: number[] = [];
  if (x > 0) out.push(i - 1);
  if (x < COLS - 1) out.push(i + 1);
  if (y > 0) out.push(i - COLS);
  if (y < ROWS - 1) out.push(i + COLS);
  return out;
}

function adjHas(board: string[], i: number, ids: string[]): boolean {
  return neighbors(i).some((n) => ids.includes(board[n]));
}

function has(board: string[], id: string): boolean {
  return board.includes(id);
}

function countOf(board: string[], id: string): number {
  return board.filter((c) => c === id).length;
}

function adjPair(board: string[], a: string, b: string): boolean {
  return board.some((cell, i) => cell === a && adjHas(board, i, [b]));
}

function pathLinked(board: string[]): boolean {
  return board.some(
    (cell, i) => cell === "path" && adjHas(board, i, ["cottage", "market", "tower"]),
  );
}

function realmMetrics(board: string[]): {
  harmony: number;
  folk: number;
  linked: number;
} {
  let harmony = 0;
  let folk = 0;
  let linked = 0;
  board.forEach((cell, i) => {
    if (!cell) return;
    if (TOKEN[cell]) folk += 1;
    if (cell === "garden") {
      harmony += 1;
      if (adjHas(board, i, ["cottage"])) harmony += 1;
    } else if (cell === "pond") {
      harmony += 1;
    } else if (cell === "lantern") {
      harmony += 1;
      if (adjHas(board, i, ["path"])) harmony += 1;
    } else if (cell === "bridge") {
      if (adjHas(board, i, ["pond"])) harmony += 1;
    } else if (cell === "path") {
      if (adjHas(board, i, ["cottage", "market", "tower", "path"])) linked += 1;
    }
  });
  return { harmony, folk, linked };
}

function countBoard(board: string[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const cell of board) if (cell) c[cell] = (c[cell] ?? 0) + 1;
  return c;
}

// --- AI Gamer requests (deterministic) --------------------------------------

interface Req {
  label: string;
  reaction: string;
  test: (board: string[]) => boolean;
}

const AI1_REQUESTS: Req[] = [
  { label: "Place a Cottage.", reaction: "Good start.", test: (b) => has(b, "cottage") },
  { label: "Add a Market.", reaction: "Folk will gather.", test: (b) => has(b, "market") },
  { label: "Connect a building with a Path.", reaction: "Nice link.", test: pathLinked },
  { label: "Raise a Tower.", reaction: "Eyes on the horizon.", test: (b) => has(b, "tower") },
  { label: "Lay another Path.", reaction: "Tidy.", test: (b) => countOf(b, "path") >= 2 },
];

const AI2_REQUESTS: Req[] = [
  { label: "Put a Garden by a Cottage.", reaction: "That feels cosy.", test: (b) => adjPair(b, "garden", "cottage") },
  { label: "Add a Lantern near a Path.", reaction: "Warm glow.", test: (b) => adjPair(b, "lantern", "path") },
  { label: "Add a Pond.", reaction: "Lovely water.", test: (b) => has(b, "pond") },
  { label: "Give the realm a Forest.", reaction: "Wild and green.", test: (b) => has(b, "forest") },
  { label: "Leave a Mystery.", reaction: "Intriguing.", test: (b) => has(b, "mystery") },
];

function currentReqIdx(board: string[], reqs: Req[]): number {
  return reqs.findIndex((r) => !r.test(board));
}

function reactionIfSatisfied(
  before: string[],
  after: string[],
  reqs: Req[],
): string | null {
  const bi = currentReqIdx(before, reqs);
  if (bi < 0) return null;
  return reqs[bi].test(after) ? reqs[bi].reaction : null;
}

// Suggest an empty tile that helps build a connected realm.
function suggestTile(board: string[]): number | null {
  const adj = board.findIndex((c, i) => !c && neighbors(i).some((n) => board[n]));
  if (adj >= 0) return adj;
  const empty = board.findIndex((c) => !c);
  return empty >= 0 ? empty : null;
}

function realmTitle(c: Record<string, number>): string {
  if ((c.cottage ?? 0) >= 2) return "A growing village.";
  if ((c.forest ?? 0) >= 2) return "A woodland realm.";
  if (c.pond) return "A realm by the water.";
  return "A realm takes shape.";
}

function harmonyLabel(h: number): string {
  return h >= 6 ? "Radiant" : h >= 3 ? "Warm" : "Quiet";
}

function topPiece(c: Record<string, number>): Piece | undefined {
  let bestId: string | undefined;
  let best = 0;
  for (const p of PIECES) {
    const n = c[p.id] ?? 0;
    if (n > best) {
      best = n;
      bestId = p.id;
    }
  }
  return pieceById(bestId ?? null);
}

function flavourLine(c: Record<string, number>): string {
  if (c.mystery) return "A riddle lingers in the realm.";
  if (c.pond) return "Water laps at the edges.";
  if (c.forest) return "Green presses close.";
  return "A cosy little place.";
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

function emptyBoard(): string[] {
  return Array.from({ length: SIZE }, () => "");
}

function Chip({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2/50 px-2.5 py-1 ring-1 ring-border">
      <span aria-hidden>{icon}</span>
      <span className="font-display text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-faint">{label}</span>
    </span>
  );
}

export function CartographersTableGame() {
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState<string[]>(emptyBoard);
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState(0);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>();
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
    setSelected(null);
    setPlaced(0);
    setHighlight(null);
    setFeedback(undefined);
    setLog([]);
  }

  function place(i: number) {
    if (!selected || board[i] === selected) return;
    const next = board.slice();
    next[i] = selected;
    const before = realmMetrics(board);
    const after = realmMetrics(next);
    const fb: string[] = [];
    const dh = after.harmony - before.harmony;
    if (dh > 0) fb.push(`🌿 +${dh} mood`);
    const dl = after.linked - before.linked;
    if (dl > 0) fb.push(`🟫 +${dl} linked`);
    if (TOKEN[selected]) fb.push(`${TOKEN[selected]} arrived`);
    const r1 = reactionIfSatisfied(board, next, AI1_REQUESTS);
    if (r1) fb.push(`AI 1: ${r1}`);
    const r2 = reactionIfSatisfied(board, next, AI2_REQUESTS);
    if (r2) fb.push(`AI 2: ${r2}`);
    const piece = pieceById(selected);
    if (fb.length === 0 && piece) fb.push(`${piece.icon} placed`);

    setBoard(next);
    setPlaced((p) => p + 1);
    setHighlight(null);
    setFeedback(fb.join(" · "));
    if (piece) pushLog(`${piece.icon} ${piece.label}`);
  }

  function showMe() {
    if (!selected) return;
    setHighlight(suggestTile(board));
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
    setHighlight(null);
    setFeedback(undefined);
    setStatus(`Loaded — ${data.placed} placed.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const counts = countBoard(board);
  const m = realmMetrics(board);
  const selPiece = pieceById(selected);
  const revealed = placed >= GOAL;
  const top = topPiece(counts);
  const req1 = currentReqIdx(board, AI1_REQUESTS);
  const req2 = currentReqIdx(board, AI2_REQUESTS);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-4">
        {!started ? (
          <GamePanel>
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted">
                Pick a piece, then click an empty tile. Build {GOAL} to bring the
                realm to life.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start
              </button>
            </div>
          </GamePanel>
        ) : (
          <GamePanel>
            <div className="flex flex-col gap-3">
              {/* Realm status */}
              <div className="flex flex-wrap gap-2">
                <Chip icon="🌿" value={m.harmony} label="Mood" />
                <Chip icon="🧑‍🌾" value={m.folk} label="Folk" />
                <Chip icon="🟫" value={m.linked} label="Linked" />
                <Chip icon="📍" value={`${placed}/${GOAL}`} label="Placed" />
              </div>

              {/* Selected + Show me */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
                    selPiece
                      ? "bg-accent/15 text-foreground ring-accent/50"
                      : "bg-teal/10 text-teal ring-teal/40"
                  }`}
                >
                  {selPiece ? (
                    <>
                      <span aria-hidden>{selPiece.icon}</span> Selected:{" "}
                      {selPiece.label} — click an empty tile
                    </>
                  ) : (
                    "Choose a piece below to start."
                  )}
                </span>
                <button
                  type="button"
                  onClick={showMe}
                  disabled={!selected}
                  className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium text-foreground ring-1 ring-border transition hover:brightness-125 disabled:opacity-40"
                >
                  Show me
                </button>
              </div>

              {/* Feedback / instruction */}
              {placed > 0 && feedback ? (
                <div className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-soft ring-1 ring-accent/30">
                  {feedback}
                </div>
              ) : (
                <p className="text-xs text-faint">
                  Pick a piece, then click an empty tile to build.
                </p>
              )}

              {/* Board */}
              <div
                className="grid grid-cols-6 gap-1 rounded-xl border border-border bg-background/40 p-2"
                role="group"
                aria-label="Realm board"
              >
                {board.map((cell, i) => {
                  const p = pieceById(cell);
                  const suggested = i === highlight;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => place(i)}
                      disabled={!selected}
                      aria-label={`Tile ${(i % COLS) + 1}, ${Math.floor(i / COLS) + 1} — ${p ? p.label : "empty"}${suggested ? " — suggested" : ""}`}
                      className={`group relative grid aspect-square place-items-center rounded-md text-xl ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        p ? p.tile : GRASS
                      } ${
                        !selected
                          ? "cursor-not-allowed opacity-80"
                          : "cursor-pointer hover:brightness-150"
                      } ${selected && !p ? "hover:ring-accent/70" : ""} ${
                        suggested ? "gw-twinkle ring-2 ring-accent" : ""
                      }`}
                    >
                      <span aria-hidden>{p?.icon}</span>
                      {cell && TOKEN[cell] ? (
                        <span
                          aria-hidden
                          className="absolute right-0.5 top-0.5 text-[10px] drop-shadow"
                        >
                          {TOKEN[cell]}
                        </span>
                      ) : null}
                      {selected && !p ? (
                        <span
                          aria-hidden
                          className="absolute opacity-0 transition-opacity duration-150 group-hover:opacity-40 group-focus-visible:opacity-40"
                        >
                          {selPiece?.icon}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Build pieces">
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
                          ? "bg-accent/20 text-foreground ring-accent/70"
                          : "bg-surface-2/50 text-muted ring-border hover:text-foreground"
                      }`}
                    >
                      <span aria-hidden>{p.icon}</span> {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Result */}
              {revealed ? (
                <div className="flex flex-col gap-2 rounded-xl border border-teal/30 bg-teal/5 p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {realmTitle(counts)}
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-muted ring-1 ring-border">
                      🌿 {harmonyLabel(m.harmony)} mood
                    </span>
                    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-muted ring-1 ring-border">
                      🧑‍🌾 {m.folk} folk
                    </span>
                    {top ? (
                      <span className="rounded-md bg-surface-2 px-2 py-0.5 text-muted ring-1 ring-border">
                        {top.icon} mostly {top.label}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted">{flavourLine(counts)}</p>
                </div>
              ) : null}

              <button type="button" onClick={start} className={`${SECONDARY} self-start`}>
                ↻ Reset
              </button>
            </div>
          </GamePanel>
        )}

        <AIGamerPanel
          ai1={{
            line: started
              ? req1 >= 0
                ? `Asks: ${AI1_REQUESTS[req1].label}`
                : "Requests met — keep building!"
              : undefined,
          }}
          ai2={{
            line: started
              ? req2 >= 0
                ? `Asks: ${AI2_REQUESTS[req2].label}`
                : "Requests met — explore!"
              : undefined,
          }}
        />
      </div>

      <div className="flex flex-col gap-5">
        <EventLog entries={log} />
        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>
    </div>
  );
}
