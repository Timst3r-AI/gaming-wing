# Adoption Adapter

> Law 6: **Adoption into a host AI House must be export-only and review-only.**

This document describes the **seam** by which content created in The AI Gaming Arena
could ever be adopted by a host AI House. It is a **design contract**, not an
implementation — nothing in this pass exports anything. The `/review` room is a
**mock** of the review gate, and that is as far as it goes today.

## Principles

1. **Export-only.** The arena can emit artifacts. It never accepts an inbound
   write of private material, and there is no two-way sync.
2. **Review-only.** No artifact is adopted without a **human review** that
   approves it first.
3. **Fiction-only.** Only material that is clearly play — not memory, not truth,
   not identity — is eligible (laws 1–4).
4. **Private-material-free.** Nothing carrying private names, archives, or
   internals may pass (law 7). In practice the arena never contains such material
   to begin with.

## The one-way flow

```
 AI Gaming Arena            Review gate                 Host AI House
 (this repo)                (human-in-loop)             (out of scope)

 play / artifact  ──export──►  ReviewItem  ──approve──►  adopt (read-only import)
                               │
                               ├─ pending        (awaiting a human)
                               ├─ needs-changes  (sent back, not exported)
                               └─ approved       (eligible to adopt)

         ▲                                                    │
         └──────────────  NO inbound path  ───────────────────┘
```

There is intentionally **no arrow back** into the arena. Adoption cannot write
anything into this repository.

## Artifact shape (proposed, not built)

If/when export is implemented, an exported artifact would be a small, explicit,
review-stamped envelope — conceptually:

```ts
interface AdoptionExport {
  artifactId: string;
  kind: "world-entity" | "story-arc" | "session-summary" | "character-sheet";
  // The reviewed, fiction-only payload. No secrets, no identities.
  payload: unknown;
  review: {
    status: "approved";       // only approved artifacts may be exported
    reviewedBy: string;        // a human reviewer
    governanceChecks: string[]; // the law checks that were confirmed
  };
  // Provenance is generic and public-safe — a room, not a person.
  origin: { room: string };
}
```

The `ReviewItem` type in [`src/lib/types.ts`](../../src/lib/types.ts) and the
mock queue in [`src/data/review.ts`](../../src/data/review.ts) model the *review*
half of this contract today. The *export* half is left as a future seam.

## Review checklist (what a human confirms)

Before an artifact is marked `approved`, a reviewer confirms:

- [ ] It is **fiction** — not memory, truth, or identity (laws 1–4).
- [ ] It contains **no private material** of any kind (law 7).
- [ ] AI-generated narration is **labeled non-authoritative** (law 3).
- [ ] Any character continuity reads as a **costume**, not a self (law 4).
- [ ] Export is **explicit** and **one-way** (law 6).

## What this pass does and does not do

- **Does:** define the contract; render a mock review queue at `/review`; model
  the review side in types and data.
- **Does not:** export anything, call any host system, persist beyond demo
  `localStorage`, or open any inbound path.

Implementing real export is future work and must land with its own ADR.
