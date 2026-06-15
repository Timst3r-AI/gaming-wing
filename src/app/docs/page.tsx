import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { GovernanceLaws } from "@/components/GovernanceLaws";

export const metadata: Metadata = {
  title: "Docs & governance",
  description:
    "The governance laws of The AI Gaming Arena and the documents that define its boundaries, game loop, data model, and adoption path.",
};

const DOCUMENTS: {
  title: string;
  path: string;
  summary: string;
  icon: string;
}[] = [
  {
    title: "The AI Gaming Arena Constitution",
    path: "docs/constitution/gaming-wing-constitution.md",
    summary:
      "The full statement of the arena's purpose and its governance laws, in plain language.",
    icon: "📜",
  },
  {
    title: "Boundary Map",
    path: "docs/architecture/boundary-map.md",
    summary:
      "What lives inside this public arena and what is deliberately kept out — the public-safe line.",
    icon: "🗺️",
  },
  {
    title: "Game Loop v0",
    path: "docs/architecture/game-loop-v0.md",
    summary:
      "How a turn flows today (mock data + local state) and where a real engine would attach later.",
    icon: "🔄",
  },
  {
    title: "Data Model v0",
    path: "docs/architecture/data-model-v0.md",
    summary:
      "The TypeScript domain types — rooms, games, players, sessions, events, world entities, review items.",
    icon: "🧩",
  },
  {
    title: "Adoption Adapter",
    path: "docs/architecture/adoption-adapter.md",
    summary:
      "The export-only, review-only seam by which a host AI House could ever adopt content from this arena.",
    icon: "🚪",
  },
  {
    title: "ADR-0001 · Public-Safe Standalone Arena",
    path: "docs/decisions/ADR-0001-public-safe-standalone-wing.md",
    summary:
      "The decision to build this as a standalone, frontend-only, public-safe arena in this pass.",
    icon: "📝",
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Reference"
        title="Docs & governance"
        icon="📚"
        lead="The laws below govern every room. The documents that follow define the arena's boundaries, its game loop, its data model, and the narrow path by which content could ever be adopted elsewhere."
      />

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span aria-hidden>⚖️</span> The seven laws
        </h2>
        <div className="mt-5">
          <GovernanceLaws variant="grid" />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-foreground">Documents</h2>
        <p className="mt-2 text-sm text-muted">
          These live as Markdown in the repository. Paths are shown relative to
          the project root.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {DOCUMENTS.map((doc) => (
            <li
              key={doc.path}
              className="group flex gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong"
            >
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                {doc.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {doc.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  {doc.summary}
                </p>
                <code className="mt-3 inline-block max-w-full truncate rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-faint ring-1 ring-border">
                  {doc.path}
                </code>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
