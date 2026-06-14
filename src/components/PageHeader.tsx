import type { ReactNode } from "react";

/**
 * Shared header for inner routes: a chip eyebrow, a title, and a lead
 * paragraph, with room for an optional glyph and an action (e.g. a back link).
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  action,
  icon,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <header className="relative flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      {/* Neon underline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent/60 via-border to-transparent"
      />
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 flex items-center gap-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {icon ? (
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-2xl ring-1 ring-border"
            >
              {icon}
            </span>
          ) : null}
          <span>{title}</span>
        </h1>
        {lead ? (
          <p className="mt-3 text-base leading-7 text-muted">{lead}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
