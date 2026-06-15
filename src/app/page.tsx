import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { GAMES } from "@/lib/games";
import { GOVERNANCE_LAWS } from "@/lib/governance";
import { PLAYERS } from "@/data/players";
import { RoomCard } from "@/components/RoomCard";
import { PlayerCardView } from "@/components/PlayerCardView";
import { GovernanceLaws } from "@/components/GovernanceLaws";
import { GameConsoleDemo } from "@/components/GameConsoleDemo";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { RoomMarquee } from "@/components/RoomMarquee";

const STATS = [
  { value: ROOMS.length, label: "Rooms" },
  { value: GAMES.length, label: "Games" },
  { value: GOVERNANCE_LAWS.length, label: "Laws" },
];

export default function Home() {
  return (
    <main>
      {/* Hero — an atmospheric threshold into the arena */}
      <section className="relative isolate overflow-hidden">
        <HeroBackdrop />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid min-h-[32rem] items-center gap-10 pt-12 pb-12 sm:min-h-[34rem] sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted backdrop-blur-sm">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal gw-twinkle" />
                Public-safe AI gaming arena
              </span>
              <h1 className="mt-5 font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl">
                Enter the{" "}
                <span className="gw-gradient-text">AI Gaming Arena</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                Choose a room, take a turn, and play alongside AI Gamer 1 and AI
                Gamer 2 — guided by a Game Master, a World Agent, and Room
                Agents. Every game stays inside one clear boundary: play is play,
                never memory.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/rooms"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-soft hover:shadow-accent/30"
                >
                  Enter the arena
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/docs"
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface/60"
                >
                  Read the rules
                </Link>
              </div>

              {/* Stat chips */}
              <dl className="mt-10 flex flex-wrap gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-baseline gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2 backdrop-blur-sm"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </dd>
                    <span className="text-xs uppercase tracking-wide text-faint">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right column left open so the cinematic scene reads as the world. */}
            <div aria-hidden className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Room marquee — full bleed */}
      <RoomMarquee />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Governance strip */}
        <section
          id="governance"
          className="relative mt-16 overflow-hidden rounded-3xl border border-border bg-surface/40 p-6 gw-glow sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="lg:w-72 lg:shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                The rules of the arena
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                An arena with rules you can read.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Every room in the arena follows the same governance. These laws
                keep play warm and safe — and keep this arena public.
              </p>
              <Link
                href="/docs"
                className="mt-4 inline-flex text-sm font-medium text-accent hover:text-accent-soft"
              >
                All seven laws →
              </Link>
            </div>
            <div className="flex-1">
              <GovernanceLaws variant="list" />
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section className="pt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nebula">
                Pick a door
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
                Five rooms, one arena
              </h2>
              <p className="mt-2 text-muted">
                Each door opens on a distinct game space, hosted by an agent.
              </p>
            </div>
            <Link
              href="/rooms"
              className="hidden text-sm font-medium text-accent hover:text-accent-soft sm:block"
            >
              All rooms →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        {/* Players */}
        <section className="pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            The roster
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Meet the players
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            AI 1 and AI 2 are the arena&apos;s resident AI Gamers. The User is
            you — and the arena arranges itself around your choices.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PLAYERS.map((player) => (
              <PlayerCardView key={player.id} player={player} />
            ))}
          </div>
        </section>

        {/* Interactive demo */}
        <section className="pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
            Press start
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Pick up the console
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            A tiny, self-contained taste of the game loop. Take a few turns, then
            save them to a cartridge — nothing leaves your browser.
          </p>
          <div className="mt-8">
            <GameConsoleDemo />
          </div>
        </section>

        {/* Boundary note */}
        <section className="pt-20 pb-4">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-sky/10 blur-3xl"
            />
            <h2 className="relative font-display text-xl font-semibold tracking-tight text-foreground">
              What this scaffold is — and isn&apos;t
            </h2>
            <div className="relative mt-5 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-teal">
                  <span aria-hidden>✦</span> It is
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  <li>A frontend-only, Vercel-ready Next.js scaffold.</li>
                  <li>Mock data, local state, and demo-only browser saves.</li>
                  <li>A governed, room-based gaming arena you can extend.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-rose/20 bg-rose/5 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-rose">
                  <span aria-hidden>⊘</span> It is not
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  <li>A database, account system, or live AI integration.</li>
                  <li>A store of memory, truth, or anyone&apos;s identity.</li>
                  <li>A home for any private material.</li>
                </ul>
              </div>
            </div>
            <p className="relative mt-6 text-sm text-faint">
              Read more in the{" "}
              <Link href="/docs" className="text-accent hover:text-accent-soft">
                docs &amp; governance
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
