import type { GameSession } from "@/lib/types";

/**
 * Mock game sessions. Each is a snapshot of play frozen for the scaffold.
 * `status: "demo-archived"` is a reminder that none of this is live state —
 * game state is not user truth.
 */
export const SESSIONS: GameSession[] = [
  {
    id: "sess-first-quest",
    title: "The First Quest — Lantern Bridge",
    roomId: "story",
    gameId: "story-first-quest",
    status: "live",
    participants: ["User", "Game Master", "AI 1", "AI 2"],
    turn: 4,
    summary:
      "The party reaches a fog-bound bridge. AI 1 wants to charge across; AI 2 suggests testing the planks first.",
  },
  {
    id: "sess-branching-keep",
    title: "The Branching Keep — Lower Vault",
    roomId: "story",
    gameId: "story-branching-keep",
    status: "paused",
    participants: ["User", "Game Master", "NPC"],
    turn: 11,
    summary:
      "A locked vault and a watchful steward NPC. The User paused mid-negotiation to weigh a risky bluff.",
  },
  {
    id: "sess-cartographers",
    title: "Cartographers' Table — The Amber Coast",
    roomId: "world",
    gameId: "world-cartographers",
    status: "live",
    participants: ["User", "World Agent"],
    turn: 7,
    summary:
      "A coastline takes shape: three harbor towns, a lighthouse, and a rumored reef the World Agent flagged for later.",
  },
  {
    id: "sess-township",
    title: "Little Township — Harvest Cycle",
    roomId: "simulation",
    gameId: "sim-little-township",
    status: "demo-archived",
    participants: ["User", "Room Agent"],
    turn: 22,
    summary:
      "A two-season run balancing grain and goodwill. Archived as a demo snapshot — nothing here persists on its own.",
  },
  {
    id: "sess-riddle-relay",
    title: "Riddle Relay — Warm Round",
    roomId: "word",
    gameId: "word-riddle-relay",
    status: "live",
    participants: ["User", "Room Agent", "AI 1", "AI 2"],
    turn: 3,
    summary:
      "A friendly best-of-five. AI 1 leads by a riddle; AI 2 is one clever pun from catching up.",
  },
  {
    id: "sess-lumen-rush",
    title: "Lumen Rush — Daily Board",
    roomId: "arcade",
    gameId: "arcade-lumen-rush",
    status: "demo-archived",
    participants: ["User", "AI 1", "AI 2"],
    turn: 1,
    summary:
      "A single reflex run logged for the daily board. Resettable at will — pure arcade play.",
  },
];

export function getSession(id: string): GameSession | undefined {
  return SESSIONS.find((session) => session.id === id);
}
