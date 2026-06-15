import type { ReviewItem } from "@/lib/types";

/**
 * Mock review queue. The /review room is where play would be examined before
 * any export to a host AI House — and adoption is always export-only and
 * review-only. Each item lists the governance checks a human reviewer would
 * confirm. Nothing here is wired to a real pipeline.
 */
export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "rev-amber-coast",
    title: "World entity: The Amber Coast",
    origin: "Worldbuilding Hall · Cartographers' Table",
    kind: "world-entity",
    status: "approved",
    submittedBy: "World Agent",
    note: "Coherent starter region. Cleared for export as fiction-only reference material.",
    governanceFlags: [
      "Contains no private material",
      "Fiction only — not treated as truth",
      "Export-only, review-only",
    ],
  },
  {
    id: "rev-first-quest-summary",
    title: "Session summary: The First Quest",
    origin: "Story Quests · Lantern Bridge",
    kind: "session-summary",
    status: "pending",
    submittedBy: "Game Master",
    note: "Awaiting human review. Confirm the summary stays play, not memory, before any export.",
    governanceFlags: [
      "Play is not memory",
      "No personal identity claims",
      "Pending reviewer sign-off",
    ],
  },
  {
    id: "rev-steward-sheet",
    title: "Character sheet: Steward of the Lower Vault",
    origin: "Story Quests · The Branching Keep",
    kind: "character-sheet",
    status: "needs-changes",
    submittedBy: "Game Master",
    note: "Trim session-specific notes that read like a real personal record. Character continuity is a costume, not an identity.",
    governanceFlags: [
      "Continuity is not identity",
      "Strip session-only continuity before export",
    ],
  },
  {
    id: "rev-branching-arc",
    title: "Story arc: The Branching Keep",
    origin: "Story Quests · Lower Vault",
    kind: "story-arc",
    status: "pending",
    submittedBy: "AI 2",
    note: "Branch outline ready. Reviewer to confirm AI-generated narration is labeled as non-authoritative.",
    governanceFlags: [
      "AI story is not authority",
      "Export-only, review-only",
    ],
  },
];

export function getReviewItem(id: string): ReviewItem | undefined {
  return REVIEW_ITEMS.find((item) => item.id === id);
}
