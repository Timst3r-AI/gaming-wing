import { ACCENTS } from "@/lib/accents";
import { getRoom } from "@/lib/rooms";
import type { PlayerCard } from "@/lib/types";
import { Badge } from "@/components/Badge";

/**
 * Display card for a player persona (AI 1, AI 2, or the User). Named with a
 * `View` suffix to avoid clashing with the `PlayerCard` data type.
 */
export function PlayerCardView({ player }: { player: PlayerCard }) {
  const accent = ACCENTS[player.accent];
  const favorite = getRoom(player.favoriteRoom);

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`grid h-12 w-12 place-items-center rounded-xl text-base font-bold ${accent.chip}`}
        >
          {player.kind === "AI" ? player.handle.replace("AI ", "") : "★"}
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {player.handle}
          </h3>
          <p className={`text-sm ${accent.text}`}>{player.role}</p>
        </div>
        <span className="ml-auto">
          <Badge tone={player.kind === "AI" ? "violet" : "accent"}>
            {player.kind}
          </Badge>
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">{player.bio}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {player.traits.map((trait) => (
          <span
            key={trait}
            className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
          >
            {trait}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-faint">
        Favorite room:{" "}
        <span className="text-muted">{favorite.name}</span>
      </p>
    </article>
  );
}
