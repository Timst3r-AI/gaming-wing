import { GOVERNANCE_LAWS } from "@/lib/governance";

/**
 * Renders the arena's governance laws. `variant="grid"` is the full card grid;
 * `variant="list"` is a compact numbered list for sidebars and docs intros.
 * The law text itself comes verbatim from `GOVERNANCE_LAWS` and is never
 * altered here.
 */
export function GovernanceLaws({
  variant = "grid",
}: {
  variant?: "grid" | "list";
}) {
  if (variant === "list") {
    return (
      <ol className="grid gap-2.5 sm:grid-cols-2">
        {GOVERNANCE_LAWS.map((law, index) => (
          <li
            key={law.id}
            className="flex gap-3 rounded-xl border border-border/60 bg-surface/40 p-3 text-sm transition-colors hover:border-border-strong"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent/15 font-mono text-[11px] text-accent ring-1 ring-accent/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="font-medium text-foreground">{law.title}</span>{" "}
              <span className="text-muted">{law.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {GOVERNANCE_LAWS.map((law, index) => (
        <div
          key={law.id}
          className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 font-mono text-xs text-accent ring-1 ring-accent/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              {law.title}
            </h3>
          </div>
          <p className="relative mt-2 text-sm leading-6 text-muted">
            {law.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
