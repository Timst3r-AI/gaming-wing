# Gaming Wing

A **public-safe, frontend-only scaffold** for a governed AI playhouse — a
room-based wing where a **User** plays alongside **AI 1** and **AI 2**, guided
by a **Game Master**, a **World Agent**, and **Room Agents**.

This first build is intentionally small and self-contained: mock data, local
component state, and demo-only browser saves. It is **Vercel-ready** but **not
deployed**, and it contains **no private material** of any kind.

> **One line:** Play is play — never memory, truth, or identity.

---

## The governance laws

Every room inherits the same laws. They are the public, load-bearing promises
of the wing:

1. **Play is not memory.**
2. **Game state is not user truth.**
3. **AI-generated story is not authority.**
4. **Character continuity is not personal identity.**
5. **Saves require user action.**
6. **Adoption into a host AI House must be export-only and review-only.**
7. **No private material may enter this public repo.**

The full statement lives in
[`docs/constitution/gaming-wing-constitution.md`](docs/constitution/gaming-wing-constitution.md).

---

## What's in this scaffold

| Area | Routes / files |
| --- | --- |
| Landing page | [`/`](src/app/page.tsx) |
| Rooms index | [`/rooms`](src/app/rooms/page.tsx) |
| Rooms | `/rooms/world`, `/rooms/story`, `/rooms/word`, `/rooms/simulation`, `/rooms/arcade` |
| Review room | [`/review`](src/app/review/page.tsx) |
| Docs & governance | [`/docs`](src/app/docs/page.tsx) |
| Room registry | [`src/lib/rooms.ts`](src/lib/rooms.ts) |
| Game registry | [`src/lib/games.ts`](src/lib/games.ts) |
| Governance laws | [`src/lib/governance.ts`](src/lib/governance.ts) |
| Domain types | [`src/lib/types.ts`](src/lib/types.ts) |
| Demo save slots (localStorage) | [`src/lib/storage.ts`](src/lib/storage.ts) |
| Mock data | [`src/data/`](src/data/) — players, sessions, events, world, review |

### Five rooms

- **Worldbuilding Hall** — co-design places, factions, and artifacts with the World Agent.
- **Story Quests** — turn-based collaborative fiction run by a Game Master.
- **Word Games** — quick riddles, chains, and bluffs hosted by a Room Agent.
- **Simulation Yard** — light systems play: a town, a garden, a tiny economy.
- **Arcade** — fast, replayable score-attack and reflex rounds.

### The Playhouse Demo

The landing page includes a small interactive console. Take a few turns (canned,
local-only), then save them into one of three **demo save slots** backed by
`localStorage`. Saving is always an explicit action, and nothing leaves your
browser.

---

## Tech

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **ESLint** (`eslint-config-next`)
- `src/` directory, `@/*` path alias

There is **no** database, authentication, API/LLM integration, real-time
service, secret, or environment variable in this pass — by design. See the
[boundary map](docs/architecture/boundary-map.md).

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run lint     # eslint
npm run build    # production build (Vercel-ready)
npm start        # serve the production build
```

---

## Documentation

- [Constitution](docs/constitution/gaming-wing-constitution.md) — purpose and the seven laws.
- [Boundary map](docs/architecture/boundary-map.md) — what's in, what's deliberately out.
- [Game loop v0](docs/architecture/game-loop-v0.md) — how a turn flows today.
- [Data model v0](docs/architecture/data-model-v0.md) — the domain types.
- [Adoption adapter](docs/architecture/adoption-adapter.md) — the export-only, review-only seam.
- [ADR-0001](docs/decisions/ADR-0001-public-safe-standalone-wing.md) — why a public-safe standalone wing.

---

## Status

First build: frontend-only scaffold. Vercel-ready, **not deployed**. No secrets,
no private material. Extending it (a real game loop, persistence, agents) is
future work that must respect the governance laws and the adoption adapter.
