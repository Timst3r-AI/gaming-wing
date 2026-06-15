# Boundary Map

This map draws the **public-safe line** for The AI Gaming Arena: what lives inside
this repository in the current pass, and what is deliberately kept out. It exists
so the boundary is explicit and easy to defend in review.

## Inside the arena (this pass)

- **Next.js App Router frontend** — pages, layouts, and components in `src/`.
- **Mock data** — players, sessions, events, world entities, and review items in
  `src/data/`. Static TypeScript only.
- **Registries** — the room registry (`src/lib/rooms.ts`) and game registry
  (`src/lib/games.ts`).
- **Governance** — the seven laws in `src/lib/governance.ts`, surfaced throughout
  the UI.
- **Local component state** — React `useState` for in-session play.
- **Demo-only saves** — three `localStorage` slots in `src/lib/storage.ts`,
  written only on explicit user action.
- **Docs** — this architecture set, the constitution, and ADRs.

Everything inside is **fiction, mock, or local**. None of it is a system of
record.

## Outside the arena (deliberately excluded this pass)

The following are **not** present, by design:

| Excluded | Why |
| --- | --- |
| Convex / Supabase / any database | Frontend-only first build; no system of record. |
| Authentication / accounts | No identity handling; the User is anonymous and local. |
| LLM / model / external API integration | No live generation; turns are canned, local data. |
| Real-time services (websockets, presence) | Out of scope for a static, Vercel-ready scaffold. |
| Secrets / API keys | Nothing to authenticate; none required or stored. |
| Environment variables | No runtime configuration needed in this pass. |
| Deployment automation / CI to deploy | Vercel-ready, but **not** deployed here. |
| Private names, House terms, archives | Public-safe repo; see law 7. |
| Private memory architecture / internals | Kept entirely out of this public repo. |

## The public-safe vocabulary

The only role terms used anywhere in the repo:

`User` · `AI 1` · `AI 2` · `Game Master` · `NPC` · `World Agent` · `Room Agent`

If a term isn't on this list, it doesn't belong in this repository.

## Data-flow boundary

```
 ┌──────────────────────────────────────────────┐
 │  Browser (this arena)                         │
 │                                               │
 │   mock data ──► React state ──► UI            │
 │                      │                        │
 │                      ▼ (explicit user save)   │
 │                 localStorage (demo slots)     │
 └──────────────────────────────────────────────┘
              │
              │  EXPORT ONLY, REVIEW ONLY  (future)
              ▼
       ┌───────────────────────┐
       │  Human review gate     │  ← /review room is a mock of this
       └───────────────────────┘
              │  (approved, fiction-only, private-material-free)
              ▼
       ┌───────────────────────┐
       │  Host AI House         │  (out of scope; never two-way)
       └───────────────────────┘
```

- Data never leaves the browser on its own.
- The only path outward is an **explicit export** that passes a **human review**
  — see the [adoption adapter](./adoption-adapter.md).
- There is no inbound path that writes private material into this arena.

## How to keep the boundary

- New dependencies that imply a backend, auth, or model call should be rejected
  in this pass, or proposed via an ADR.
- Any new term referring to a person, place, or system must use the public-safe
  vocabulary.
- Anything that would persist without explicit user action violates law 5 and
  should not be merged.
