import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import { getGamesForRoom } from "@/lib/games";
import type { Room } from "@/lib/types";

export function RoomCard({ room }: { room: Room }) {
  const accent = ACCENTS[room.accent];
  const gameCount = getGamesForRoom(room.id).length;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 ${accent.glowHover}`}
    >
      {/* Portal / door art */}
      <div className="relative h-32 overflow-hidden rounded-xl border border-border bg-surface-2/60">
        <div aria-hidden className="gw-grid absolute inset-0 opacity-25" />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${accent.gradient}`}
        />
        <div
          aria-hidden
          className={`absolute -bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70 ${accent.halo}`}
        />
        {/* Sheen sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {/* Door ring + glyph */}
        <span className="absolute inset-0 grid place-items-center">
          <span
            className={`grid h-16 w-16 place-items-center rounded-full bg-background/40 text-3xl ring-1 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${accent.ring}`}
          >
            {room.icon}
          </span>
        </span>
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${accent.chip}`}
        >
          {room.hosts[0]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
          <span className="text-[11px] text-faint">{gameCount} games</span>
        </div>
        <p className={`mt-1 text-sm font-medium ${accent.text}`}>
          {room.tagline}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {room.description}
        </p>
        <span
          className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${accent.text}`}
        >
          Enter room
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
