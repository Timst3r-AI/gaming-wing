import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import { getGamesForRoom } from "@/lib/games";
import { getRoom } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";
import { SESSIONS } from "@/data/sessions";
import { WORLD_ENTITIES } from "@/data/world";
import { Badge } from "@/components/Badge";
import { GameCard } from "@/components/GameCard";
import { PageHeader } from "@/components/PageHeader";
import { SessionCard } from "@/components/SessionCard";
import { WorldEntityCard } from "@/components/WorldEntityCard";

/** Full detail view for a single room, shared by each /rooms/[slug] route. */
export function RoomDetail({ roomId }: { roomId: RoomId }) {
  const room = getRoom(roomId);
  const accent = ACCENTS[room.accent];
  const games = getGamesForRoom(roomId);
  const sessions = SESSIONS.filter((session) => session.roomId === roomId);
  const entities = WORLD_ENTITIES.filter((entity) => entity.roomId === roomId);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <PageHeader
        eyebrow="Room"
        title={`${room.icon} ${room.name}`}
        lead={room.description}
        action={
          <Link
            href="/rooms"
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            ← All rooms
          </Link>
        }
      />

      <p className={`mt-6 text-lg font-medium ${accent.text}`}>{room.tagline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-faint">
          Hosted by
        </span>
        {room.hosts.map((host) => (
          <Badge key={host} tone={room.accent}>
            {host}
          </Badge>
        ))}
      </div>

      {/* Sample activities */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">
          What you&apos;ll do here
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {room.sampleActivities.map((activity) => (
            <li
              key={activity}
              className="rounded-xl border border-border bg-surface p-4 text-sm text-muted"
            >
              <span
                aria-hidden
                className={`mb-2 block h-1.5 w-6 rounded-full ${accent.bar}`}
              />
              {activity}
            </li>
          ))}
        </ul>
      </section>

      {/* Games */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">
          Games in this room
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Sessions */}
      {sessions.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground">
            Recent sessions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      ) : null}

      {/* World entities */}
      {entities.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground">
            Stewarded entities
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => (
              <WorldEntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Governance reminder */}
      <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
        <p className="text-sm leading-6 text-muted">
          Everything in this room is play. Narration is fiction, state is a toy,
          and nothing is saved unless you ask. See the{" "}
          <Link href="/docs" className="text-accent hover:text-accent-soft">
            governance laws
          </Link>{" "}
          for the full set.
        </p>
      </section>
    </main>
  );
}
