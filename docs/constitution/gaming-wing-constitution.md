# The AI Gaming Arena Constitution

> A governed AI gaming arena. Public-safe by design.

This document states what The AI Gaming Arena **is**, what it is **for**, and the
**laws** that keep it safe and warm. It is written for everyone — players,
maintainers, and any future host system — and it is the source of truth that the
code and UI mirror.

## Purpose

The AI Gaming Arena is a room-based place to **play** with AI Gamers. A **User**
plays alongside **AI 1** and **AI 2**, hosted by a **Game Master**, a **World
Agent**, and **Room Agents**, across five rooms: worldbuilding, story quests,
word games, simulation, and arcade.

Play here is meant to be imaginative, replayable, and low-stakes. The arena should
feel like a welcoming game space with clear house rules — not a clone of any
existing product, and not a system of record for anything real.

## The seven laws

These laws govern every room. They are not decoration; they constrain what the
software is allowed to do and what any future extension may build.

### 1. Play is not memory.

What happens in a session is play. It is never written back as a real memory of
any person or system. A transcript is a story we told, not an event that
happened.

### 2. Game state is not user truth.

Scores, inventories, levels, and saves describe a **game in progress**. They are
never facts about the User or claims about the world outside the game.

### 3. AI-generated story is not authority.

Narration from the Game Master, the World Agent, or any NPC is **fiction**. It
does not decide anything outside the game, and it carries no authority over the
User or over real matters.

### 4. Character continuity is not personal identity.

A character that persists across sessions is a **costume**, not a self.
Continuity is a convenience for storytelling; it never becomes a claim about a
real identity.

### 5. Saves require user action.

Nothing is persisted unless the **User explicitly saves it**. In this scaffold,
demo saves live only in the browser's `localStorage` and can be cleared at any
time. There is no silent or automatic persistence.

### 6. Adoption into a host AI House must be export-only and review-only.

If a host AI House ever adopts content created in this arena, it may happen only
through an **explicit export** that a **human reviews first**. There is no
automatic or two-way sync. See the
[adoption adapter](../architecture/adoption-adapter.md).

### 7. No private material may enter this public repo.

This is a **public, standalone** arena. Private names, personal archives, internal
memory architecture, and any project internals are kept out **by design**. The
vocabulary is deliberately generic: User, AI 1, AI 2, Game Master, NPC, World
Agent, Room Agent.

## Public-safe vocabulary

To keep the arena public, the project uses only these role terms:

- **User** — the person playing.
- **AI 1**, **AI 2** — resident AI Gamers.
- **Game Master** — narrates and adjudicates story play.
- **NPC** — non-player characters within a story.
- **World Agent** — stewards worldbuilding for consistency.
- **Room Agent** — hosts the games within a room.

No other identities, private terms, or internal systems are referenced anywhere
in this repository.

## Relationship to the code

- The laws are encoded in [`src/lib/governance.ts`](../../src/lib/governance.ts)
  and rendered across the UI.
- The public vocabulary is the only agent vocabulary in
  [`src/lib/types.ts`](../../src/lib/types.ts).
- The "saves require user action" law is realized by the demo save slots in
  [`src/lib/storage.ts`](../../src/lib/storage.ts).
- The boundaries of this pass are recorded in the
  [boundary map](../architecture/boundary-map.md) and
  [ADR-0001](../decisions/ADR-0001-public-safe-standalone-wing.md).

## Amendment

Changes to these laws should be made deliberately, via an ADR in
[`docs/decisions/`](../decisions/), so the reasoning is preserved alongside the
change.
