/**
 * Cartographer's Table — hard-coded, public-safe cards. The User picks one card
 * per step; the final region summary is built deterministically from the
 * chosen cards (no freeform generation, no user profiling).
 */
export interface Card {
  id: string;
  name: string;
  blurb: string;
}

export interface CardStep {
  key: "terrain" | "landmark" | "settlement" | "mystery";
  title: string;
  prompt: string;
  cards: Card[];
}

export const CARTOGRAPHER_STEPS: CardStep[] = [
  {
    key: "terrain",
    title: "Terrain",
    prompt: "Lay down the land.",
    cards: [
      { id: "fjords", name: "Misty Fjords", blurb: "deep water and tall, quiet cliffs" },
      { id: "steppe", name: "Amber Steppe", blurb: "wide golden grass under big skies" },
      { id: "hollow", name: "Verdant Hollow", blurb: "a green, sheltered valley of ferns" },
      { id: "reef", name: "Sunlit Reef", blurb: "warm shallows and bright coral shelves" },
    ],
  },
  {
    key: "landmark",
    title: "Landmark",
    prompt: "Raise something travelers steer by.",
    cards: [
      { id: "spire", name: "the Leaning Spire", blurb: "a tower that tilts but never falls" },
      { id: "lanterntree", name: "the Old Lantern Tree", blurb: "a tree hung with a hundred lamps" },
      { id: "bells", name: "the Bridge of Bells", blurb: "a span that rings in the wind" },
      { id: "ridge", name: "the Sleeping Ridge", blurb: "a hill shaped like a resting giant" },
    ],
  },
  {
    key: "settlement",
    title: "Settlement",
    prompt: "Settle a few good folk.",
    cards: [
      { id: "quay", name: "Lantern Quay", blurb: "a harbor town lit dusk to dawn" },
      { id: "rise", name: "Tinker's Rise", blurb: "a hill market of makers and menders" },
      { id: "mosswell", name: "Mosswell", blurb: "a quiet grove village by a spring" },
      { id: "gale", name: "Gale Watch", blurb: "a clifftop post of patient watchers" },
    ],
  },
  {
    key: "mystery",
    title: "Mystery",
    prompt: "Leave one thing unexplained.",
    cards: [
      { id: "tide", name: "a tide that hums", blurb: "the water sings on certain nights" },
      { id: "remap", name: "a map that redraws itself", blurb: "the coastline shifts when no one looks" },
      { id: "door", name: "a door with no key", blurb: "it opens only for the kind" },
      { id: "star", name: "a star only the bold can see", blurb: "it hides from the hurried" },
    ],
  },
];
