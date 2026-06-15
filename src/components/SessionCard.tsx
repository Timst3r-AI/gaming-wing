import { ACCENTS } from "@/lib/accents";
import { getGame } from "@/lib/games";
import { getRoom } from "@/lib/rooms";
import type { GameSession, SessionStatus } from "@/lib/types";
import { Badge } from "@/components/Badge";

const STATUS: Record<
  SessionStatus,
  { label: string; tone: "live" | "accent" | "neutral"; dot: boolean }
> = {
  live: { label: "Live", tone: "live", dot: true },
  paused: { label: "Paused", tone: "accent", dot: false },
  "demo-archived": { label: "Demo snapshot", tone: "neutral", dot: false },
};

export function SessionCard({ session }: { session: GameSession }) {
  const room = getRoom(session.roomId);
  const accent = ACCENTS[room.accent];
  const game = getGame(session.gameId);
  const status = STATUS[session.status];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 pl-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 ${accent.glowHover}`}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1 text-xs text-faint">
            <span aria-hidden>{room.icon}</span>
            {room.name}
            {game ? <span className="text-faint"> · {game.name}</span> : null}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {session.title}
          </h3>
        </div>
        <Badge tone={status.tone} dot={status.dot}>
          {status.label}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{session.summary}</p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-faint">
        <div className="flex items-center gap-1">
          <dt>Turn</dt>
          <dd className="font-mono font-semibold text-muted">{session.turn}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt>Players</dt>
          <dd className="text-muted">{session.participants.join(", ")}</dd>
        </div>
      </dl>
    </article>
  );
}
