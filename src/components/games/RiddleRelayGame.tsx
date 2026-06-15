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

const SAVE_KEY = "ai-gaming-arena:riddle-relay:v1";
const TOTAL = RIDDLES.length;
const PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95 disabled:opacity-40";
const SECONDARY =
  "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

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
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [{ id: `r${logId.current}`, text }, ...prev]);
  }

  function start() {
    setStarted(true);
    setIndex(0);
    setScore(0);
    setInput("");
    setResult(null);
    setFinished(false);
    pushLog("Relay started.");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (result || finished) return;
    const riddle = RIDDLES[index];
    const correct = riddle.answers.some((a) => normalize(a) === normalize(input));
    setResult(correct ? "correct" : "incorrect");
    if (correct) setScore((s) => s + 1);
    pushLog(
      `Round ${index + 1}: ${correct ? "correct (+1)" : "not quite"} — answer: ${riddle.answers[0]}`,
    );
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setFinished(true);
      pushLog(`Relay complete — score ${score} / ${TOTAL}.`);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setResult(null);
  }

  function reset() {
    start();
    setStatus(undefined);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, {
      version: 1,
      index,
      score,
      finished,
    } satisfies RiddleSave);
    setStatus(ok ? "Progress saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isRiddleSave);
    if (!data) {
      setStatus("No valid save found.");
      return;
    }
    setStarted(true);
    setIndex(Math.min(Math.max(data.index, 0), TOTAL - 1));
    setScore(data.score);
    setFinished(data.finished);
    setInput("");
    setResult(null);
    setStatus("Loaded saved progress.");
    pushLog(`Loaded save — round ${data.index + 1}, score ${data.score}.`);
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
              <p className="text-muted">
                Answer {TOTAL} short riddles, one round at a time. Answers are
                matched loosely — case and a leading “a/the” don&apos;t matter.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start game
              </button>
            </div>
          ) : finished ? (
            <div className="flex flex-col items-start gap-4">
              <p className="font-display text-xl font-semibold text-foreground">
                Relay complete!
              </p>
              <p className="text-muted">
                You scored{" "}
                <span className="font-semibold text-accent">{score}</span> out of{" "}
                {TOTAL}.
              </p>
              <button type="button" onClick={reset} className={PRIMARY}>
                ↻ Play again
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 sm:max-w-xs">
                <Stat label="Round" value={`${index + 1}/${TOTAL}`} accentText="text-accent" />
                <Stat label="Score" value={score} accentText="text-teal" />
              </div>
              <p className="rounded-xl border border-border bg-background/40 p-4 text-lg leading-7 text-foreground">
                {riddle.prompt}
              </p>
              {result ? (
                <div className="flex flex-col gap-3">
                  <p
                    className={
                      result === "correct" ? "font-semibold text-teal" : "font-semibold text-rose"
                    }
                  >
                    {result === "correct" ? "✓ Correct!" : "✗ Not quite."} The
                    answer is{" "}
                    <span className="text-foreground">{riddle.answers[0]}</span>.
                  </p>
                  <button type="button" onClick={next} className={PRIMARY}>
                    {index + 1 >= TOTAL ? "Finish relay →" : "Next riddle →"}
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
                    placeholder="Type your answer…"
                    className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none ring-accent/40 transition focus:ring-2"
                  />
                  <button type="submit" disabled={!input.trim()} className={PRIMARY}>
                    Submit
                  </button>
                </form>
              )}
              <button type="button" onClick={reset} className={`${SECONDARY} self-start`}>
                ↻ Reset
              </button>
            </div>
          )}
        </GamePanel>

        <SaveControls onSave={save} onLoad={load} onClear={clear} status={status} />
      </div>

      <EventLog entries={log} />
    </div>
  );
}
