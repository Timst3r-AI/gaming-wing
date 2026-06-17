"use client";

import { useRef, useState } from "react";
import { RIDDLES } from "@/data/games/riddles";
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

const SAVE_KEY = "ai-gaming-arena:riddle-relay:v1";
const TOTAL = RIDDLES.length;
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95 disabled:opacity-40";
const SECONDARY =
  "rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

const AI2_CLUES = [
  "Classic one — trust your first instinct.",
  "Think simple, not clever.",
  "I always smile at this one.",
  "Say it out loud — it helps.",
  "Don't overthink it.",
];

interface RiddleSave {
  version: 1;
  index: number;
  score: number;
  finished: boolean;
}

function isRiddleSave(value: unknown): value is RiddleSave {
  if (!isV1Object(value)) return false;
  return (
    typeof value.index === "number" &&
    typeof value.score === "number" &&
    typeof value.finished === "boolean"
  );
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/^(a|an|the)\s+/, "");
}

export function RiddleRelayGame() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [finished, setFinished] = useState(false);
  const [ai1, setAi1] = useState<string>();
  const [ai2, setAi2] = useState<string>();
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [
      { id: `r${logId.current}-${Math.random().toString(36).slice(2, 7)}`, text },
      ...prev,
    ]);
  }

  function start() {
    setStarted(true);
    setIndex(0);
    setScore(0);
    setInput("");
    setResult(null);
    setFinished(false);
    setAi1(undefined);
    setAi2(undefined);
    pushLog("Relay started.");
  }

  function hint() {
    const a = RIDDLES[index].answers[0];
    setAi1(`Starts with “${a[0].toUpperCase()}”, ${a.length} letters.`);
  }

  function clue() {
    setAi2(AI2_CLUES[index % AI2_CLUES.length]);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (result || finished) return;
    const riddle = RIDDLES[index];
    const correct = riddle.answers.some((a) => normalize(a) === normalize(input));
    setResult(correct ? "correct" : "incorrect");
    if (correct) setScore((s) => s + 1);
    setAi2(correct ? "Nice — you got it!" : "So close — onward!");
    pushLog(`Round ${index + 1}: ${correct ? "correct (+1)" : "missed"}.`);
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setFinished(true);
      setAi2("Good relay — well played!");
      pushLog(`Relay complete — ${score} / ${TOTAL}.`);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setResult(null);
    setAi1(undefined);
    setAi2(undefined);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 1, index, score, finished } satisfies RiddleSave);
    setStatus(ok ? "Saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isRiddleSave);
    if (!data) return setStatus("No valid save found.");
    setStarted(true);
    setIndex(Math.min(Math.max(data.index, 0), TOTAL - 1));
    setScore(data.score);
    setFinished(data.finished);
    setInput("");
    setResult(null);
    setStatus(`Loaded — round ${data.index + 1}.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const riddle = RIDDLES[index];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          {!started ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted">Ten quick riddles, one per round.</p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start
              </button>
            </div>
          ) : finished ? (
            <div className="flex flex-col items-start gap-3">
              <p className="font-display text-xl font-semibold text-foreground">
                Relay complete
              </p>
              <p className="text-muted">
                Score{" "}
                <span className="font-semibold text-accent">{score}</span> /{" "}
                {TOTAL}.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ↻ Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Stat label="Round" value={`${index + 1}/${TOTAL}`} accentText="text-accent" />
                <Stat label="Score" value={score} accentText="text-teal" />
              </div>
              <p className="rounded-xl border border-border bg-background/40 p-4 text-lg leading-7 text-foreground">
                {riddle.prompt}
              </p>
              {result ? (
                <div className="flex flex-col gap-3">
                  <p className={result === "correct" ? "font-semibold text-teal" : "font-semibold text-rose"}>
                    {result === "correct" ? "✓ Correct!" : "✗ Not quite."} Answer:{" "}
                    <span className="text-foreground">{riddle.answers[0]}</span>.
                  </p>
                  <button type="button" onClick={next} className={PRIMARY}>
                    {index + 1 >= TOTAL ? "Finish →" : "Next →"}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="riddle-answer">
                    Your answer
                  </label>
                  <input
                    id="riddle-answer"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="off"
                    placeholder="Your answer…"
                    className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none ring-accent/40 transition focus:ring-2"
                  />
                  <button type="submit" disabled={!input.trim()} className={PRIMARY}>
                    Submit
                  </button>
                </form>
              )}
              <button type="button" onClick={start} className={`${SECONDARY} self-start`}>
                ↻ Reset
              </button>
            </div>
          )}
        </GamePanel>

        <AIGamerPanel
          ai1={{ line: ai1, askLabel: "Hint", onAsk: started && !finished ? hint : undefined }}
          ai2={{ line: ai2, askLabel: "Clue", onAsk: started && !finished && !result ? clue : undefined }}
        />
      </div>

      <div className="flex flex-col gap-5">
        <EventLog entries={log} />
        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>
    </div>
  );
}
