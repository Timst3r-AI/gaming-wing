"use client";

import { useRef, useState } from "react";
import {
  CARTOGRAPHER_STEPS,
  type Card,
} from "@/data/games/cartographerCards";
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
  type LogEntry,
} from "@/components/games/GameKit";

const SAVE_KEY = "ai-gaming-arena:cartographers-table:v1";
const PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";
const SECONDARY =
  "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

type StepKey = (typeof CARTOGRAPHER_STEPS)[number]["key"];
type Selections = Partial<Record<StepKey, string>>;

interface CartographerSave {
  version: 1;
  selections: Selections;
}

function isCartographerSave(value: unknown): value is CartographerSave {
  if (!isV1Object(value)) return false;
  const sel = value.selections;
  return typeof sel === "object" && sel !== null;
}

function cardOf(key: StepKey, id: string | undefined): Card | undefined {
  if (!id) return undefined;
  return CARTOGRAPHER_STEPS.find((s) => s.key === key)?.cards.find(
    (c) => c.id === id,
  );
}

function selectedCount(selections: Selections): number {
  return CARTOGRAPHER_STEPS.filter((s) => selections[s.key]).length;
}

export function CartographersTableGame() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [{ id: `c${logId.current}`, text }, ...prev]);
  }

  function start() {
    setStarted(true);
    setStepIndex(0);
    setSelections({});
    pushLog("New region begun.");
  }

  function pick(card: Card) {
    const step = CARTOGRAPHER_STEPS[stepIndex];
    setSelections((prev) => ({ ...prev, [step.key]: card.id }));
    setStepIndex((i) => i + 1);
    pushLog(`${step.title}: ${card.name}`);
  }

  function reset() {
    start();
    setStatus(undefined);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, {
      version: 1,
      selections,
    } satisfies CartographerSave);
    setStatus(ok ? "Region saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isCartographerSave);
    if (!data) {
      setStatus("No valid save found.");
      return;
    }
    setStarted(true);
    setSelections(data.selections);
    setStepIndex(selectedCount(data.selections));
    setStatus("Loaded saved region.");
    pushLog(`Loaded save — ${selectedCount(data.selections)} / 4 cards chosen.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const finished = stepIndex >= CARTOGRAPHER_STEPS.length;
  const step = finished ? null : CARTOGRAPHER_STEPS[stepIndex];

  const t = cardOf("terrain", selections.terrain);
  const l = cardOf("landmark", selections.landmark);
  const s = cardOf("settlement", selections.settlement);
  const m = cardOf("mystery", selections.mystery);
  const summary =
    t && l && s && m
      ? `In the ${t.name} — ${t.blurb} — ${l.name} (${l.blurb}) watches over ${s.name}, ${s.blurb}. Travelers trade tales of ${m.name}: ${m.blurb}.`
      : "";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          {!started ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted">
                Build a tiny region by drawing four cards — terrain, landmark,
                settlement, and one small mystery. The final map is composed from
                your choices.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start build
              </button>
            </div>
          ) : finished ? (
            <div className="flex flex-col items-start gap-4">
              <p className="font-display text-xl font-semibold text-foreground">
                Your region
              </p>
              <p className="rounded-xl border border-teal/30 bg-teal/5 p-4 leading-7 text-muted">
                {summary}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[t, l, s, m].map((card) => (
                  <span
                    key={card?.id}
                    className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
                  >
                    {card?.name}
                  </span>
                ))}
              </div>
              <button type="button" onClick={reset} className={PRIMARY}>
                ↻ Draw a new region
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                  Step {stepIndex + 1} / {CARTOGRAPHER_STEPS.length} ·{" "}
                  {step?.title}
                </p>
                <p className="mt-1 text-lg text-foreground">{step?.prompt}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {step?.cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => pick(card)}
                    className="flex flex-col items-start gap-0.5 rounded-xl border border-border bg-surface-2/50 p-4 text-left transition-colors hover:border-teal/50 hover:bg-surface-2"
                  >
                    <span className="font-semibold text-foreground">
                      {card.name}
                    </span>
                    <span className="text-xs text-muted">{card.blurb}</span>
                  </button>
                ))}
              </div>
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
