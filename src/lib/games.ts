import type { Game, RoomId } from "@/lib/types";

/**
 * The game registry. Each game belongs to exactly one room and is hosted by an
 * agent. These are mock catalog entries for the scaffold — there is no game
 * engine behind them yet.
 */
export const GAMES: Game[] = [
  {
    id: "world-cartographers",
    name: "Cartographers' Table",
    kind: "worldbuilding",
    roomId: "world",
    summary:
      "Lay down regions, roads, and rivers tile by tile while the World Agent keeps the map consistent.",
    players: "1 + World Agent",
    difficulty: "casual",
    hostedBy: "World Agent",
  },
  {
    id: "world-faction-forge",
    name: "Faction Forge",
    kind: "worldbuilding",
    roomId: "world",
    summary:
      "Invent rival factions, their goals, and the grudge between them — seeds for later quests.",
    players: "1–2 + World Agent",
    difficulty: "standard",
    hostedBy: "World Agent",
  },
  {
    id: "story-first-quest",
    name: "The First Quest",
    kind: "story-quest",
    roomId: "story",
    summary:
      "A gentle onboarding adventure. The Game Master narrates beats; AI 1 and AI 2 adventure beside the User.",
    players: "1 + Game Master + AI 1, AI 2",
    difficulty: "casual",
    hostedBy: "Game Master",
  },
  {
    id: "story-branching-keep",
    name: "The Branching Keep",
    kind: "story-quest",
    roomId: "story",
    summary:
      "A choice-heavy dungeon crawl where narrated rolls decide outcomes and NPCs react to your last move within the session.",
    players: "1 + Game Master + NPCs",
    difficulty: "challenge",
    hostedBy: "Game Master",
  },
  {
    id: "word-riddle-relay",
    name: "Riddle Relay",
    kind: "word",
    roomId: "word",
    summary:
      "Timed riddles passed around the table. Solve fast, pass faster.",
    players: "1–3 + Room Agent",
    difficulty: "standard",
    hostedBy: "Room Agent",
  },
  {
    id: "word-chain-bloom",
    name: "Chain Bloom",
    kind: "word",
    roomId: "word",
    summary:
      "Grow the longest valid word chain before it wilts. AI 1 and AI 2 keep the pressure friendly.",
    players: "1–3 + Room Agent",
    difficulty: "casual",
    hostedBy: "Room Agent",
  },
  {
    id: "sim-little-township",
    name: "Little Township",
    kind: "simulation",
    roomId: "simulation",
    summary:
      "Nudge a tiny town's policies across seasons and watch the NPC mood ripple. State resets on demand.",
    players: "1 + Room Agent",
    difficulty: "standard",
    hostedBy: "Room Agent",
  },
  {
    id: "sim-tidewatch",
    name: "Tidewatch Garden",
    kind: "simulation",
    roomId: "simulation",
    summary:
      "Balance light, water, and visiting creatures in a small garden system stewarded by the World Agent.",
    players: "1 + World Agent",
    difficulty: "casual",
    hostedBy: "World Agent",
  },
  {
    id: "arcade-lumen-rush",
    name: "Lumen Rush",
    kind: "arcade",
    roomId: "arcade",
    summary:
      "A reflex score-attack. Catch the falling lights; miss three and the round ends.",
    players: "1 vs AI 1, AI 2",
    difficulty: "challenge",
    hostedBy: "Room Agent",
  },
  {
    id: "arcade-echo-tap",
    name: "Echo Tap",
    kind: "arcade",
    roomId: "arcade",
    summary:
      "Repeat the growing pattern. A warm, replayable recall round you can run back instantly.",
    players: "1 + Room Agent",
    difficulty: "casual",
    hostedBy: "Room Agent",
  },
];

export function getGamesForRoom(roomId: RoomId): Game[] {
  return GAMES.filter((game) => game.roomId === roomId);
}

export function getGame(id: string): Game | undefined {
  return GAMES.find((game) => game.id === id);
}
