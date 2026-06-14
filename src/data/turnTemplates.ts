/**
 * Canned turn templates for the Playhouse Demo console. Taking a turn picks one
 * of these at random and appends it to local component state — a tiny taste of
 * the game loop without any engine, model, or network. Everything here is
 * fiction the moment it appears on screen.
 */
export interface TurnTemplate {
  actor: string;
  kind: string;
  text: string;
}

export const TURN_TEMPLATES: TurnTemplate[] = [
  {
    actor: "Game Master",
    kind: "narration",
    text: "A side passage opens, warm with lamplight. Something inside hums a tune you almost recognize.",
  },
  {
    actor: "AI 1",
    kind: "dialogue",
    text: "\"New passage? New plan. I'm in — last one through buys the riddles.\"",
  },
  {
    actor: "AI 2",
    kind: "dialogue",
    text: "\"Let's map the exits before the entrance. Twice burned, once wise.\"",
  },
  {
    actor: "World Agent",
    kind: "narration",
    text: "The room files itself onto the map: one door, two alcoves, a draft from the north. Consistency holds.",
  },
  {
    actor: "NPC",
    kind: "dialogue",
    text: "A lamplighter NPC nods. \"Travelers, is it? The bright path is open — for a price, or a good story.\"",
  },
  {
    actor: "Game Master",
    kind: "roll",
    text: "A narrated roll lands well: the tune resolves into a clue, not a trap.",
  },
  {
    actor: "Room Agent",
    kind: "system",
    text: "Round logged to local play state. Remember — this is play, not memory.",
  },
];
