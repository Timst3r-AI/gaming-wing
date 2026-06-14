import type { ReviewItem, ReviewStatus } from "@/lib/types";
import { Badge } from "@/components/Badge";

const STATUS: Record<
  ReviewStatus,
  { label: string; tone: "live" | "accent" | "rose" }
> = {
  approved: { label: "Approved", tone: "live" },
  pending: { label: "Pending review", tone: "accent" },
  "needs-changes": { label: "Needs changes", tone: "rose" },
};

export function ReviewItemCard({ item }: { item: ReviewItem }) {
  const status = STATUS[item.status];

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-faint">{item.origin}</p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {item.title}
          </h3>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{item.note}</p>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
          Governance checks
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {item.governanceFlags.map((flag) => (
            <li
              key={flag}
              className="flex items-start gap-2 text-sm text-muted"
            >
              <span aria-hidden className="mt-0.5 text-teal">
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
