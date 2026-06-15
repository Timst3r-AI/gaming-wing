import type { WorldEntity } from "@/lib/types";

/**
 * Mock world entities — the imaginative furniture created in the wing. Each is
 * stewarded by an agent for consistency, but remains invented material. None
 * of it references anything real.
 */
export const WORLD_ENTITIES: WorldEntity[] = [
  {
    id: "we-amber-coast",
    name: "The Amber Coast",
    kind: "place",
    roomId: "world",
    description:
      "A sunlit shoreline of three harbor towns that trade more gossip than goods. Birthplace of several quests.",
    tags: ["coast", "trade", "starter-region"],
    stewardAgent: "World Agent",
  },
  {
    id: "we-lantern-guild",
    name: "The Lantern Guild",
    kind: "faction",
    roomId: "world",
    description:
      "Keepers of the bridges and bright paths. Officially they light the way; unofficially they decide who gets to cross.",
    tags: ["faction", "infrastructure", "intrigue"],
    stewardAgent: "World Agent",
  },
  {
    id: "we-tidewatch-lantern",
    name: "The Tidewatch Lantern",
    kind: "artifact",
    roomId: "world",
    description:
      "A lamp said to glow brighter near a secret. A hook for story quests — never a real object, always a prop.",
    tags: ["artifact", "quest-hook"],
    stewardAgent: "Game Master",
  },
  {
    id: "we-reef-drake",
    name: "The Reef Drake",
    kind: "creature",
    roomId: "world",
    description:
      "A shy, plated swimmer rumored to guard the offshore reef. Mostly legend — which is exactly how the arena likes it.",
    tags: ["creature", "legend", "hazard"],
    stewardAgent: "World Agent",
  },
  {
    id: "we-steward-marek",
    name: "Steward of the Lower Vault",
    kind: "npc",
    roomId: "story",
    description:
      "A patient, rule-bound NPC who guards the Branching Keep's vault. Responds to the party's choices within this session only.",
    tags: ["npc", "keep", "negotiation"],
    stewardAgent: "Game Master",
  },
];

export function getWorldEntity(id: string): WorldEntity | undefined {
  return WORLD_ENTITIES.find((entity) => entity.id === id);
}
