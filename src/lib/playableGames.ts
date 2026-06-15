import type { RoomId } from "@/lib/types";

/**
 * Registry of the first playable game in each room (v0.1 vertical slice).
 * Routes live under the existing /rooms/[room] structure. Each room links to
 * its playable game from the room page.
 */
export interface PlayableGame {
  id: string;
  roomId: RoomId;
  name: string;
  slug: string;
  /** Full route path under the room. */
  route: string;
  tagline: string;
  /** localStorage key namespace for this game's browser save. */
  saveKey: string;
}

export const PLAYABLE_GAMES: PlayableGame[] = [
  {
    id: "riddle-relay",
    roomId: "word",
    name: "Riddle Relay",
    slug: "riddle-relay",
    route: "/rooms/word/riddle-relay",
    tagline: "Solve a relay of short riddles, round by round.",
    saveKey: "ai-gaming-arena:riddle-relay:v1",
  },
  {
    id: "lantern-bridge",
    roomId: "story",
    name: "Lantern Bridge",
    slug: "lantern-bridge",
    route: "/rooms/story/lantern-bridge",
    tagline: "Choose your way across a lantern-lit bridge.",
    saveKey: "ai-gaming-arena:lantern-bridge:v1",
  },
  {
    id: "cartographers-table",
    roomId: "world",
    name: "Cartographer's Table",
    slug: "cartographers-table",
    route: "/rooms/world/cartographers-table",
    tagline: "Draw a tiny region from terrain, landmark, and lore cards.",
    saveKey: "ai-gaming-arena:cartographers-table:v1",
  },
  {
    id: "seedling-commons",
    roomId: "simulation",
    name: "Seedling Commons",
    slug: "seedling-commons",
    route: "/rooms/simulation/seedling-commons",
    tagline: "Tend a small commons over a handful of turns.",
    saveKey: "ai-gaming-arena:seedling-commons:v1",
  },
  {
    id: "reflex-gate",
    roomId: "arcade",
    name: "Reflex Gate",
    slug: "reflex-gate",
    route: "/rooms/arcade/reflex-gate",
    tagline: "Repeat the growing sequence to pass each gate.",
    saveKey: "ai-gaming-arena:reflex-gate:v1",
  },
];

export function getPlayableForRoom(roomId: RoomId): PlayableGame | undefined {
  return PLAYABLE_GAMES.find((game) => game.roomId === roomId);
}

export function getPlayableById(id: string): PlayableGame | undefined {
  return PLAYABLE_GAMES.find((game) => game.id === id);
}
