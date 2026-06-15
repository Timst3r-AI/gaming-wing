import { ROOMS } from "@/lib/rooms";

/**
 * A slow, looping ticker of room names — sets the "adventure threshold" tone
 * under the hero. Purely decorative (aria-hidden); pauses under
 * `prefers-reduced-motion`. The track is duplicated so the loop is seamless.
 */
export function RoomMarquee() {
  const track = [...ROOMS, ...ROOMS];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-border/60 bg-surface/30 py-3"
    >
      <div className="gw-marquee flex w-max items-center gap-8 pr-8">
        {track.map((room, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap text-sm text-faint"
          >
            <span className="text-base">{room.icon}</span>
            <span className="font-display uppercase tracking-[0.2em]">
              {room.name}
            </span>
            <span className="text-border-strong">◆</span>
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
