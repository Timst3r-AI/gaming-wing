import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <p className="text-sm font-semibold text-foreground">Gaming Wing</p>
          <p className="mt-1 text-sm text-muted">
            A public-safe, frontend-only scaffold for a governed AI playhouse.
            Play is play — never memory, truth, or identity.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
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
