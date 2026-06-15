import type { ReactNode } from "react";
import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import { getRoom } from "@/lib/rooms";
import type { PlayableGame } from "@/lib/playableGames";

/**
 * Shared chrome for a game page: a back-link to the room, an accent-themed
 * header, a slot for the game itself, and the required governance note. Server
 * component; the interactive game is passed as `children` (a client component).
 */
export function GameShell({
  game,
  children,
}: {
  game: PlayableGame;
  children: ReactNode;
}) {
  const room = getRoom(game.roomId);
  const accent = ACCENTS[room.accent];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/rooms/${room.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden>←</span> {room.name}
      </Link>

      <header className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 gw-glow sm:p-8">
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${accent.gradient}`}
        />
        <div className="relative flex items-center gap-4">
          <span
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl rounded-t-3xl bg-background/40 text-2xl ring-1 backdrop-blur-sm ${accent.ring}`}
          >
            {room.icon}
          </span>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${accent.chip}`}
            >
              Game · {room.name}
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {game.name}
            </h1>
          </div>
        </div>
        <p className="relative mt-3 max-w-2xl text-muted">{game.tagline}</p>
      </header>

      <div className="mt-6">{children}</div>

      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-border bg-surface/40 p-4 text-xs leading-5 text-faint">
        <span aria-hidden>🛡️</span>
        <span>
          Play is play, never memory. This game uses browser-only save data.
          Nothing leaves your browser, and game state is not user truth.
        </span>
      </p>
    </main>
  );
}
