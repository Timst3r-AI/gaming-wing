"use client";

import { useRef, useState } from "react";
import {
  clearGameSave,
  isV1Object,
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

const SAVE_KEY = "ai-gaming-arena:reflex-gate:v1";
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";

const PADS = [
  { id: 0, name: "Amber", swatch: "bg-accent text-background", pad: "bg-accent/20 ring-accent/50 hover:bg-accent/35" },
  { id: 1, name: "Teal", swatch: "bg-teal text-background", pad: "bg-teal/20 ring-teal/50 hover:bg-teal/35" },
  { id: 2, name: "Nebula", swatch: "bg-nebula text-background", pad: "bg-nebula/20 ring-nebula/50 hover:bg-nebula/35" },
  { id: 3, name: "Sky", swatch: "bg-sky text-background", pad: "bg-sky/20 ring-sky/50 hover:bg-sky/35" },
];

const AI2_PLAY = [
  "Match the glow.",
  "Tap its twin.",
  "Eyes on the gate.",
  "Keep the streak.",
  "Nice rhythm.",
];

type Phase = "idle" | "play" | "over";

interface ReflexSave {
  version: 1;
  best: number;
}

function isReflexSave(value: unknown): value is ReflexSave {
  if (!isV1Object(value)) return false;
  return typeof value.best === "number";
}

function nextTarget(prev: number): number {
  const t = Math.floor(Math.random() * PADS.length);
  return t === prev ? (t + 1) % PADS.length : t;
}

export function ReflexGateGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<string>();
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [
      { id: `g${logId.current}-${Math.random().toString(36).slice(2, 7)}`, text },
      ...prev,
    ]);
  }

  function start() {
    setScore(0);
    setTarget(nextTarget(-1));
    setPhase("play");
    setFeedback(undefined);
    setLog([]);
  }

  function press(id: number) {
    if (phase !== "play" || target === null) return;
    if (id === target) {
      const s = score + 1;
      setScore(s);
      setBest((b) => Math.max(b, s));
      setFeedback(`✓ Match! Streak ${s}`);
      pushLog(`Matched ${PADS[id].name} — streak ${s}.`);
      setTarget(nextTarget(target));
    } else {
      setBest((b) => Math.max(b, score));
      setPhase("over");
      setFeedback(`✗ Gate closed — that was ${PADS[target].name}.`);
      pushLog(`Missed at streak ${score}.`);
    }
  }

  function reset() {
    setPhase("idle");
    setTarget(null);
    setScore(0);
    setFeedback(undefined);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 1, best } satisfies ReflexSave);
    setStatus(ok ? "Best saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isReflexSave);
    if (!data) return setStatus("No valid save found.");
    setBest(data.best);
    setStatus(`Loaded best: ${data.best}.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setBest(0);
    setStatus("Browser save cleared.");
  }

  const tgt = target !== null ? PADS[target] : null;
  let ai1: string | undefined;
  let ai2: string | undefined;
  if (phase === "play" && tgt) {
    ai1 = `Target: ${tgt.name}.`;
    ai2 = AI2_PLAY[score % AI2_PLAY.length];
  } else if (phase === "over") {
    ai1 = `Reached ${score}. Best ${best}.`;
    ai2 = "Run it back!";
  } else {
    ai2 = "Press start when ready.";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <Stat label="Streak" value={score} accentText="text-rose" />
                <Stat label="Best" value={best} accentText="text-accent" />
              </div>
              {feedback ? (
                <span
                  role="status"
                  aria-live="polite"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                    feedback.startsWith("✓")
                      ? "bg-teal/15 text-teal ring-teal/40"
                      : "bg-rose/15 text-rose ring-rose/40"
                  }`}
                >
                  {feedback}
                </span>
              ) : null}
            </div>

            {phase === "idle" ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted">
                  A glowing gate appears — click the pad that matches its colour.
                </p>
                <button type="button" onClick={start} className={PRIMARY}>
                  ▶ Start
                </button>
              </div>
            ) : (
              <>
                {/* Target */}
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
                    {phase === "play" ? "Match this gate" : "Gate closed"}
                  </p>
                  <div
                    className={`grid h-28 place-items-center rounded-2xl text-2xl font-bold shadow-2xl ${
                      tgt ? tgt.swatch : "bg-surface-2 text-faint"
                    } ${phase === "play" ? "gw-pulse" : "opacity-60"}`}
                  >
                    {tgt ? `◆ ${tgt.name}` : "—"}
                  </div>
                </div>

                {/* Pads */}
                <div className="grid grid-cols-2 gap-3" aria-label="Colour pads">
                  {PADS.map((pad) => (
                    <button
                      key={pad.id}
                      type="button"
                      onClick={() => press(pad.id)}
                      disabled={phase !== "play"}
                      aria-label={`${pad.name} pad`}
                      className={`grid h-16 place-items-center rounded-2xl ring-1 font-semibold text-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground sm:h-20 ${
                        pad.pad
                      } ${phase !== "play" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      {pad.name}
                    </button>
                  ))}
                </div>

                {phase === "over" ? (
                  <div className="flex flex-col items-start gap-2 rounded-xl border border-rose/30 bg-rose/5 p-4">
                    <p className="font-display text-lg font-semibold text-foreground">
                      Streak {score} · Best {best}
                    </p>
                    <button type="button" onClick={start} className={PRIMARY}>
                      ↻ Again
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={reset}
                    className="self-start rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    ↻ Reset
                  </button>
                )}

                <p className="text-xs text-faint">
                  Click the matching pad — no timer, no sequence. Pads are
                  keyboard-accessible buttons.
                </p>
              </>
            )}
          </div>
        </GamePanel>

        <AIGamerPanel ai1={{ line: ai1 }} ai2={{ line: ai2 }} />
      </div>

      <div className="flex flex-col gap-5">
        <EventLog entries={log} />
        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>
    </div>
  );
}
