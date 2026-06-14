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
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 ${accent.glowHover}`}
    >
      {/* Accent halo, top-right */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-90 opacity-50 ${accent.halo}`}
      />

      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className={`grid h-12 w-12 place-items-center rounded-xl text-base font-bold ring-1 transition-transform duration-300 group-hover:scale-105 ${accent.chip}`}
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
          <Badge tone={player.kind === "AI" ? "nebula" : "accent"}>
            {player.kind}
          </Badge>
        </span>
      </div>

      <p className="relative mt-4 text-sm leading-6 text-muted">{player.bio}</p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {player.traits.map((trait) => (
          <span
            key={trait}
            className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
          >
            {trait}
          </span>
        ))}
      </div>

      <p className="relative mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-faint">
        <span aria-hidden>{favorite.icon}</span>
        Favorite room: <span className="text-muted">{favorite.name}</span>
      </p>
    </article>
  );
}
