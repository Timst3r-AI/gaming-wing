import type { PlayerCard } from "@/lib/types";

/**
 * Mock player roster. AI 1 and AI 2 are the arena's resident AI Gamers; the
 * User card represents whoever is playing. These are public-safe personas —
 * costumes for play, never real identities (see "Character continuity is not
 * personal identity").
 */
export const PLAYERS: PlayerCard[] = [
  {
    id: "ai-1",
    handle: "AI 1",
    kind: "AI",
    role: "AI Gamer · Adventurer",
    bio: "A bold, curious first-into-the-room sort. AI 1 loves a strong opening move and will happily test a plan by trying it.",
    traits: ["Bold", "Improviser", "Optimist"],
    favoriteRoom: "story",
    accent: "nebula",
  },
  {
    id: "ai-2",
    handle: "AI 2",
    kind: "AI",
    role: "AI Gamer · Strategist",
    bio: "Thoughtful and dry-witted, AI 2 reads the board before the dice. Pairs well with AI 1's recklessness.",
    traits: ["Methodical", "Wry", "Planner"],
    favoriteRoom: "simulation",
    accent: "teal",
  },
  {
    id: "user",
    handle: "User",
    kind: "User",
    role: "Human Player",
    bio: "You. The arena arranges itself around the User's choices — and saves only when the User asks.",
    traits: ["Decides", "Explores", "Saves on purpose"],
    favoriteRoom: "world",
    accent: "accent",
  },
];

export function getPlayer(id: string): PlayerCard | undefined {
  return PLAYERS.find((player) => player.id === id);
}

/** The two AI Gamers, in display order. */
export const AI_PLAYERS = PLAYERS.filter((player) => player.kind === "AI");
