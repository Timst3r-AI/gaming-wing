import type { Room, RoomId } from "@/lib/types";

/**
 * The room registry. Each room is a wing of the gaming arena with its own
 * hosting agents and sample activities. Routes under /rooms/[slug] read from
 * this single source of truth.
 */
export const ROOMS: Room[] = [
  {
    id: "world",
    slug: "world",
    name: "Worldbuilding Hall",
    tagline: "Draw the maps before the adventures.",
    description:
      "A collaborative atelier where the User and the World Agent sketch places, factions, and artifacts. Everything made here is raw imaginative material, stewarded for consistency but never treated as real.",
    icon: "🗺️",
    accent: "teal",
    hosts: ["World Agent", "Room Agent"],
    sampleActivities: [
      "Co-design a region and its landmarks",
      "Name a faction and its quarrel",
      "Forge an artifact with a hook and a cost",
    ],
  },
  {
    id: "story",
    slug: "story",
    name: "Story Quests",
    tagline: "Take a turn, the tale takes two.",
    description:
      "Turn-based collaborative fiction run by a Game Master, with AI 1 and AI 2 playing alongside the User. Quests have beats and choices — and every word stays fiction.",
    icon: "📖",
    accent: "nebula",
    hosts: ["Game Master", "NPC", "AI 1", "AI 2"],
    sampleActivities: [
      "Begin a quest from a prompt seed",
      "Resolve a choice with a narrated roll",
      "Let an NPC complicate the plan",
    ],
  },
  {
    id: "word",
    slug: "word",
    name: "Word Games",
    tagline: "Quick wits, warm rounds.",
    description:
      "Bite-sized language games — riddles, chains, and definitions — hosted by a Room Agent. Easy to drop into, friendly to win or lose.",
    icon: "🔤",
    accent: "accent",
    hosts: ["Room Agent", "AI 1", "AI 2"],
    sampleActivities: [
      "Trade riddles against the clock",
      "Build the longest word chain",
      "Bluff a definition past the table",
    ],
  },
  {
    id: "simulation",
    slug: "simulation",
    name: "Simulation Yard",
    tagline: "Tend a small world and watch it tick.",
    description:
      "Light systems play — a town, a garden, a tiny economy — stewarded by a Room Agent. The User nudges; the simulation responds. State is a toy, not a ledger of truth.",
    icon: "🌱",
    accent: "sky",
    hosts: ["Room Agent", "World Agent"],
    sampleActivities: [
      "Set a policy and watch the season turn",
      "Balance two NPC factions' needs",
      "Trigger an event and read the ripple",
    ],
  },
  {
    id: "arcade",
    slug: "arcade",
    name: "Arcade",
    tagline: "Pull up a stool, press start.",
    description:
      "Fast, replayable mini-games hosted by a Room Agent — score attacks and reflex rounds. Pure play, instantly resettable.",
    icon: "🕹️",
    accent: "rose",
    hosts: ["Room Agent", "AI 1", "AI 2"],
    sampleActivities: [
      "Chase a high score in a reflex round",
      "Race AI 1 and AI 2 on a daily board",
      "Reset and run it back",
    ],
  },
];

const ROOMS_BY_ID: Record<RoomId, Room> = ROOMS.reduce(
  (acc, room) => {
    acc[room.id] = room;
    return acc;
  },
  {} as Record<RoomId, Room>,
);

export function getRoom(id: RoomId): Room {
  return ROOMS_BY_ID[id];
}

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((room) => room.slug === slug);
}
