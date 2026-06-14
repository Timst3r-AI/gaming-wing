"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/review", label: "Review" },
  { href: "/docs", label: "Docs" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      {/* Thin neon seam under the bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nebula/50 to-transparent"
      />
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="relative grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-lg ring-1 ring-accent/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
          >
            <span className="absolute inset-0 rounded-xl bg-accent/20 blur-md transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
            <span className="relative">🎲</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Gaming Wing
            </span>
            <span className="text-[11px] text-faint">
              a governed AI playhouse
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-surface-2 ring-1 ring-border-strong"
                  />
                ) : null}
                <span className="relative inline-flex items-center gap-1.5">
                  {active ? (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-accent gw-twinkle"
                    />
                  ) : null}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
