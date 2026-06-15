import { ACCENTS } from "@/lib/accents";
import { getRoom } from "@/lib/rooms";
import type { PlayerCard } from "@/lib/types";
import { Badge } from "@/components/Badge";

/**
 * Inventory-style display card for a player persona (AI 1, AI 2, or the User).
 * Named with a `View` suffix to avoid clashing with the `PlayerCard` data type.
 */
export function PlayerCardView({ player }: { player: PlayerCard }) {
  const accent = ACCENTS[player.accent];
  const favorite = getRoom(player.favoriteRoom);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 ${accent.glowHover}`}
    >
      {/* Card header band */}
      <div
        className={`relative flex items-center gap-3 overflow-hidden border-b border-border bg-gradient-to-br p-4 ${accent.gradient}`}
      >
        <div aria-hidden className="gw-grid absolute inset-0 opacity-20" />
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${accent.halo}`}
        />
        <span
          aria-hidden
          className={`relative grid h-12 w-12 place-items-center rounded-xl bg-background/40 text-base font-bold ring-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 ${accent.ring}`}
        >
          {player.kind === "AI" ? player.handle.replace("AI ", "") : "★"}
        </span>
        <div className="relative">
          <h3 className="font-display text-base font-semibold text-foreground">
            {player.handle}
          </h3>
          <p className={`text-sm ${accent.text}`}>{player.role}</p>
        </div>
        <span className="relative ml-auto">
          <Badge tone={player.kind === "AI" ? "nebula" : "accent"}>
            {player.kind}
          </Badge>
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-6 text-muted">{player.bio}</p>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Traits
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {player.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
            >
              {trait}
            </span>
          ))}
        </div>

        <p className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-faint">
          <span aria-hidden>{favorite.icon}</span>
          Favorite room: <span className="text-muted">{favorite.name}</span>
        </p>
      </div>
    </article>
  );
}
