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
import { AIGamerPanel } from "@/components/games/AIGamerPanel";

const SAVE_KEY = "ai-gaming-arena:reflex-gate:v1";
const STEP_MS = 650;
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";

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
    setLog((prev) => [
      { id: `g${logId.current}-${Math.random().toString(36).slice(2, 7)}`, text },
      ...prev,
    ]);
  }

  // Reveal the sequence step by step, then hand control to the player.
  // All setState runs inside timeouts (asynchronous), never synchronously.
  useEffect(() => {
    if (phase !== "showing") return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    sequence.forEach((pad, i) => {
      timers.push(setTimeout(() => !cancelled && setActiveStep(pad), i * STEP_MS + 120));
      timers.push(setTimeout(() => !cancelled && setActiveStep(null), i * STEP_MS + STEP_MS - 120));
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
    setLog([]);
    setPhase("showing");
  }

  function press(padId: number) {
    if (phase !== "input") return;
    if (padId === sequence[inputIndex]) {
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        const nextRound = round + 1;
        setRound(nextRound);
        setBest((b) => Math.max(b, nextRound));
        setSequence((seq) => [...seq, randomPad()]);
        setPhase("showing");
        pushLog(`Gate ${round} passed.`);
      } else {
        setInputIndex(nextIndex);
      }
    } else {
      setBest((b) => Math.max(b, round));
      setPhase("over");
      pushLog(`Missed at gate ${round}.`);
    }
  }

  function reset() {
    setPhase("idle");
    setSequence([]);
    setInputIndex(0);
    setRound(0);
    setActiveStep(null);
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

  const padsDisabled = phase !== "input";
  const lights = sequence.length;
  const plural = lights === 1 ? "" : "s";

  let ai1: string | undefined;
  let ai2: string | undefined;
  if (phase === "showing") {
    ai1 = `${lights} light${plural} this round.`;
    ai2 = round > 1 ? `Gate ${round} — you've got this.` : "Here we go!";
  } else if (phase === "input") {
    ai1 = `${lights} to repeat — you're at ${inputIndex}/${lights}.`;
    ai2 = "Take your time.";
  } else if (phase === "over") {
    ai1 = `That was ${round} gate${round === 1 ? "" : "s"}.`;
    ai2 = "So close — run it back!";
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
                <Stat label="Gate" value={round || "—"} accentText="text-rose" />
                <Stat label="Best" value={best} accentText="text-accent" />
              </div>
              <span
                role="status"
                aria-live="polite"
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  phase === "input"
                    ? "bg-teal/15 text-teal ring-1 ring-teal/40"
                    : "bg-surface-2 text-faint ring-1 ring-border"
                }`}
              >
                {phase === "idle" && "Ready"}
                {phase === "showing" && "Watch…"}
                {phase === "input" && `Your turn — repeat (${inputIndex}/${lights})`}
                {phase === "over" && "Gate closed"}
              </span>
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
                ▶ Start
              </button>
            ) : phase === "over" ? (
              <div className="flex flex-col items-start gap-2 rounded-xl border border-rose/30 bg-rose/5 p-4">
                <p className="font-display text-lg font-semibold text-foreground">
                  Reached round {round}. Best {best}.
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
              Memory, not speed — repeat the lights at your own pace. Pads are
              keyboard-accessible buttons.
            </p>
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
