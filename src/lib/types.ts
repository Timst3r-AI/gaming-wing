/**
 * Domain types for the Gaming Wing scaffold.
 *
 * Everything here is public-safe and demo-only. These types describe a
 * governed "AI playhouse": rooms hosted by agents, mock games, mock sessions,
 * world entities, and a review queue. No private material, identities, or
 * memory architecture is represented — see the governance laws.
 */

/** Stable identifier for each room in the wing. */
export type RoomId = "world" | "story" | "word" | "simulation" | "arcade";

/**
 * The only agent roles this public scaffold knows about. Kept deliberately
 * generic so nothing private can leak through naming.
 */
export type AgentRole =
  | "Game Master"
  | "World Agent"
  | "Room Agent"
  | "NPC"
  | "AI 1"
  | "AI 2"
  | "User";

export type GameKind =
  | "worldbuilding"
  | "story-quest"
  | "word"
  | "simulation"
  | "arcade";

export interface Room {
  id: RoomId;
  /** URL segment under /rooms. */
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Emoji used as a lightweight, dependency-free room mark. */
  icon: string;
  /** CSS variable token name (without the `--color-` prefix) for the accent. */
  accent: "nebula" | "accent" | "teal" | "rose" | "sky";
  /** Agents that host or steward play in this room. */
  hosts: AgentRole[];
  sampleActivities: string[];
}

export interface Game {
  id: string;
  name: string;
  kind: GameKind;
  roomId: RoomId;
  summary: string;
  /** Suggested number of players (including the User). */
  players: string;
  difficulty: "casual" | "standard" | "challenge";
  hostedBy: AgentRole;
}

export type PlayerKind = "AI" | "User";

export interface PlayerCard {
  id: string;
  /** Public-safe handle: "AI 1", "AI 2", "User". */
  handle: string;
  kind: PlayerKind;
  role: string;
  bio: string;
  traits: string[];
  favoriteRoom: RoomId;
  /** Accent token name for the avatar chip. */
  accent: "nebula" | "accent" | "teal" | "rose" | "sky";
}

export type GameEventKind =
  | "narration"
  | "action"
  | "dialogue"
  | "system"
  | "roll";

export interface GameEvent {
  id: string;
  sessionId: string;
  /** 1-based position within its session. */
  order: number;
  kind: GameEventKind;
  /** Who produced the event, e.g. "Game Master", "AI 1". */
  actor: string;
  text: string;
}

export type SessionStatus = "live" | "paused" | "demo-archived";

export interface GameSession {
  id: string;
  title: string;
  roomId: RoomId;
  gameId: string;
  status: SessionStatus;
  /** Player handles taking part. */
  participants: string[];
  turn: number;
  summary: string;
}

export type WorldEntityKind =
  | "place"
  | "faction"
  | "artifact"
  | "creature"
  | "npc";

export interface WorldEntity {
  id: string;
  name: string;
  kind: WorldEntityKind;
  roomId: RoomId;
  description: string;
  tags: string[];
  stewardAgent: AgentRole;
}

export type ReviewStatus = "pending" | "approved" | "needs-changes";

export type ReviewItemKind =
  | "world-entity"
  | "story-arc"
  | "session-summary"
  | "character-sheet";

export interface ReviewItem {
  id: string;
  title: string;
  /** Human label for where the item came from. */
  origin: string;
  kind: ReviewItemKind;
  status: ReviewStatus;
  submittedBy: string;
  note: string;
  /** Governance checks a reviewer would confirm before any export. */
  governanceFlags: string[];
}

/** One governance law shown across the wing. */
export interface GovernanceLaw {
  id: string;
  title: string;
  detail: string;
}
