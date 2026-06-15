/**
 * Atmospheric hero backdrop — a magical "threshold into the wing" rendered
 * purely from CSS + inline SVG (no image files, no dependencies). Deep indigo
 * glows, a faint world-map dot field, a luminous portal ring, and a scatter of
 * soft star glints, finished with dark gradient overlays so hero text stays
 * highly readable. Decorative only (aria-hidden); motion respects
 * `prefers-reduced-motion`.
 */
const STARS = [
  "left-[14%] top-[24%]",
  "left-[30%] top-[66%]",
  "left-[46%] top-[18%]",
  "left-[63%] top-[70%]",
  "left-[78%] top-[32%]",
  "left-[88%] top-[56%]",
  "left-[22%] top-[44%]",
  "left-[71%] top-[48%]",
];

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Deep atmospheric glows */}
      <div className="absolute -top-32 left-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-nebula/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 rounded-full bg-nebula/15 blur-[130px]" />
      <div className="absolute bottom-[-12%] left-[4%] h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute right-1/3 top-[-14%] h-[22rem] w-[22rem] rounded-full bg-sky/10 blur-[120px]" />

      {/* Faint dot field */}
      <div className="gw-grid absolute inset-0 opacity-[0.06]" />

      {/* Luminous portal / threshold ring, framing the right of the hero */}
      <svg
        className="absolute right-0 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 translate-x-1/4 opacity-50"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="196" className="stroke-nebula/30" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="150"
          className="stroke-sky/20"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
        <circle cx="200" cy="200" r="104" className="stroke-accent/20" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="58"
          className="stroke-nebula/25"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
      </svg>

      {/* Soft star glints */}
      {STARS.map((pos, i) => (
        <span
          key={pos}
          style={{ animationDelay: `${i * 0.45}s` }}
          className={`gw-twinkle absolute h-1 w-1 rounded-full bg-white/70 ${pos}`}
        />
      ))}

      {/* Readability overlays — keep the left (text) side dark and solid */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
