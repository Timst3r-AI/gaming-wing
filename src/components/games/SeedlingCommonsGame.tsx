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

const SAVE_KEY = "ai-gaming-arena:seedling-commons:v1";
const MAX_TURNS = 6;
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";
const SECONDARY =
  "rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

interface Resources {
  water: number;
  light: number;
  growth: number;
  care: number;
}

const START_RESOURCES: Resources = { water: 2, light: 2, growth: 0, care: 2 };

interface Action {
  id: string;
  label: string;
  hint: string;
  apply: (r: Resources) => Resources;
}

function clamp(n: number): number {
  return Math.max(0, n);
}

const ACTIONS: Action[] = [
  {
    id: "water",
    label: "Water",
    hint: "+water +growth +care",
    apply: (r) => ({ ...r, water: r.water + 2, growth: r.growth + 1, care: r.care + 1 }),
  },
  {
    id: "greenhouse",
    label: "Greenhouse",
    hint: "+light +growth −water",
    apply: (r) => ({ ...r, light: r.light + 2, growth: r.growth + 1, water: clamp(r.water - 1) }),
  },
  {
    id: "soil",
    label: "Tend soil",
    hint: "+care ++growth −water −light",
    apply: (r) => ({
      ...r,
      care: r.care + 2,
      growth: r.growth + 2,
      water: clamp(r.water - 1),
      light: clamp(r.light - 1),
    }),
  },
  {
    id: "rest",
    label: "Rest",
    hint: "gentle recovery",
    apply: (r) => ({ ...r, water: r.water + 1, light: r.light + 1, care: r.care + 1 }),
  },
];

const LOW_TO_ACTION: Record<"water" | "light" | "care", string> = {
  water: "water",
  light: "greenhouse",
  care: "rest",
};

function actionById(id: string): Action {
  return ACTIONS.find((a) => a.id === id) ?? ACTIONS[0];
}

function balancedAction(r: Resources): Action {
  const keys = ["water", "light", "care"] as const;
  const low = keys.reduce((a, b) => (r[a] <= r[b] ? a : b));
  return actionById(LOW_TO_ACTION[low]);
}

// The growth-pushing play — but tend soil costs water + light, so steer to a
// resource top-up when those are running low.
function boldAction(r: Resources): Action {
  if (r.water >= 2 && r.light >= 2) return actionById("soil");
  return actionById(r.water <= r.light ? "water" : "greenhouse");
}

interface SeedlingSave {
  version: 1;
  turn: number;
  resources: Resources;
  finished: boolean;
}

function isResources(value: unknown): value is Resources {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.water === "number" &&
    typeof r.light === "number" &&
    typeof r.growth === "number" &&
    typeof r.care === "number"
  );
}

function isSeedlingSave(value: unknown): value is SeedlingSave {
  if (!isV1Object(value)) return false;
  return (
    typeof value.turn === "number" &&
    typeof value.finished === "boolean" &&
    isResources(value.resources)
  );
}

function outcomeFor(growth: number): { title: string; result: string } {
  if (growth >= 10) return { title: "Thriving commons", result: "Green and generous." };
  if (growth >= 6) return { title: "Steady commons", result: "Calm and well-kept." };
  return { title: "Quiet commons", result: "A small start. Next season awaits." };
}

export function SeedlingCommonsGame() {
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState(1);
  const [resources, setResources] = useState<Resources>(START_RESOURCES);
  const [finished, setFinished] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [{ id: `s${logId.current}`, text }, ...prev]);
  }

  function start() {
    setStarted(true);
    setTurn(1);
    setResources(START_RESOURCES);
    setFinished(false);
    setLog([]);
  }

  function act(action: Action) {
    if (finished) return;
    const next = action.apply(resources);
    setResources(next);
    pushLog(`Turn ${turn}: ${action.label} — growth ${next.growth}.`);
    if (turn >= MAX_TURNS) {
      setFinished(true);
      pushLog(`Season end — ${outcomeFor(next.growth).title}.`);
    } else {
      setTurn((tn) => tn + 1);
    }
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 1, turn, resources, finished } satisfies SeedlingSave);
    setStatus(ok ? "Saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isSeedlingSave);
    if (!data) return setStatus("No valid save found.");
    setStarted(true);
    setTurn(data.turn);
    setResources(data.resources);
    setFinished(data.finished);
    setStatus(`Loaded — turn ${data.turn}.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const outcome = outcomeFor(resources.growth);
  let ai1: string | undefined;
  let ai2: string | undefined;
  if (started && !finished) {
    ai1 = `Plays safe: ${balancedAction(resources).label}.`;
    ai2 = `Goes bold: ${boldAction(resources).label}.`;
  } else if (finished) {
    ai1 = "Tidy little plot.";
    ai2 = "Run it greener next time!";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          {!started ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted">
                Tend a tiny commons over {MAX_TURNS} turns. A toy simulation —
                not advice.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-2">
                <Stat label="Turn" value={`${Math.min(turn, MAX_TURNS)}/${MAX_TURNS}`} accentText="text-sky" />
                <Stat label="Water" value={resources.water} accentText="text-sky" />
                <Stat label="Light" value={resources.light} accentText="text-accent" />
                <Stat label="Growth" value={resources.growth} accentText="text-teal" />
                <Stat label="Care" value={resources.care} accentText="text-rose" />
              </div>

              {finished ? (
                <div className="flex flex-col items-start gap-2 rounded-xl border border-sky/30 bg-sky/5 p-4">
                  <p className="font-display text-xl font-semibold text-foreground">
                    {outcome.title}
                  </p>
                  <p className="text-muted">{outcome.result}</p>
                  <button type="button" onClick={start} className={PRIMARY}>
                    ↻ Replant
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-faint">Pick one action — turn {turn}:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => act(action)}
                        className="flex flex-col items-start gap-0.5 rounded-xl border border-border bg-surface-2/50 p-3 text-left transition-colors hover:border-sky/50 hover:bg-surface-2"
                      >
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                        <span className="font-mono text-[11px] text-faint">{action.hint}</span>
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={start} className={`${SECONDARY} mt-1 self-start`}>
                    ↻ Reset
                  </button>
                </div>
              )}
            </div>
          )}
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
