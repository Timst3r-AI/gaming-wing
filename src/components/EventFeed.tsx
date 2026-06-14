import type { GameEvent, GameEventKind } from "@/lib/types";

const KIND_LABEL: Record<GameEventKind, string> = {
  narration: "Narration",
  action: "Action",
  dialogue: "Dialogue",
  system: "System",
  roll: "Roll",
};

const KIND_DOT: Record<GameEventKind, string> = {
  narration: "bg-nebula",
  action: "bg-accent",
  dialogue: "bg-teal",
  system: "bg-faint",
  roll: "bg-rose",
};

const KIND_TEXT: Record<GameEventKind, string> = {
  narration: "text-nebula",
  action: "text-accent",
  dialogue: "text-teal",
  system: "text-faint",
  roll: "text-rose",
};

/** A vertical transcript of game events. Used for sessions and the live demo. */
export function EventFeed({ events }: { events: GameEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
        <span aria-hidden className="text-2xl opacity-70">
          🎲
        </span>
        <p className="text-sm text-faint">
          No events yet. Press{" "}
          <span className="font-medium text-muted">Take a turn</span> to begin
          the loop.
        </p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2.5">
      {events.map((event) => {
        const kind = event.kind as GameEventKind;
        return (
          <li
            key={event.id}
            className="gw-rise flex gap-3 rounded-xl border border-border bg-surface/80 p-4 transition-colors hover:border-border-strong"
          >
            <span
              aria-hidden
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                KIND_DOT[kind] ?? "bg-faint"
              }`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-foreground">
                  {event.actor}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${
                    KIND_TEXT[kind] ?? "text-faint"
                  }`}
                >
                  {KIND_LABEL[kind] ?? event.kind}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted">{event.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
