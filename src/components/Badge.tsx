import type { ReactNode } from "react";

type Tone =
  | "neutral"
  | "nebula"
  | "accent"
  | "teal"
  | "rose"
  | "sky"
  | "live";

const TONE: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted ring-1 ring-border",
  nebula: "bg-nebula/10 text-nebula ring-1 ring-nebula/30",
  accent: "bg-accent/10 text-accent-soft ring-1 ring-accent/30",
  teal: "bg-teal/10 text-teal ring-1 ring-teal/30",
  rose: "bg-rose/10 text-rose ring-1 ring-rose/30",
  sky: "bg-sky/10 text-sky ring-1 ring-sky/30",
  live: "bg-teal/15 text-teal ring-1 ring-teal/40",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  /** Show a leading status dot (with a gentle pulse for `live`). */
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      {dot ? (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full bg-current ${
            tone === "live" ? "gw-twinkle" : ""
          }`}
        />
      ) : null}
      {children}
    </span>
  );
}
