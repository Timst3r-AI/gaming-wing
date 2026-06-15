/**
 * Lantern Bridge — a small, warm, non-violent branching story. Hard-coded
 * scenes; choices advance to the next scene. Terminal scenes carry an outcome.
 * Nothing here infers anything about the User.
 */
export interface StoryChoice {
  label: string;
  to: string;
}

export interface StoryScene {
  id: string;
  text: string;
  /** Decision scenes have choices. */
  choices?: StoryChoice[];
  /** Terminal scenes have an outcome instead. */
  outcome?: { title: string; result: string };
}

export const LANTERN_BRIDGE_START = "approach";

export const LANTERN_BRIDGE: Record<string, StoryScene> = {
  approach: {
    id: "approach",
    text: "A bridge of warm lanterns arches over a quiet, misty river. The far bank glows softly. How do you begin?",
    choices: [
      { label: "Test the planks", to: "testing" },
      { label: "Greet the lantern-keeper", to: "keeper" },
      { label: "Walk into the mist", to: "mist" },
    ],
  },
  testing: {
    id: "testing",
    text: "The boards creak a friendly tune. One plank sits loose, rocking gently underfoot.",
    choices: [
      { label: "Mend the loose board", to: "end_steady" },
      { label: "Pick your way across", to: "midway" },
    ],
  },
  keeper: {
    id: "keeper",
    text: "An old lantern-keeper nods and offers a small riddle-lamp that brightens near anything curious.",
    choices: [
      { label: "Accept the lantern", to: "midway" },
      { label: "Trade a riddle instead", to: "end_riddle" },
    ],
  },
  mist: {
    id: "mist",
    text: "The mist is soft and cool. Somewhere ahead, a light hums a wandering melody.",
    choices: [
      { label: "Follow the humming light", to: "end_grove" },
      { label: "Wait for the mist to lift", to: "midway" },
    ],
  },
  midway: {
    id: "midway",
    text: "Halfway across, the path forks into two ribbons of light — one warm amber, one cool teal.",
    choices: [
      { label: "Take the amber path", to: "end_amber" },
      { label: "Take the teal path", to: "end_teal" },
    ],
  },
  end_steady: {
    id: "end_steady",
    text: "You mend the board with a borrowed cord. The whole bridge steadies, and you cross with quiet confidence.",
    outcome: {
      title: "The Steady Crossing",
      result:
        "You reach the far bank having left the bridge kinder than you found it.",
    },
  },
  end_riddle: {
    id: "end_riddle",
    text: "You trade a riddle for safe passage. The keeper laughs, delighted, and lights your way.",
    outcome: {
      title: "The Riddler's Welcome",
      result: "You arrive grinning, a new riddle tucked away for later.",
    },
  },
  end_grove: {
    id: "end_grove",
    text: "The humming light leads you to a hidden grove of floating lanterns on the far bank.",
    outcome: {
      title: "The Lantern Grove",
      result: "You step off the bridge into a grove that few ever find.",
    },
  },
  end_amber: {
    id: "end_amber",
    text: "The amber path is warm and bright. You arrive as the lanterns flare in welcome.",
    outcome: {
      title: "The Amber Arrival",
      result: "You cross into a town already lit for your coming.",
    },
  },
  end_teal: {
    id: "end_teal",
    text: "The teal path is calm and clear. You arrive in a hush of cool, steady light.",
    outcome: {
      title: "The Quiet Arrival",
      result: "You cross into a still evening, unhurried and unbothered.",
    },
  },
};
