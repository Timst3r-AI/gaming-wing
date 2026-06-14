import Link from "next/link";
import { ACCENTS } from "@/lib/accents";
import type { Room } from "@/lib/types";

export function RoomCard({ room }: { room: Room }) {
  const accent = ACCENTS[room.accent];
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 ${accent.cardHover}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} aria-hidden />
      <div className="mb-4 flex items-center justify-between">
        <span aria-hidden className="text-3xl">
          {room.icon}
        </span>
        <span className={`text-xs font-medium ${accent.text}`}>
          {room.hosts[0]}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
      <p className={`mt-1 text-sm font-medium ${accent.text}`}>{room.tagline}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
        {room.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/90">
        Enter room
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
