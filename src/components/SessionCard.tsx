import { getGame } from "@/lib/games";
import { getRoom } from "@/lib/rooms";
import type { GameSession, SessionStatus } from "@/lib/types";
import { Badge } from "@/components/Badge";

const STATUS: Record<SessionStatus, { label: string; tone: "live" | "accent" | "neutral" }> =
  {
    live: { label: "Live", tone: "live" },
    paused: { label: "Paused", tone: "accent" },
    "demo-archived": { label: "Demo archive", tone: "neutral" },
  };

export function SessionCard({ session }: { session: GameSession }) {
  const room = getRoom(session.roomId);
  const game = getGame(session.gameId);
  const status = STATUS[session.status];

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-faint">
            {room.icon} {room.name}
            {game ? <span className="text-faint"> · {game.name}</span> : null}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {session.title}
          </h3>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{session.summary}</p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-faint">
        <div className="flex items-center gap-1">
          <dt>Turn</dt>
          <dd className="font-semibold text-muted">{session.turn}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt>Players</dt>
          <dd className="text-muted">{session.participants.join(", ")}</dd>
        </div>
      </dl>
    </article>
  );
}
