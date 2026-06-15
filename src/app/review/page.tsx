import type { Metadata } from "next";
import Link from "next/link";
import { REVIEW_ITEMS } from "@/data/review";
import type { ReviewStatus } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { ReviewItemCard } from "@/components/ReviewItemCard";

export const metadata: Metadata = {
  title: "Review",
  description:
    "The review room: where play is examined before any export to a host AI House. Adoption is export-only and review-only.",
};

function countByStatus(status: ReviewStatus): number {
  return REVIEW_ITEMS.filter((item) => item.status === status).length;
}

const SUMMARY: {
  label: string;
  status: ReviewStatus;
  text: string;
  ring: string;
  icon: string;
}[] = [
  {
    label: "Approved",
    status: "approved",
    text: "text-teal",
    ring: "ring-teal/30",
    icon: "✓",
  },
  {
    label: "Pending",
    status: "pending",
    text: "text-accent",
    ring: "ring-accent/30",
    icon: "⏳",
  },
  {
    label: "Needs changes",
    status: "needs-changes",
    text: "text-rose",
    ring: "ring-rose/30",
    icon: "✎",
  },
];

export default function ReviewPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Governance"
        title="Review room"
        icon="🛡️"
        lead="Nothing leaves the wing on its own. Before any play could be adopted by a host AI House, a human reviews it here — export-only and review-only. This queue is a mock of that gate."
      />

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SUMMARY.map((entry) => (
          <div
            key={entry.status}
            className={`flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 ring-1 ${entry.ring}`}
          >
            <span
              aria-hidden
              className={`grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-lg ${entry.text} ring-1 ${entry.ring}`}
            >
              {entry.icon}
            </span>
            <div>
              <p className={`text-3xl font-semibold ${entry.text}`}>
                {countByStatus(entry.status)}
              </p>
              <p className="text-sm text-muted">{entry.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Items */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">Review queue</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {REVIEW_ITEMS.map((item) => (
            <ReviewItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-12 flex items-start gap-4 rounded-2xl border border-border bg-surface/40 p-6">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-lg ring-1 ring-accent/30"
        >
          🚪
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            How adoption works
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Adoption into a host AI House is intentionally narrow: content is{" "}
            <span className="text-foreground">exported</span>, then{" "}
            <span className="text-foreground">reviewed by a human</span>, and
            only fiction-only, private-material-free items pass. The shape of
            that boundary lives in the docs — see the adoption adapter and
            boundary map in{" "}
            <Link href="/docs" className="text-accent hover:text-accent-soft">
              docs &amp; governance
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
