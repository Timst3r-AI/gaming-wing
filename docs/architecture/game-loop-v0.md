# Game Loop v0

This describes how a "turn" flows in the current scaffold and where a real
engine would attach later. **v0 is deliberately tiny**: no engine, no model, no
network — just mock data and local state.

## v0: what actually happens today

The interactive surface is the **gaming console** demo on the landing page
([`src/components/PlayhouseDemo.tsx`](../../src/components/PlayhouseDemo.tsx)).

```
User clicks "Take a turn"
        │
        ▼
pick a random TurnTemplate        (src/data/turnTemplates.ts)
        │
        ▼
append to local component state   (useState<DemoTurn[]>)
        │
        ▼
render the transcript             (EventFeed component)
        │
        ▼
(optional) User clicks "Save here"
        │
        ▼
write the turns into a slot       (localStorage, src/lib/storage.ts)
```

Key properties:

- **Turns are canned.** A turn is one of a few hand-written templates. There is
  no generation.
- **State is local and ephemeral.** Play lives in `useState`. Reloading the page
  clears it unless the User saved.
- **Saving is explicit.** Nothing is written to `localStorage` without a button
  press (law 5: *saves require user action*).
- **Everything is fiction.** Narration, dialogue, and rolls are story, not facts
  (laws 1–3).

## The event shapes

A turn is recorded as a `DemoTurn` and rendered through the same `GameEvent`
shape the rest of the wing uses:

| Field | Meaning |
| --- | --- |
| `actor` | Who produced it — `Game Master`, `AI 1`, `World Agent`, `NPC`, `Room Agent`, `User`. |
| `kind` | `narration` · `action` · `dialogue` · `system` · `roll`. |
| `text` | The fiction itself. |

Mock sessions in [`src/data/sessions.ts`](../../src/data/sessions.ts) and their
events in [`src/data/events.ts`](../../src/data/events.ts) use the same shapes,
so the demo and the static content are consistent.

## The conceptual loop (turn lifecycle)

Even in v0, the loop follows a recognizable shape that a future engine would
formalize:

```
        ┌─────────────┐
        │  Prompt /    │   the room/game presents a situation
        │  situation   │
        └──────┬───────┘
               ▼
        ┌─────────────┐
        │  Player      │   User, AI 1, AI 2, or an NPC acts
        │  action      │
        └──────┬───────┘
               ▼
        ┌─────────────┐
        │  Host        │   Game Master / Room Agent / World Agent
        │  resolves    │   narrates the outcome (a "roll")
        └──────┬───────┘
               ▼
        ┌─────────────┐
        │  Event       │   append to the transcript / state
        │  recorded    │
        └──────┬───────┘
               ▼
        loop back, or User saves / resets
```

## Where a real engine would attach (future, not in this pass)

These are **seams**, not commitments. None of this is built yet, and building it
must respect the governance laws and the
[boundary map](./boundary-map.md).

- **Turn resolution** — replace `pick a random TurnTemplate` with a real host
  (engine or model) producing the next event. Would live behind a clear
  interface so the UI doesn't change.
- **Session persistence** — replace demo `localStorage` slots with a real store
  *only* if explicit-save and "state is not truth" are preserved.
- **AI Gamer behavior** — AI 1 / AI 2 turn-taking logic.
- **Export** — emit reviewed, fiction-only artifacts via the
  [adoption adapter](./adoption-adapter.md).

Each seam is intentionally isolated so v0 stays small and safe while leaving room
to grow.
