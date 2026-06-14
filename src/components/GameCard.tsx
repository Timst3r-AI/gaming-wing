import type { Game } from "@/lib/types";
import { Badge } from "@/components/Badge";

const DIFFICULTY_TONE = {
  casual: "teal",
  standard: "accent",
  challenge: "rose",
} as const;

export function GameCard({ game }: { game: Game }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface-2/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{game.name}</h3>
        <Badge tone={DIFFICULTY_TONE[game.difficulty]}>{game.difficulty}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{game.summary}</p>
      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
        <div className="flex items-center gap-1">
          <dt>Players</dt>
          <dd className="text-muted">{game.players}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt>Hosted by</dt>
          <dd className="text-muted">{game.hostedBy}</dd>
        </div>
      </dl>
    </article>
  );
}
