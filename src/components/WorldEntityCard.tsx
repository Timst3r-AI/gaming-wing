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
    <article className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/20 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-lg ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          {KIND_ICON[entity.kind]}
        </span>
        <h3 className="text-base font-semibold text-foreground">{entity.name}</h3>
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[10px] uppercase tracking-wide text-faint ring-1 ring-border">
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
      <p className="mt-4 border-t border-border pt-3 text-xs text-faint">
        Stewarded by <span className="text-muted">{entity.stewardAgent}</span>
      </p>
    </article>
  );
}
