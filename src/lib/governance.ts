import type { GovernanceLaw } from "@/lib/types";

/**
 * The governance laws of the Gaming Wing. These are the public, load-bearing
 * promises of the wing: play stays play, and nothing here is treated as truth,
 * memory, or identity. They are rendered throughout the UI and mirrored in
 * docs/constitution/gaming-wing-constitution.md.
 */
export const GOVERNANCE_LAWS: GovernanceLaw[] = [
  {
    id: "play-not-memory",
    title: "Play is not memory.",
    detail:
      "What happens in a session is play. It is never written back as a real memory of any person or system.",
  },
  {
    id: "state-not-truth",
    title: "Game state is not user truth.",
    detail:
      "Scores, inventories, and saves describe a game in progress — never facts about the User.",
  },
  {
    id: "story-not-authority",
    title: "AI-generated story is not authority.",
    detail:
      "Narration from the Game Master, World Agent, or any NPC is fiction. It does not decide anything outside the game.",
  },
  {
    id: "continuity-not-identity",
    title: "Character continuity is not personal identity.",
    detail:
      "A character that persists across sessions is a costume, not a self. Continuity never becomes a claim about a real identity.",
  },
  {
    id: "saves-require-action",
    title: "Saves require user action.",
    detail:
      "Nothing is persisted unless the User explicitly saves it. Demo saves live only in this browser's local storage.",
  },
  {
    id: "adoption-export-review-only",
    title: "Adoption is export-only and review-only.",
    detail:
      "If a host AI House ever adopts content from this arena, it may only happen through an explicit export that a human reviews first.",
  },
  {
    id: "no-private-material",
    title: "No private material enters this repo.",
    detail:
      "This is a public, standalone arena. Private names, archives, and internal architecture stay out by design.",
  },
];
