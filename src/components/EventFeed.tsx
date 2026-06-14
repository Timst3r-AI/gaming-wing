import type { GameEvent, GameEventKind } from "@/lib/types";

const KIND_LABEL: Record<GameEventKind, string> = {
  narration: "Narration",
  action: "Action",
  dialogue: "Dialogue",
  system: "System",
  roll: "Roll",
};

const KIND_DOT: Record<GameEventKind, string> = {
  narration: "bg-violet",
  action: "bg-accent",
  dialogue: "bg-teal",
  system: "bg-faint",
  roll: "bg-rose",
};

/** A vertical transcript of game events. Used for sessions and the live demo. */
export function EventFeed({ events }: { events: GameEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-sm text-faint">
        No events yet. Take a turn to begin.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex gap-3 rounded-xl border border-border bg-surface p-4"
        >
          <span
            aria-hidden
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              KIND_DOT[event.kind as GameEventKind] ?? "bg-faint"
            }`}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold text-foreground">
                {event.actor}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-faint">
                {KIND_LABEL[event.kind as GameEventKind] ?? event.kind}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted">{event.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
