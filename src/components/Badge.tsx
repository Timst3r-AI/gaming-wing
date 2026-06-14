import type { ReactNode } from "react";

type Tone = "neutral" | "violet" | "accent" | "teal" | "rose" | "live";

const TONE: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted ring-1 ring-border",
  violet: "bg-violet/10 text-violet ring-1 ring-violet/30",
  accent: "bg-accent/10 text-accent-soft ring-1 ring-accent/30",
  teal: "bg-teal/10 text-teal ring-1 ring-teal/30",
  rose: "bg-rose/10 text-rose ring-1 ring-rose/30",
  live: "bg-teal/15 text-teal ring-1 ring-teal/40",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
