import type { GameEvent } from "@/lib/types";

/**
 * Mock game events — the narrated transcript of a couple of sessions. These
 * illustrate the event shapes the game loop would emit (narration, action,
 * dialogue, roll, system). All of it is fiction: "AI-generated story is not
 * authority."
 */
export const EVENTS: GameEvent[] = [
  // The First Quest — Lantern Bridge
  {
    id: "evt-fq-1",
    sessionId: "sess-first-quest",
    order: 1,
    kind: "narration",
    actor: "Game Master",
    text: "Fog pools over a rope bridge. Somewhere below, water moves but cannot be seen.",
  },
  {
    id: "evt-fq-2",
    sessionId: "sess-first-quest",
    order: 2,
    kind: "dialogue",
    actor: "AI 1",
    text: "\"Bridges are for crossing. I'll go first — keep up.\"",
  },
  {
    id: "evt-fq-3",
    sessionId: "sess-first-quest",
    order: 3,
    kind: "dialogue",
    actor: "AI 2",
    text: "\"Or we test a plank before we trust the whole span. Humor me.\"",
  },
  {
    id: "evt-fq-4",
    sessionId: "sess-first-quest",
    order: 4,
    kind: "system",
    actor: "Game Master",
    text: "The choice passes to the User: cross boldly, or test the bridge first.",
  },
  // Cartographers' Table — The Amber Coast
  {
    id: "evt-ct-1",
    sessionId: "sess-cartographers",
    order: 1,
    kind: "action",
    actor: "User",
    text: "Places a third harbor town where two trade roads meet.",
  },
  {
    id: "evt-ct-2",
    sessionId: "sess-cartographers",
    order: 2,
    kind: "narration",
    actor: "World Agent",
    text: "Noted. Three harbors now share one coast — that invites a rivalry. Flagging a reef offshore for a future hazard.",
  },
  {
    id: "evt-ct-3",
    sessionId: "sess-cartographers",
    order: 3,
    kind: "roll",
    actor: "World Agent",
    text: "Consistency check passed: no contradictions with the existing map.",
  },
  // Riddle Relay — Warm Round
  {
    id: "evt-rr-1",
    sessionId: "sess-riddle-relay",
    order: 1,
    kind: "dialogue",
    actor: "Room Agent",
    text: "\"I speak without a mouth and hear without ears. What am I?\"",
  },
  {
    id: "evt-rr-2",
    sessionId: "sess-riddle-relay",
    order: 2,
    kind: "action",
    actor: "AI 1",
    text: "Buzzes in first: \"An echo!\"",
  },
  {
    id: "evt-rr-3",
    sessionId: "sess-riddle-relay",
    order: 3,
    kind: "system",
    actor: "Room Agent",
    text: "AI 1 takes the point. Score: AI 1 — 2, AI 2 — 1, User — 1.",
  },
];

export function getEventsForSession(sessionId: string): GameEvent[] {
  return EVENTS.filter((event) => event.sessionId === sessionId).sort(
    (a, b) => a.order - b.order,
  );
}
