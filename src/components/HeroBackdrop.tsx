import { ACCENTS } from "@/lib/accents";
import { ROOMS } from "@/lib/rooms";

/**
 * Cinematic fantasy hero backdrop for the homepage.
 *
 * A warm horizon glow backlights a large arena keep (the destination), with
 * layered mountains, a forest treeline, drifting mist, glowing valley pools, a
 * lantern-lit road climbing to the gate, the five rooms planted as world
 * banners, and dark foreground framing. Pure CSS + inline SVG — no images, no
 * dependencies. Decorative only (aria-hidden); motion respects
 * prefers-reduced-motion. The left third stays dark so the hero copy reads
 * clearly on desktop and mobile.
 */

// Forest treeline silhouette (deterministic zig-zag of conifer peaks).
function buildTreeline(baseY: number): string {
  let d = `M0,${baseY}`;
  for (let x = 0; x <= 1200; x += 46) {
    const peak = baseY - 42 - ((Math.floor(x / 46) % 3) * 16);
    d += ` L${x + 23},${peak} L${x + 46},${baseY}`;
  }
  return `${d} L1200,${baseY + 40} L0,${baseY + 40} Z`;
}

// Lanterns lining the road up to the gate (x, y, r), fading smaller near the keep.
const LANTERNS = [
  { x: 648, y: 566, r: 3 },
  { x: 712, y: 516, r: 2.7 },
  { x: 690, y: 540, r: 2.6 },
  { x: 770, y: 474, r: 2.3 },
  { x: 812, y: 446, r: 2 },
  { x: 852, y: 420, r: 1.8 },
];

// Five rooms planted as world banners; near markers larger, far ones smaller.
const NODES = [
  { i: 1, x: 742, y: 360, banner: "h-7 w-9 text-sm", pole: "h-7", op: "opacity-80", d: 0.3 },
  { i: 2, x: 1012, y: 350, banner: "h-7 w-9 text-sm", pole: "h-6", op: "opacity-75", d: 1.2 },
  { i: 0, x: 676, y: 436, banner: "h-9 w-11 text-base", pole: "h-9", op: "opacity-95", d: 0.7 },
  { i: 3, x: 1086, y: 446, banner: "h-9 w-11 text-base", pole: "h-9", op: "opacity-90", d: 1.6 },
  { i: 4, x: 818, y: 506, banner: "h-11 w-14 text-lg", pole: "h-12", op: "opacity-100", d: 1.0 },
];

const STARS = [
  "left-[50%] top-[10%]",
  "left-[60%] top-[7%]",
  "left-[68%] top-[16%]",
  "left-[78%] top-[9%]",
  "left-[86%] top-[18%]",
  "left-[92%] top-[11%]",
  "left-[64%] top-[24%]",
  "left-[88%] top-[28%]",
];

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08071c] via-[#1a1640] to-[#0b0a1e]" />

      {/* Warm horizon glow that backlights the keep */}
      <div className="absolute left-[72%] top-[44%] h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent/25 blur-[90px]" />
      <div className="absolute left-[72%] top-[47%] h-48 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-rose/12 blur-[90px]" />
      <div className="absolute left-[72%] top-[42%] h-40 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-accent-soft/25 blur-3xl" />
      {/* Upper atmosphere */}
      <div className="absolute left-[40%] top-[-8%] h-72 w-[40rem] -translate-x-1/2 rounded-full bg-nebula/12 blur-[120px]" />

      {/* Stars */}
      {STARS.map((pos, i) => (
        <span
          key={pos}
          style={{ animationDelay: `${i * 0.5}s` }}
          className={`gw-twinkle absolute h-1 w-1 rounded-full bg-white/75 ${pos}`}
        />
      ))}

      {/* Background mountains + the keep (back to front) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Distant range (hazy, light) */}
        <path
          d="M0,318 L150,262 L300,300 L470,244 L640,294 L820,236 L1000,290 L1180,250 L1200,262 L1200,420 L0,420 Z"
          fill="#322d63"
          opacity="0.55"
        />
        {/* Far range */}
        <path
          d="M0,344 L150,290 L320,330 L500,272 L680,322 L860,266 L1040,318 L1200,288 L1200,440 L0,440 Z"
          fill="#262252"
        />

        {/* The arena keep — backlit silhouette with crenellations */}
        <path
          d="M806,408 L806,318 L814,318 L814,304 L824,304 L824,318 L834,318 L834,298 L846,298 L846,330 L858,330 L858,250 L866,250 L866,234 L878,234 L878,250 L890,250 L890,234 L902,234 L902,250 L910,250 L910,330 L922,330 L922,298 L934,298 L934,318 L944,318 L944,304 L954,304 L954,318 L962,318 L962,408 Z"
          fill="#0d0b22"
        />
        {/* Rim light along the keep skyline */}
        <path
          d="M806,318 L814,318 L814,304 L824,304 L824,318 L834,318 L834,298 L846,298 L846,330 L858,330 L858,250 L866,250 L866,234 L878,234 L878,250 L890,250 L890,234 L902,234 L902,250 L910,250 L910,330 L922,330 L922,298 L934,298 L934,318 L944,318 L944,304 L954,304 L954,318 L962,318"
          stroke="#f5b14c"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        {/* Glowing gate */}
        <path d="M870,408 L870,382 Q870,364 884,364 Q898,364 898,382 L898,408 Z" fill="#f5b14c" fillOpacity="0.85" />
        {/* Lit windows */}
        <rect x="818" y="356" width="5" height="8" fill="#ffd79a" fillOpacity="0.8" />
        <rect x="941" y="356" width="5" height="8" fill="#ffd79a" fillOpacity="0.8" />
        <rect x="869" y="300" width="5" height="9" fill="#ffd79a" fillOpacity="0.75" />
        <rect x="891" y="300" width="5" height="9" fill="#ffd79a" fillOpacity="0.75" />
        {/* Pennants */}
        <path d="M884,234 L884,214" stroke="#847ec0" strokeWidth="1" />
        <path d="M884,216 L900,221 L884,226 Z" fill="#fb7faf" fillOpacity="0.8" />
        <path d="M830,298 L830,282" stroke="#847ec0" strokeWidth="1" />
        <path d="M830,284 L842,288 L830,292 Z" fill="#5eead4" fillOpacity="0.75" />

        {/* Mid range / hills in front of the keep base */}
        <path
          d="M0,392 L180,344 L360,386 L520,336 L700,382 L760,360 L820,388 L900,360 L980,388 L1140,340 L1200,372 L1200,470 L0,470 Z"
          fill="#181539"
        />
      </svg>

      {/* Forest treeline (midground) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
        <path d={buildTreeline(452)} fill="#11102b" />
      </svg>

      {/* Mist bands */}
      <div className="absolute left-[70%] top-[63%] h-16 w-[62%] -translate-x-1/2 rounded-[100%] bg-white/[0.06] blur-2xl" />
      <div className="absolute left-[60%] top-[70%] h-14 w-[74%] -translate-x-1/2 rounded-[100%] bg-white/[0.05] blur-2xl" />

      {/* Valley light pools */}
      <div className="absolute left-[60%] top-[64%] h-32 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/22 blur-3xl" />
      <div className="absolute left-[82%] top-[66%] h-28 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/16 blur-3xl" />
      <div className="absolute left-[70%] top-[60%] h-28 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nebula/16 blur-3xl" />

      {/* Gate glow */}
      <div className="absolute left-[73.7%] top-[66%] h-16 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40 blur-xl gw-pulse" />

      {/* Lantern-lit road climbing to the gate */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="hero-road" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f5b14c" stopOpacity="0.05" />
            <stop offset="1" stopColor="#f5b14c" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Road surface */}
        <path d="M604,598 Q700,508 872,406 L896,406 Q742,508 724,598 Z" fill="url(#hero-road)" />
        {/* Road centre glow */}
        <path
          d="M664,598 Q740,508 884,406"
          className="stroke-accent/35"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Drifting motes along the road */}
        <path
          d="M664,598 Q740,508 884,406"
          className="gw-dash stroke-accent-soft/60"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1 18"
        />
        {/* Lanterns */}
        {LANTERNS.map((l, i) => (
          <circle
            key={`${l.x}-${l.y}`}
            cx={l.x}
            cy={l.y}
            r={l.r}
            className="fill-accent-soft/80 gw-twinkle"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      {/* Foreground framing: dark ridge with a central dip + corner trees */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
        <path
          d="M0,600 L0,436 Q140,452 300,500 Q430,540 560,560 Q700,576 840,548 Q1000,510 1120,458 Q1170,444 1200,450 L1200,600 Z"
          fill="#070613"
        />
        {/* Corner conifers (framing) */}
        <path d="M40,540 L70,452 L100,540 Z M95,548 L120,476 L150,548 Z" fill="#050410" />
        <path d="M1080,520 L1108,440 L1140,520 Z M1135,540 L1162,470 L1190,540 Z" fill="#050410" />
      </svg>

      {/* Room banners planted in the world */}
      {NODES.map((n) => {
        const room = ROOMS[n.i];
        const accent = ACCENTS[room.accent];
        return (
          <span
            key={room.id}
            style={{ left: `${n.x / 12}%`, top: `${n.y / 6}%` }}
            className={`absolute flex -translate-x-1/2 -translate-y-full flex-col items-center ${n.op}`}
          >
            <span
              className={`grid ${n.banner} place-items-center rounded-sm bg-surface/85 ring-1 backdrop-blur-sm ${accent.ring}`}
            >
              {room.icon}
            </span>
            <span className={`w-px ${n.pole} bg-border-strong/80`} />
            <span
              style={{ animationDelay: `${n.d}s` }}
              className={`gw-twinkle h-2 w-9 -translate-y-1 rounded-[100%] blur-md ${accent.halo}`}
            />
          </span>
        );
      })}

      {/* Readability overlays — keep the left text column dark and crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
