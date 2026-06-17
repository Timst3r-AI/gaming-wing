"use client";

import { useRef, useState } from "react";
import {
  LANTERN_BRIDGE,
  LANTERN_BRIDGE_START,
} from "@/data/games/lanternBridge";
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

const SAVE_KEY = "ai-gaming-arena:lantern-bridge:v1";
const PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft active:scale-95";
const SECONDARY =
  "rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground";

interface BridgeSave {
  version: 1;
  sceneId: string;
  steps: number;
}

function isBridgeSave(value: unknown): value is BridgeSave {
  if (!isV1Object(value)) return false;
  return (
    typeof value.sceneId === "string" &&
    value.sceneId in LANTERN_BRIDGE &&
    typeof value.steps === "number"
  );
}

export function LanternBridgeGame() {
  const [started, setStarted] = useState(false);
  const [sceneId, setSceneId] = useState(LANTERN_BRIDGE_START);
  const [steps, setSteps] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>();
  const logId = useRef(0);

  function pushLog(text: string) {
    logId.current += 1;
    setLog((prev) => [{ id: `b${logId.current}`, text }, ...prev]);
  }

  function start() {
    setStarted(true);
    setSceneId(LANTERN_BRIDGE_START);
    setSteps(0);
    pushLog("Quest started.");
  }

  function choose(label: string, to: string) {
    setSceneId(to);
    setSteps((s) => s + 1);
    const dest = LANTERN_BRIDGE[to];
    pushLog(dest.outcome ? `Ending: ${dest.outcome.title}.` : `Chose: ${label}.`);
  }

  function save() {
    const ok = saveGameSave(SAVE_KEY, { version: 1, sceneId, steps } satisfies BridgeSave);
    setStatus(ok ? "Saved to this browser." : "Could not save.");
  }

  function load() {
    const data = loadGameSave(SAVE_KEY, isBridgeSave);
    if (!data) return setStatus("No valid save found.");
    setStarted(true);
    setSceneId(data.sceneId);
    setSteps(data.steps);
    setStatus(`Loaded — ${data.steps} step${data.steps === 1 ? "" : "s"} in.`);
  }

  function clear() {
    clearGameSave(SAVE_KEY);
    setStatus("Browser save cleared.");
  }

  const scene = LANTERN_BRIDGE[sceneId];
  let ai1: string | undefined;
  let ai2: string | undefined;
  if (started) {
    if (scene.outcome) {
      ai1 = "Good crossing!";
      ai2 = "Let's run it back!";
    } else if (scene.choices) {
      ai1 = `Would ${scene.choices[0].label.toLowerCase()}.`;
      ai2 = `Leans toward ${scene.choices[scene.choices.length - 1].label.toLowerCase()}.`;
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <GamePanel>
          {!started ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted">
                A short branching crossing. Your choices reach one of several warm
                endings.
              </p>
              <button type="button" onClick={start} className={PRIMARY}>
                ▶ Start
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Stat label="Steps" value={steps} accentText="text-nebula" />
                <Stat label="Scene" value={scene.outcome ? "End" : "Open"} accentText="text-teal" />
              </div>
              <p className="rounded-xl border border-border bg-background/40 p-4 text-lg leading-7 text-foreground">
                {scene.text}
              </p>

              {scene.outcome ? (
                <div className="flex flex-col items-start gap-3 rounded-xl border border-nebula/30 bg-nebula/5 p-4">
                  <p className="font-display text-xl font-semibold text-foreground">
                    {scene.outcome.title}
                  </p>
                  <p className="text-muted">{scene.outcome.result}</p>
                  <button type="button" onClick={start} className={PRIMARY}>
                    ↻ Again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {scene.choices?.map((choice) => (
                    <button
                      key={choice.to}
                      type="button"
                      onClick={() => choose(choice.label, choice.to)}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-nebula/50 hover:bg-surface-2"
                    >
                      <span>{choice.label}</span>
                      <span aria-hidden className="text-nebula transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>
                  ))}
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
