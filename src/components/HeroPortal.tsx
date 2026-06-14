import { ACCENTS } from "@/lib/accents";
import { ROOMS } from "@/lib/rooms";

/**
 * Decorative hero artwork: a glowing portal with slowly spinning rings, a
 * world-map dot grid, and the five room glyphs orbiting around it. Purely
 * cosmetic (aria-hidden) and built from CSS only — no images, no dependencies.
 */
const ORBIT_POSITIONS = [
  "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-1/4 translate-x-1/2",
  "bottom-2 right-6 translate-y-1/2",
  "bottom-2 left-6 translate-y-1/2",
  "left-0 top-1/4 -translate-x-1/2",
];

export function HeroPortal() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[22rem]"
    >
      {/* Ambient glow */}
      <div className="absolute inset-4 rounded-full bg-nebula/20 blur-3xl" />
      <div className="absolute inset-10 rounded-full bg-accent/10 blur-2xl" />

      {/* Spinning rings */}
      <div className="gw-spin-slow absolute inset-0 rounded-full border border-dashed border-border-strong/70" />
      <div className="gw-spin-rev absolute inset-6 rounded-full border border-nebula/30" />
      <div className="gw-spin-slow absolute inset-12 rounded-full border border-dashed border-sky/25" />

      {/* Portal core */}
      <div className="absolute inset-[4.5rem] grid place-items-center overflow-hidden rounded-full border border-border bg-surface/70 ring-1 ring-border-strong/50 backdrop-blur-sm">
        <div className="gw-grid absolute inset-0 rounded-full opacity-30" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 via-transparent to-nebula/20" />
        <span className="gw-float relative text-5xl drop-shadow-[0_0_18px_rgba(245,177,76,0.45)]">
          🎲
        </span>
      </div>

      {/* Orbiting room glyphs */}
      {ROOMS.map((room, index) => {
        const accent = ACCENTS[room.accent];
        return (
          <span
            key={room.id}
            style={{ animationDelay: `${index * 0.6}s` }}
            className={`gw-float absolute grid h-12 w-12 place-items-center rounded-2xl bg-surface text-xl ring-1 shadow-lg shadow-black/40 ${accent.ring} ${ORBIT_POSITIONS[index]}`}
          >
            {room.icon}
          </span>
        );
      })}
    </div>
  );
}
