/**
 * Accent → literal Tailwind class bundles.
 *
 * Tailwind's JIT only generates classes it can find as complete string
 * literals in source, so we never build class names dynamically (e.g.
 * `text-${accent}`). Instead each accent maps to a fixed bundle of full class
 * strings. The color tokens (violet/accent/teal/rose) come from the `@theme`
 * block in globals.css.
 */
export type Accent = "violet" | "accent" | "teal" | "rose";

export interface AccentClasses {
  /** Foreground text in the accent color. */
  text: string;
  /** A soft tinted chip/badge. */
  chip: string;
  /** A left/top edge bar. */
  bar: string;
  /** A small dot marker. */
  dot: string;
  /** Hover border + glow for interactive cards. */
  cardHover: string;
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  violet: {
    text: "text-violet",
    chip: "bg-violet/10 text-violet ring-1 ring-violet/30",
    bar: "bg-violet",
    dot: "bg-violet",
    cardHover: "hover:border-violet/60 hover:shadow-violet/20",
  },
  accent: {
    text: "text-accent",
    chip: "bg-accent/10 text-accent-soft ring-1 ring-accent/30",
    bar: "bg-accent",
    dot: "bg-accent",
    cardHover: "hover:border-accent/60 hover:shadow-accent/20",
  },
  teal: {
    text: "text-teal",
    chip: "bg-teal/10 text-teal ring-1 ring-teal/30",
    bar: "bg-teal",
    dot: "bg-teal",
    cardHover: "hover:border-teal/60 hover:shadow-teal/20",
  },
  rose: {
    text: "text-rose",
    chip: "bg-rose/10 text-rose ring-1 ring-rose/30",
    bar: "bg-rose",
    dot: "bg-rose",
    cardHover: "hover:border-rose/60 hover:shadow-rose/20",
  },
};
