import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import { getGamesForRoom } from "@/lib/games";
import { getRoom, ROOMS } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";
import { SESSIONS } from "@/data/sessions";
import { WORLD_ENTITIES } from "@/data/world";
import { Badge } from "@/components/Badge";
import { GameCard } from "@/components/GameCard";
import { SessionCard } from "@/components/SessionCard";
import { WorldEntityCard } from "@/components/WorldEntityCard";

/** Full detail view for a single room, shared by each /rooms/[slug] route. */
export function RoomDetail({ roomId }: { roomId: RoomId }) {
  const room = getRoom(roomId);
  const accent = ACCENTS[room.accent];
  const games = getGamesForRoom(roomId);
  const sessions = SESSIONS.filter((session) => session.roomId === roomId);
  const entities = WORLD_ENTITIES.filter((entity) => entity.roomId === roomId);
  const index = ROOMS.findIndex((r) => r.id === roomId);
  const doorNo = String(index + 1).padStart(2, "0");
  const otherRooms = ROOMS.filter((r) => r.id !== roomId);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden>←</span> All rooms
      </Link>

      {/* Room threshold banner */}
      <section className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 gw-glow sm:p-10">
        <div aria-hidden className="gw-grid absolute inset-0 opacity-15" />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${accent.gradient}`}
        />
        <div
          aria-hidden
          className={`absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${accent.halo}`}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <span
            className={`grid h-24 w-24 shrink-0 place-items-center rounded-3xl rounded-t-[2.5rem] bg-background/40 text-5xl ring-1 backdrop-blur-sm gw-float ${accent.ring}`}
          >
            {room.icon}
          </span>
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${accent.chip}`}
            >
              Room {doorNo}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {room.name}
            </h1>
            <p className={`mt-2 text-lg font-medium ${accent.text}`}>
              {room.tagline}
            </p>
          </div>
        </div>
        <p className="relative mt-6 max-w-2xl text-base leading-7 text-muted">
          {room.description}
        </p>
        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-faint">
            Hosted by
          </span>
          {room.hosts.map((host) => (
            <Badge key={host} tone={room.accent}>
              {host}
            </Badge>
          ))}
        </div>
      </section>

      {/* Sample activities */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-foreground">
          What you&apos;ll do here
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {room.sampleActivities.map((activity) => (
            <li
              key={activity}
              className="group rounded-xl border border-border bg-surface p-4 text-sm text-muted transition-colors hover:border-border-strong"
            >
              <span
                aria-hidden
                className={`mb-2 block h-1.5 w-6 rounded-full transition-all duration-300 group-hover:w-10 ${accent.bar}`}
              />
              {activity}
            </li>
          ))}
        </ul>
      </section>

      {/* Games — the quest board */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Quest board
          </h2>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-faint ring-1 ring-border">
            {games.length} games
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.id} game={game} accent={room.accent} />
          ))}
        </div>
      </section>

      {/* Sessions */}
      {sessions.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-foreground">
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
          <h2 className="font-display text-xl font-semibold text-foreground">
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
      <section className="mt-12 flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-6">
        <span aria-hidden className="text-lg">
          🛡️
        </span>
        <p className="text-sm leading-6 text-muted">
          Everything in this room is play. Narration is fiction, state is a toy,
          and nothing is saved unless you ask. See the{" "}
          <Link href="/docs" className="text-accent hover:text-accent-soft">
            governance laws
          </Link>{" "}
          for the full set.
        </p>
      </section>

      {/* Other doorways */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Other doorways
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherRooms.map((other) => {
            const oa = ACCENTS[other.accent];
            return (
              <Link
                key={other.id}
                href={`/rooms/${other.slug}`}
                className={`group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-all duration-300 hover:-translate-y-0.5 ${oa.glowHover}`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl rounded-t-2xl bg-surface-2 text-xl ring-1 ${oa.ring}`}
                >
                  {other.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {other.name}
                  </span>
                  <span className={`text-xs ${oa.text}`}>Enter →</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
