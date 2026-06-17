# The AI Gaming Arena — Architecture Overview

> A public-safe, frontend-only, governed game arena. This document is the
> map: what the system is, how it is put together, and where the seams are.
> It reflects the codebase as shipped (the all-rooms playable v0.1 slice).

For the deeper, focused references see the [doc map](#13-doc-map) at the end.

---

## 1. Purpose & principles

The AI Gaming Arena is a **room-based collection of small, playable mini-games**
hosted by named agents, built as a standalone, public-safe scaffold that can be
**adopted into a host AI House** later, export-only and review-only.

It is built around a few load-bearing principles:

- **Frontend-only and static.** No backend, no database, no auth, no LLM/API
  calls, no environment variables, no secrets. Every route is prerenderable.
- **Public-safe by construction.** Only generic role terms appear in the repo
  (User, AI Gamer 1/2, Game Master, NPC, World Agent, Room Agent, Human Player).
  No private names, archives, or internal architecture.
- **Play is play.** Game state is never treated as memory, truth, identity, or
  authority. Saves are explicit, local, and a convenience only.
- **Deterministic and self-contained.** "AI Gamer" behaviour is local, scripted,
  and deterministic — there is no real AI in this scaffold.

These are not just conventions; they are encoded as the seven **governance laws**
(`src/lib/governance.ts`) and surfaced throughout the UI.

---

## 2. Tech stack & runtime model

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Fonts | `next/font` — Geist Sans, Geist Mono, Space Grotesk (display) |
| Lint | ESLint (`eslint-config-next`) |
| Persistence | Browser `localStorage` only |
| Hosting | Vercel (static auto-deploy from `main`) |
| Dependencies | **No runtime dependencies beyond Next/React** |

**Runtime model:** every page is a **statically prerendered** Server Component
shell. Interactivity lives in **Client Components** (`"use client"`) that run
entirely in the browser. There are **no API routes, no server actions, no server
data fetching** — the server's only job is to render static HTML/RSC at build
time.

```
build time            request time             in the browser
──────────            ────────────             ──────────────
Server Components  →  static HTML + RSC     →  hydrate Client Components
(read static data)    (served by Vercel)       (state, localStorage, play)
```

---

## 3. System shape

The whole app is a single layer of static pages over a small set of in-repo
data and registries. There is nothing behind it.

```
            ┌───────────────────────────────────────────────┐
            │  Browser (the only runtime)                    │
            │                                                │
            │   static pages ──► client game components      │
            │        ▲                   │                   │
            │        │ read              │ explicit save     │
            │   in-repo data/registries  ▼                   │
            │                       localStorage             │
            └───────────────────────────────────────────────┘
                              │
                              │  EXPORT ONLY · REVIEW ONLY  (future)
                              ▼
                       host AI House  (out of scope here)
```

- Data flows **in** from static TypeScript modules (registries + mock data).
- State lives in React; it only persists when the **User** explicitly saves.
- The only path **out** is a governed, human-reviewed export — see
  [§12 Adoption boundary](#12-the-adoption-boundary).

---

## 4. Directory map

```
src/
├── app/                      # App Router: routes, layout, global CSS
│   ├── layout.tsx            # root layout: fonts, metadata, header/footer
│   ├── globals.css           # Tailwind import + theme tokens + gw-* utilities
│   ├── page.tsx              # homepage (cinematic hero + sections + demo)
│   ├── rooms/
│   │   ├── page.tsx          # rooms index
│   │   ├── <room>/page.tsx   # 5 room pages (world/story/word/simulation/arcade)
│   │   └── <room>/<game>/page.tsx   # 5 playable game routes
│   ├── review/page.tsx       # review room (adoption gate, mock)
│   └── docs/page.tsx         # docs & governance index
│
├── components/               # presentational + chrome components
│   ├── SiteHeader/SiteFooter/PageHeader
│   ├── HeroBackdrop.tsx      # cinematic CSS/SVG homepage backdrop
│   ├── RoomCard / RoomDetail / RoomMarquee
│   ├── GameConsoleDemo.tsx   # homepage "take a turn" demo
│   ├── …card components…     # Badge, GameCard, SessionCard, PlayerCardView, etc.
│   └── games/                # the playable games subsystem (see §9)
│       ├── GameShell.tsx     # page chrome + governance note
│       ├── GameKit.tsx       # GamePanel, Stat, EventLog, SaveControls
│       ├── AIGamerPanel.tsx  # AI Gamer 1/2 presence
│       └── <Game>Game.tsx    # the 5 game clients
│
├── lib/                      # registries, types, governance, persistence
│   ├── types.ts              # domain types
│   ├── rooms.ts              # room registry
│   ├── games.ts              # catalog registry (concept games)
│   ├── playableGames.ts      # playable game registry (routes + save keys)
│   ├── governance.ts         # the seven laws
│   ├── accents.ts            # accent → Tailwind class bundles
│   ├── storage.ts            # homepage demo save slots (useSyncExternalStore)
│   └── gameSave.ts           # per-game localStorage helpers
│
└── data/                     # static mock content
    ├── players / sessions / events / world / review / turnTemplates
    └── games/                # riddles, lantern-bridge scenes

docs/                         # constitution, architecture, ADRs (this folder)
```

---

## 5. Routing

File-system routing under `src/app`. All routes are `○ (Static)`.

| Route | What it is |
| --- | --- |
| `/` | Homepage: cinematic hero, governance strip, rooms, roster, console demo |
| `/rooms` | Rooms index |
| `/rooms/world` · `/story` · `/word` · `/simulation` · `/arcade` | Room pages |
| `/rooms/word/riddle-relay` | **Riddle Relay** |
| `/rooms/story/lantern-bridge` | **Lantern Bridge** |
| `/rooms/world/cartographers-table` | **Tiny Realm Builder** |
| `/rooms/simulation/seedling-commons` | **Seedling Commons** |
| `/rooms/arcade/reflex-gate` | **Glow Match Gate** |
| `/review` | Review room (mock adoption gate) |
| `/docs` | Docs & governance index |

> Note: two game routes keep their original slug while the **rendered name**
> evolved — `cartographers-table` renders as *Tiny Realm Builder*, and
> `reflex-gate` renders as *Glow Match Gate*. Route slugs and storage keys are
> intentionally stable; only display names change (via `playableGames.ts`).

There is **no `/hero-lab`** route — that was a temporary design-preview surface,
removed before the cinematic hero shipped.

---

## 6. Rendering & design system

- **Server Components by default**; `"use client"` only where state, event
  handlers, or `localStorage` are needed (the games, the header's active-link
  highlight, the homepage demo).
- **Tailwind v4, CSS-first.** Theme tokens live in `globals.css` under `@theme`:
  a dark arena palette of `accent` (amber), `nebula`, `teal`, `rose`, `sky`,
  plus surface/border/foreground scales.
- **`gw-*` utilities & keyframes** (in `globals.css`) provide the house style:
  `gw-glow`, `gw-grid`, `gw-gradient-text`, `gw-scanlines`, `gw-float`,
  `gw-twinkle`, `gw-pulse`, `gw-marquee`, `gw-dash`, etc. All motion is gated by
  `prefers-reduced-motion`.
- **`accents.ts`** maps each accent to a *literal* Tailwind class bundle (text,
  chip, ring, gradient, glow-hover, …). Class strings are never built
  dynamically, so Tailwind's JIT can always see them.
- **Cinematic hero** (`HeroBackdrop.tsx`) is pure CSS + inline SVG — backlit
  keep, layered mountains, mist, lantern road, room glyphs — no image assets.

---

## 7. Domain model & registries

All domain shapes are in `src/lib/types.ts`. The system is registry-driven:

- **`rooms.ts` — `ROOMS`**: the five rooms (id, slug, name, tagline, icon,
  accent, hosting agents, sample activities). Single source of truth for room
  pages and cards.
- **`games.ts` — `GAMES`**: the *catalog* of concept games shown on room pages
  (flavour/board of future ideas).
- **`playableGames.ts` — `PLAYABLE_GAMES`**: the *playable* games actually
  implemented — `{ id, roomId, name, slug, route, tagline, saveKey }`. This is
  what wires a room to its "▶ Play" button and what each game route looks up.
- **`governance.ts` — `GOVERNANCE_LAWS`**: the seven laws (id, title, detail),
  rendered across the homepage, `/docs`, and inside every game's shell.
- **`data/*`**: static mock content (players AI 1/AI 2/User, sessions, events,
  world entities, review items) used by the non-game surfaces.

Registries are plain typed arrays with small lookup helpers (`getRoom`,
`getPlayableForRoom`, `getPlayableById`, …). Adding content = editing a registry.

---

## 8. Governance architecture

Governance is a first-class subsystem, not documentation theatre.

**The seven laws** (`governance.ts`, rendered in the UI):
1. Play is not memory.
2. Game state is not user truth.
3. AI-generated story is not authority.
4. Character continuity is not personal identity.
5. Saves require user action.
6. Adoption into a host AI House must be export-only and review-only.
7. No private material may enter this public repo.

These are enforced in the architecture, not just stated:
- **Law 5** is realized by the persistence layer — nothing writes to
  `localStorage` except in an explicit user-triggered handler (Save / placement
  / cartridge).
- **Law 1 & 2** shape the save *shapes* — games persist **score / progress /
  board only**, never raw typed answers, identity, or "truth."
- **Law 7** is why the repo's only `gaming-wing` references are protected
  identifiers (package name, file paths, the legacy storage key) — there is no
  private terminology anywhere in `src`.
- **Law 6** is the [adoption boundary](#12-the-adoption-boundary).

**Public-safe vocabulary** is the only agent vocabulary in the codebase:
`User`, `Human Player`, `AI Gamer 1/2` (a.k.a. `AI 1` / `AI 2`), `Game Master`,
`NPC`, `World Agent`, `Room Agent`.

Each game page also renders a fixed governance note via `GameShell`:
*"Play is play, never memory. This game uses browser-only save data. Nothing
leaves your browser, and game state is not user truth."*

---

## 9. The games subsystem

The five playable games share a small, deliberately simple pattern so they stay
readable and easy to extend.

### Shared pieces (`src/components/games/`)

- **`GameShell`** (Server Component) — page chrome: back-link to the room,
  accent-themed header from the `PlayableGame`, a slot for the game, and the
  required governance note. The route page renders
  `<GameShell game={…}><XGame/></GameShell>`.
- **`GameKit`** — presentational building blocks reused by every game:
  - `GamePanel` — the console-style "screen" card
  - `Stat` — a labelled number readout
  - `EventLog` — the compact **Turn Log** (latest ~5, collision-proof keys)
  - `SaveControls` — Save / Load / Clear + status line
- **`AIGamerPanel`** — shows **AI Gamer 1** and **AI Gamer 2** with a short
  current line and an optional "ask" button. Footer: *"Local demo turns only ·
  browser-only · no memory."* All behaviour is passed in by the game.

### The AI Gamer pattern

AI Gamers are **local, scripted, deterministic** — pure functions of the current
game state (or button-triggered). They *suggest, hint, request, and react*; they
**never auto-play** for the User, and they make **no memory/identity/AI claims.**
Examples:
- Riddle Relay: AI 1 gives a first-letter/length hint; AI 2 gives a playful clue
  and reacts to each answer.
- Lantern Bridge: AI 1/AI 2 each suggest one of the current scene's choices.
- Tiny Realm Builder: AI 1 (practical) and AI 2 (flavour) issue **requests**
  derived from the board; when satisfied, they react.
- Seedling Commons: AI 1 suggests the balanced action, AI 2 the bold one.
- Glow Match Gate: AI 1 names the target colour, AI 2 cheers the streak.

This pattern is the **adoption seam in miniature**: the same interface that today
takes scripted lines could later be driven by real personas (House-side), without
touching the public scaffold.

### The five games

| Game | Room | Loop |
| --- | --- | --- |
| Riddle Relay | word | Answer ~10 riddles (loose matching), score/round, AI hints |
| Lantern Bridge | story | Branching choices to one of several warm endings |
| Tiny Realm Builder | world | Place pieces on a 6×6 grid; living-realm mood/folk/links, AI requests |
| Seedling Commons | simulation | 6-turn deterministic resource sim, threshold outcome |
| Glow Match Gate | arcade | Match the glowing target pad; streak vs. best |

### Data flow of a turn (representative)

```
User action (click/submit)
   → game client computes next state (pure, deterministic rules)
   → React state updates (board/score/scene/…)
   → derived metrics + AI Gamer lines recompute from state
   → Turn Log entry appended (unique id)
   → board/UI re-renders
   (persists only if the User clicks Save)
```

---

## 10. Local persistence model

Two independent, browser-only mechanisms — both defensive and fail-safe.

| Mechanism | File | Key(s) | Shape |
| --- | --- | --- | --- |
| Homepage demo slots | `lib/storage.ts` | `gaming-wing:demo:v1` | 3 save slots, read via `useSyncExternalStore` |
| Per-game saves | `lib/gameSave.ts` | `ai-gaming-arena:<game>:v1` | per-game `{ version, …progress }` |

Per-game keys: `ai-gaming-arena:` + `riddle-relay` / `lantern-bridge` /
`cartographers-table` / `seedling-commons` / `reflex-gate` + `:v1`.

Rules the persistence layer upholds:
- **Read defensively.** Every load runs a type-guard validator; missing or
  malformed data returns `null` and the game continues safely (never throws).
- **Versioned, fail-safe.** Each save carries an internal `version`; when a save
  shape changes (e.g. Tiny Realm Builder's board), the validator rejects
  incompatible old saves rather than crashing.
- **Progress only.** Saves store score / progress / board — never raw answers,
  identity, or profile data.
- **Explicit only.** Writes happen exclusively inside user-triggered handlers.

---

## 11. Build, quality & deploy

- **Build:** `next build` → fully static prerender of all routes.
- **Quality gates run on every change:** `npm run lint`, `npm run build`, plus
  repository scans for private names and any legacy brand terms, to keep the
  repo public-safe.
- **Deploy:** push to `main` → Vercel auto-deploys to Production. No manual
  deploy step, no secrets, no env vars.

---

## 12. The adoption boundary

The Arena is designed to be **adopted into a host AI House**, and the architecture
keeps that path narrow and safe (Law 6; see `adoption-adapter.md`).

- **Export-only.** The Arena can emit reviewed artifacts; it never accepts an
  inbound write of private material, and there is no two-way sync.
- **Review-only.** Nothing is adopted without a human review. `/review` is a
  mock of that gate today.
- **The seam already exists.** Two interfaces are the intended attach points:
  1. **`AIGamerPanel`** — today fed scripted lines; House-side it could be fed by
     real personas playing *in character* (Law 4: a game character is a costume,
     not the persona's real self), with a constrained, game-only context.
  2. **The save/export path** — today `localStorage`; House-side it would route
     through the review gate, still honouring "saves require user action" and
     "play is not memory."
- **Public-safe stays public.** Any adoption adapter lives **House-side**, never
  in this public repo. The repo's freedom from private names is what makes the
  boundary clean.

---

## 13. Non-goals (explicit exclusions)

This scaffold intentionally does **not** include, and should not gain without an
ADR: a backend, database, Convex/Supabase, authentication, real LLM/API calls,
real-time services, analytics, environment variables, secrets, deployment
automation beyond Vercel's git integration, or any private/House terminology.

---

## 14. Doc map

- [Constitution](../constitution/gaming-wing-constitution.md) — purpose + the seven laws, in prose.
- [Boundary map](./boundary-map.md) — what's in vs. deliberately out.
- [Game loop v0](./game-loop-v0.md) — how a turn flows; where an engine would attach.
- [Data model v0](./data-model-v0.md) — the domain types.
- [Adoption adapter](./adoption-adapter.md) — the export-only, review-only seam.
- [ADR-0001](../decisions/ADR-0001-public-safe-standalone-wing.md) — why a public-safe standalone arena.
