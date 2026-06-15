# Data Model v0

The domain types for The AI Gaming Arena live in
[`src/lib/types.ts`](../../src/lib/types.ts). They describe a governed gaming arena
in **public-safe, demo-only** terms. Nothing here is a database schema — these
are the shapes of mock data and local state in this pass.

## Entities at a glance

```
Room ──< Game
  │        │
  │        ▼
  └──────< GameSession ──< GameEvent
  │
  └──────< WorldEntity

PlayerCard   (User, AI 1, AI 2)
ReviewItem   (review queue → adoption gate)
GovernanceLaw
```

## Types

### Room

A room within The AI Gaming Arena. Source of truth for the `/rooms/[slug]` routes.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `RoomId` | `world` · `story` · `word` · `simulation` · `arcade` |
| `slug` | `string` | URL segment under `/rooms`. |
| `name`, `tagline`, `description` | `string` | Display copy. |
| `icon` | `string` | Emoji mark (dependency-free). |
| `accent` | accent token | `nebula` · `accent` · `teal` · `rose` · `sky`. |
| `hosts` | `AgentRole[]` | Agents that host/steward the room. |
| `sampleActivities` | `string[]` | Example things to do. |

### Game

A catalog entry within one room. No engine behind it yet.

| Field | Type | Notes |
| --- | --- | --- |
| `id`, `name`, `summary` | `string` | |
| `kind` | `GameKind` | `worldbuilding` · `story-quest` · `word` · `simulation` · `arcade`. |
| `roomId` | `RoomId` | Owning room. |
| `players` | `string` | Suggested player line-up. |
| `difficulty` | `'casual' \| 'standard' \| 'challenge'` | |
| `hostedBy` | `AgentRole` | |

### PlayerCard

A persona. **A costume, not an identity** (law 4).

| Field | Type | Notes |
| --- | --- | --- |
| `handle` | `string` | `User`, `AI 1`, `AI 2`. |
| `kind` | `'AI' \| 'User'` | |
| `role`, `bio` | `string` | |
| `traits` | `string[]` | |
| `favoriteRoom` | `RoomId` | |

### GameSession & GameEvent

A frozen snapshot of play and its narrated transcript. **State is not truth**
(law 2); **events are fiction** (laws 1–3).

`GameSession`: `title`, `roomId`, `gameId`, `status` (`live` · `paused` ·
`demo-archived`), `participants`, `turn`, `summary`.

`GameEvent`: `sessionId`, `order`, `kind` (`narration` · `action` · `dialogue` ·
`system` · `roll`), `actor`, `text`.

### WorldEntity

Imaginative furniture, stewarded for consistency but never real.

`name`, `kind` (`place` · `faction` · `artifact` · `creature` · `npc`),
`roomId`, `description`, `tags`, `stewardAgent`.

### ReviewItem

An item in the review queue — the mock of the adoption gate.

`title`, `origin`, `kind` (`world-entity` · `story-arc` · `session-summary` ·
`character-sheet`), `status` (`pending` · `approved` · `needs-changes`),
`submittedBy`, `note`, `governanceFlags`.

### GovernanceLaw

`id`, `title`, `detail` — the seven laws, rendered across the UI.

## Demo save state (separate from the domain types)

The `localStorage` demo, in [`src/lib/storage.ts`](../../src/lib/storage.ts),
defines its own small, versioned shapes so saved data can be validated on read:

```ts
interface DemoTurn  { id: string; actor: string; kind: string; text: string }
interface DemoState { version: 1; turns: DemoTurn[] }
interface SaveSlot  { index: number; savedAt: string; state: DemoState }
```

- One storage key (`gaming-wing:demo:v1`) holds a fixed array of three slots.
- Reads are defensive: malformed or foreign data resolves to empty slots, never
  a thrown error.
- The `version` field leaves room to migrate the demo format later.

## Invariants the model upholds

- Every `Game`, `GameSession`, and `WorldEntity` references a valid `RoomId`.
- Agent/actor names use only the **public-safe vocabulary**.
- No type carries secrets, real identities, or anything private.
- Persisted demo state is explicit, versioned, and local-only.
