/**
 * Shared AI Gamer presence for game pages. Shows AI Gamer 1 and AI Gamer 2 with
 * a short current line and an optional "ask" button. All behaviour is local,
 * scripted, and deterministic — this is demo play, not real AI, and not memory.
 */

export interface AIGamerSlot {
  /** The AI Gamer's current line (suggestion / reaction). */
  line?: string;
  /** If set, renders a button that triggers `onAsk`. */
  askLabel?: string;
  onAsk?: () => void;
}

function Row({
  badge,
  name,
  chip,
  slot,
}: {
  badge: string;
  name: string;
  chip: string;
  slot: AIGamerSlot;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-2/40 p-2.5">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ring-1 ${chip}`}
      >
        {badge}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-foreground">{name}</span>
          {slot.onAsk ? (
            <button
              type="button"
              onClick={slot.onAsk}
              className="shrink-0 rounded-md bg-surface-3 px-2 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-border transition hover:brightness-125"
            >
              {slot.askLabel ?? "Ask"}
            </button>
          ) : null}
        </div>
        <p
          className={`mt-0.5 text-xs leading-5 ${
            slot.line ? "text-muted" : "text-faint"
          }`}
        >
          {slot.line ?? "Waiting for a turn…"}
        </p>
      </div>
    </div>
  );
}

export function AIGamerPanel({
  ai1,
  ai2,
}: {
  ai1: AIGamerSlot;
  ai2: AIGamerSlot;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground">
          AI Gamers
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          demo play
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Row
          badge="1"
          name="AI Gamer 1"
          chip="bg-nebula/10 text-nebula ring-nebula/30"
          slot={ai1}
        />
        <Row
          badge="2"
          name="AI Gamer 2"
          chip="bg-teal/10 text-teal ring-teal/30"
          slot={ai2}
        />
      </div>
      <p className="mt-2 text-[11px] leading-4 text-faint">
        Scripted demo teammates — not real AI, and not memory.
      </p>
    </div>
  );
}
