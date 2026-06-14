/**
 * Accent → literal Tailwind class bundles.
 *
 * Tailwind's JIT only generates classes it can find as complete string
 * literals in source, so we never build class names dynamically (e.g.
 * `text-${accent}`). Instead each accent maps to a fixed bundle of full class
 * strings. The color tokens (nebula/accent/teal/rose/sky) come from the
 * `@theme` block in globals.css.
 */
export type Accent = "nebula" | "accent" | "teal" | "rose" | "sky";

export interface AccentClasses {
  /** Foreground text in the accent color. */
  text: string;
  /** A soft tinted chip/badge. */
  chip: string;
  /** A solid edge bar. */
  bar: string;
  /** A small dot marker. */
  dot: string;
  /** A tinted ring. */
  ring: string;
  /** A tinted border. */
  border: string;
  /** Hover border + glow for interactive cards. */
  glowHover: string;
  /** A diagonal wash used behind portal/door art. */
  gradient: string;
  /** Soft radial glow blob (as a background) for portal halos. */
  halo: string;
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  nebula: {
    text: "text-nebula",
    chip: "bg-nebula/10 text-nebula ring-1 ring-nebula/30",
    bar: "bg-nebula",
    dot: "bg-nebula",
    ring: "ring-nebula/40",
    border: "border-nebula/40",
    glowHover: "hover:border-nebula/70 hover:shadow-[0_24px_60px_-28px_rgba(183,148,255,0.65)]",
    gradient: "from-nebula/30 via-nebula/5 to-transparent",
    halo: "bg-nebula/25",
  },
  accent: {
    text: "text-accent",
    chip: "bg-accent/10 text-accent-soft ring-1 ring-accent/30",
    bar: "bg-accent",
    dot: "bg-accent",
    ring: "ring-accent/40",
    border: "border-accent/40",
    glowHover: "hover:border-accent/70 hover:shadow-[0_24px_60px_-28px_rgba(245,177,76,0.6)]",
    gradient: "from-accent/30 via-accent/5 to-transparent",
    halo: "bg-accent/25",
  },
  teal: {
    text: "text-teal",
    chip: "bg-teal/10 text-teal ring-1 ring-teal/30",
    bar: "bg-teal",
    dot: "bg-teal",
    ring: "ring-teal/40",
    border: "border-teal/40",
    glowHover: "hover:border-teal/70 hover:shadow-[0_24px_60px_-28px_rgba(94,234,212,0.55)]",
    gradient: "from-teal/30 via-teal/5 to-transparent",
    halo: "bg-teal/25",
  },
  rose: {
    text: "text-rose",
    chip: "bg-rose/10 text-rose ring-1 ring-rose/30",
    bar: "bg-rose",
    dot: "bg-rose",
    ring: "ring-rose/40",
    border: "border-rose/40",
    glowHover: "hover:border-rose/70 hover:shadow-[0_24px_60px_-28px_rgba(251,127,175,0.6)]",
    gradient: "from-rose/30 via-rose/5 to-transparent",
    halo: "bg-rose/25",
  },
  sky: {
    text: "text-sky",
    chip: "bg-sky/10 text-sky ring-1 ring-sky/30",
    bar: "bg-sky",
    dot: "bg-sky",
    ring: "ring-sky/40",
    border: "border-sky/40",
    glowHover: "hover:border-sky/70 hover:shadow-[0_24px_60px_-28px_rgba(91,184,255,0.6)]",
    gradient: "from-sky/30 via-sky/5 to-transparent",
    halo: "bg-sky/25",
  },
};
