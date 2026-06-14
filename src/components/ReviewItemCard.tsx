import type { ReviewItem, ReviewStatus } from "@/lib/types";
import { Badge } from "@/components/Badge";

const STATUS: Record<
  ReviewStatus,
  { label: string; tone: "live" | "accent" | "rose"; bar: string; dot: boolean }
> = {
  approved: { label: "Approved", tone: "live", bar: "bg-teal", dot: true },
  pending: { label: "Pending review", tone: "accent", bar: "bg-accent", dot: false },
  "needs-changes": {
    label: "Needs changes",
    tone: "rose",
    bar: "bg-rose",
    dot: false,
  },
};

export function ReviewItemCard({ item }: { item: ReviewItem }) {
  const status = STATUS[item.status];

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 pt-6 shadow-lg shadow-black/20 transition-colors hover:border-border-strong">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${status.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-faint">{item.origin}</p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {item.title}
          </h3>
        </div>
        <Badge tone={status.tone} dot={status.dot}>
          {status.label}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{item.note}</p>

      <div className="mt-4 rounded-xl border border-border bg-surface-2/40 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
          Governance checks
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {item.governanceFlags.map((flag) => (
            <li key={flag} className="flex items-start gap-2 text-sm text-muted">
              <span
                aria-hidden
                className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-teal/15 text-[10px] text-teal ring-1 ring-teal/30"
              >
                ✓
              </span>
              {flag}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-faint">
        Submitted by <span className="text-muted">{item.submittedBy}</span>
      </p>
    </article>
  );
}
