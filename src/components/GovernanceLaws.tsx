import { GOVERNANCE_LAWS } from "@/lib/governance";

/**
 * Renders the wing's governance laws. `variant="grid"` is the full card grid;
 * `variant="list"` is a compact numbered list for sidebars and docs intros.
 */
export function GovernanceLaws({
  variant = "grid",
}: {
  variant?: "grid" | "list";
}) {
  if (variant === "list") {
    return (
      <ol className="flex flex-col gap-2.5">
        {GOVERNANCE_LAWS.map((law, index) => (
          <li key={law.id} className="flex gap-3 text-sm">
            <span className="font-mono text-xs text-accent">
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
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 font-mono text-xs text-accent ring-1 ring-accent/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              {law.title}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{law.detail}</p>
        </div>
      ))}
    </div>
  );
}
