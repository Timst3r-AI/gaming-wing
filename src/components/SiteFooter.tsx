import Link from "next/link";
import { ROOMS } from "@/lib/rooms";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-sm ring-1 ring-accent/30"
            >
              🎲
            </span>
            <p className="text-sm font-semibold text-foreground">Gaming Wing</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            A public-safe, frontend-only scaffold for a governed AI playhouse.
            Play is play — never memory, truth, or identity.
          </p>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {ROOMS.map((room) => (
              <span
                key={room.id}
                title={room.name}
                className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-base ring-1 ring-border transition-transform hover:-translate-y-0.5"
              >
                {room.icon}
              </span>
            ))}
          </div>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-muted">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            The wing
          </span>
          <Link href="/rooms" className="hover:text-foreground">
            Rooms
          </Link>
          <Link href="/review" className="hover:text-foreground">
            Review
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            Docs &amp; governance
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-6 py-4 text-xs text-faint">
          Demo only · no accounts · no databases · saves live in your browser.
        </p>
      </div>
    </footer>
  );
}
