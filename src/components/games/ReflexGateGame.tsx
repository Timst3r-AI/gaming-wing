"use client";

import { useEffect, useRef, useState } from "react";
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

const SAVE_KEY = "ai-gaming-arena:reflex-gate:v1";
const STEP_MS = 650;
const PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";

const PADS = [
  { id: 0, label: "Amber", base: "bg-accent/15 ring-accent/30", active: "bg-accent/70 ring-accent" },
  { id: 1, label: "Teal", base: "bg-teal/15 ring-teal/30", active: "bg-teal/70 ring-teal" },
  { id: 2, label: "Nebula", base: "bg-nebula/15 ring-nebula/30", active: "bg-nebula/70 ring-nebula" },
  { id: 3, label: "Sky", base: "bg-sky/15 ring-sky/30", active: "bg-sky/70 ring-sky" },
];

type Phase = "idle" | "showing" | "input" | "over";

interface ReflexSave {
  version: 1;
  best: number;
}

function isReflexSave(value: unknown): value is ReflexSave {
  if (!isV1Object(value)) return false;
  return typeof value.best === "number";
}

function randomPad(): number {
  return Math.floor(Math.random() * PADS.length);
}

export function ReflexGateGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [best, setBest] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [{ id: `g${logId.current}`, text }, ...prev]);
  }

  // Reveal the current sequence step by step, then hand control to the player.
  // All setState happens inside timeouts (asynchronous), never synchronously.
  useEffect(() => {
    if (phase !== "showing") return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    sequence.forEach((pad, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setActiveStep(pad);
        }, i * STEP_MS + 120),
      );
      timers.push(
        setTimeout(() => {
          if (!cancelled) setActiveStep(null);
        }, i * STEP_MS + STEP_MS - 120),
      );
    });
    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setActiveStep(null);
        setInputIndex(0);
        setPhase("input");
      }, sequence.length * STEP_MS + 200),
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [phase, sequence]);

  function start() {
    setRound(1);
    setSequence([randomPad()]);
    setInputIndex(0);
    setActiveStep(null);
    setPhase("showing");
    pushLog("Gate 1 — watch the sequence.");
  }

  function press(padId: number) {
    if (phase !== "input") return;
    if (padId === sequence[inputIndex]) {
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        // Round cleared — extend the sequence and show again.
        const nextRound = round + 1;
        setRound(nextRound);
        setBest((b) => Math.max(b, nextRound));
        setSequence((seq) => [...seq, randomPad()]);
        setPhase("showing");
        pushLog(`Gate ${round} passed — on to gate ${nextRound}.`);
      } else {
        setInputIndex(nextIndex);
      }
    } else {
      setBest((b) => Math.max(b, round));
      setPhase("over");
      pushLog(`Missed at gate ${round}. Reached round ${round}.`);
    }
  }

  function reset() {
    setPhase("idle");
    setSequence([]);
    setInputIndex(0);
    setRound(0);
    setActiveStep(null);
    setStatus(undefined);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 1, best } satisfies ReflexSave);
    setStatus(ok ? "Best score saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isReflexSave);
    if (!data) {
      setStatus("No valid save found.");
      return;
    }
    setBest(data.best);
    setStatus(`Loaded best score: ${data.best}.`);
    pushLog(`Loaded save — best gate ${data.best}.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setBest(0);
    setStatus("Browser save cleared.");
  }

  const padsDisabled = phase !== "input";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Gate" value={round || "—"} accentText="text-rose" />
                <Stat label="Best" value={best} accentText="text-accent" />
              </div>
              <p className="text-sm text-faint" role="status" aria-live="polite">
                {phase === "idle" && "Press start to begin."}
                {phase === "showing" && "Watch the sequence…"}
                {phase === "input" &&
                  `Repeat the sequence (${inputIndex}/${sequence.length}).`}
                {phase === "over" && `Gate closed at round ${round}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3" aria-label="Reflex pads">
              {PADS.map((pad) => {
                const lit = activeStep === pad.id;
                return (
                  <button
                    key={pad.id}
                    type="button"
                    onClick={() => press(pad.id)}
                    disabled={padsDisabled}
                    aria-label={`${pad.label} pad`}
                    className={`grid h-20 place-items-center rounded-2xl ring-1 font-medium text-foreground/90 transition-all duration-150 sm:h-24 ${
                      lit ? pad.active : pad.base
                    } ${padsDisabled ? "cursor-not-allowed opacity-80" : "hover:brightness-125"}`}
                  >
                    {pad.label}
                  </button>
                );
              })}
            </div>

            {phase === "idle" ? (
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start game
              </button>
            ) : phase === "over" ? (
              <div className="flex flex-col items-start gap-2 rounded-xl border border-rose/30 bg-rose/5 p-4">
                <p className="font-display text-lg font-semibold text-foreground">
                  Reached round {round}.
                </p>
                <p className="text-sm text-muted">Best so far: {best}.</p>
                <button type="button" onClick={start} className={PRIMARY}>
                  ↻ Play again
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="self-start rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                ↻ Reset
              </button>
            )}

            <p className="text-xs text-faint">
              Memory, not speed — take all the time you need to repeat the
              sequence. Pads are buttons; you can use the keyboard.
            </p>
          </div>
        </GamePanel>

        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>

      <EventLog entries={log} />
    </div>
  );
}
