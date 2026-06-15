import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import { getGamesForRoom } from "@/lib/games";
import { ROOMS } from "@/lib/rooms";
import type { Room } from "@/lib/types";

export function RoomCard({ room }: { room: Room }) {
  const accent = ACCENTS[room.accent];
  const gameCount = getGamesForRoom(room.id).length;
  const doorNo = String(ROOMS.findIndex((r) => r.id === room.id) + 1).padStart(
    2,
    "0",
  );

  return (
    <Link
      href={`/rooms/${room.slug}`}
      aria-label={`Enter ${room.name}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-3 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 ${accent.glowHover}`}
    >
      {/* The door */}
      <div className="relative h-48 overflow-hidden rounded-2xl rounded-t-[2.75rem] border border-border bg-surface-2/60 sm:h-52">
        <div aria-hidden className="gw-grid absolute inset-0 opacity-25" />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-b ${accent.gradient}`}
        />
        {/* Light spilling from the doorway, stronger on hover */}
        <div
          aria-hidden
          className={`absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-50 transition-opacity duration-300 group-hover:opacity-90 ${accent.halo}`}
        />
        {/* Sheen sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />

        {/* Door number plate */}
        <span className="absolute left-3 top-3 rounded-md bg-background/55 px-2 py-0.5 font-mono text-[10px] tracking-widest text-faint ring-1 ring-border backdrop-blur-sm">
          ROOM {doorNo}
        </span>
        {/* Host chip */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium ${accent.chip}`}
        >
          {room.hosts[0]}
        </span>

        {/* Crest */}
        <span className="absolute left-1/2 top-9 -translate-x-1/2 text-4xl drop-shadow transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110">
          {room.icon}
        </span>

        {/* Keyhole */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[62%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        >
          <span
            className={`absolute -z-0 h-14 w-14 rounded-full opacity-60 blur-lg transition-opacity duration-300 group-hover:opacity-100 ${accent.halo}`}
          />
          <span
            className={`relative h-5 w-5 rounded-full bg-background ring-2 ${accent.ring}`}
          />
          <span className="relative -mt-0.5 h-3 w-1.5 rounded-b-sm bg-background" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {room.name}
          </h3>
          <span className="shrink-0 text-[11px] text-faint">
            {gameCount} games
          </span>
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
          Step through
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
