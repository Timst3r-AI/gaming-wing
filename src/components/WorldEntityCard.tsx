import type { WorldEntity, WorldEntityKind } from "@/lib/types";

const KIND_ICON: Record<WorldEntityKind, string> = {
  place: "📍",
  faction: "⚑",
  artifact: "🏺",
  creature: "🐲",
  npc: "🧑‍🌾",
};

export function WorldEntityCard({ entity }: { entity: WorldEntity }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-xl">
          {KIND_ICON[entity.kind]}
        </span>
        <h3 className="text-base font-semibold text-foreground">{entity.name}</h3>
        <span className="ml-auto text-[11px] uppercase tracking-wide text-faint">
          {entity.kind}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{entity.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {entity.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-border"
          >
            #{tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-faint">
        Stewarded by <span className="text-muted">{entity.stewardAgent}</span>
      </p>
    </article>
  );
}
