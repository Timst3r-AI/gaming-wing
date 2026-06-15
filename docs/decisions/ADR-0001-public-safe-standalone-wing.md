# ADR-0001: Public-Safe Standalone Wing

- **Status:** Accepted
- **Date:** 2026-06-14
- **Deciders:** Gaming Wing maintainers

## Context

We are starting the Gaming Wing: a room-based AI gaming arena where a User plays
alongside AI Gamers. We need a first build that is safe to develop in the
open and easy to extend, without prematurely committing to backend services,
identity handling, or any integration with a private host system.

Two pressures shaped this decision:

1. **Safety / privacy.** The wing is related to a larger, private context that
   must not leak. The public repository can contain **no** private names,
   archives, memory architecture, or internals.
2. **Velocity / clarity.** A first build should be small enough to reason about
   end-to-end, demonstrate the experience and its governance, and leave clean
   seams for later work.

## Decision

Build the Gaming Wing as a **public-safe, standalone, frontend-only** Next.js
scaffold in this pass.

Concretely:

- **Frontend-only.** Next.js (App Router) + TypeScript + Tailwind CSS + ESLint,
  `src/` directory. No backend in this pass.
- **Mock + local.** Static TypeScript mock data, local component state, and
  **demo-only** `localStorage` save slots that require explicit user action.
- **Public-safe vocabulary only.** `User`, `AI 1`, `AI 2`, `Game Master`, `NPC`,
  `World Agent`, `Room Agent`. Nothing else.
- **Governance first.** Encode the seven laws in code and surface them in the UI;
  capture purpose in the [constitution](../constitution/gaming-wing-constitution.md).
- **Explicit boundaries.** Record what's excluded in the
  [boundary map](../architecture/boundary-map.md), and define adoption as
  export-only / review-only in the
  [adoption adapter](../architecture/adoption-adapter.md).
- **Vercel-ready, not deployed.** The app must build cleanly and be deployable,
  but this pass does not deploy, add secrets, or add deployment automation.

## Explicitly out of scope (this pass)

Convex, Supabase, or any database; authentication; LLM/model/API integrations;
real-time services; secrets; environment variables; deployment automation. See
the boundary map for the full list and rationale.

## Consequences

**Positive**

- The repository is safe to keep public: no private material, by construction.
- The whole system fits in one's head; the experience and its governance are
  demonstrable immediately.
- Clean seams (turn resolution, persistence, export) make future work additive
  rather than a rewrite.
- "Vercel-ready but not deployed" keeps options open without operational risk.

**Negative / trade-offs**

- No real gameplay, persistence across devices, or live AI yet — the demo is
  canned and local.
- Some duplication between mock data and a future real data source is likely.
- Contributors must actively uphold the boundary (vocabulary, no-backend, no
  secrets) until tooling enforces it.

**Neutral**

- Future capabilities (real engine, persistence, agent behavior, export) each
  warrant their own ADR and must respect the governance laws and the adoption
  adapter.

## Alternatives considered

- **Full-stack first build (DB + auth + live AI).** Rejected for this pass:
  larger surface area, more privacy risk, and slower to a demonstrable,
  governed experience.
- **Embed directly into the host AI House now.** Rejected: would couple a public
  surface to private internals and violate the public-safe requirement. Adoption
  is deferred to an export-only, review-only seam.
- **Static mockups with no interactivity.** Rejected: the "saves require user
  action" law is best shown with a real, if tiny, interactive demo.
