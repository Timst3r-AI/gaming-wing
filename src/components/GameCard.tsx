import { ACCENTS, type Accent } from "@/lib/accents";
import type { Game } from "@/lib/types";
import { Badge } from "@/components/Badge";

const DIFFICULTY_TONE = {
  casual: "teal",
  standard: "accent",
  challenge: "rose",
} as const;

export function GameCard({
  game,
  accent = "accent",
}: {
  game: Game;
  /** Themes the card's left rail to its room's accent. */
  accent?: Accent;
}) {
  const a = ACCENTS[accent];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-2/50 p-5 pl-6 transition-all duration-300 hover:-translate-y-0.5 ${a.glowHover}`}
    >
      {/* Quest-board accent rail */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${a.bar}`}
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{game.name}</h3>
        <Badge tone={DIFFICULTY_TONE[game.difficulty]}>{game.difficulty}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{game.summary}</p>
      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
        <div className="flex items-center gap-1">
          <dt aria-hidden>👥</dt>
          <dt className="sr-only">Players</dt>
          <dd className="text-muted">{game.players}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt aria-hidden>🎛️</dt>
          <dt className="sr-only">Hosted by</dt>
          <dd className="text-muted">{game.hostedBy}</dd>
        </div>
      </dl>
    </article>
  );
}
