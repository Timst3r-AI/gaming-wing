import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { PLAYERS } from "@/data/players";
import { RoomCard } from "@/components/RoomCard";
import { PlayerCardView } from "@/components/PlayerCardView";
import { GovernanceLaws } from "@/components/GovernanceLaws";
import { PlayhouseDemo } from "@/components/PlayhouseDemo";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6">
      {/* Hero */}
      <section className="relative pt-16 pb-14 sm:pt-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal" />
            Public-safe scaffold · frontend only
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
            A governed{" "}
            <span className="bg-gradient-to-r from-accent via-accent-soft to-violet bg-clip-text text-transparent">
              AI playhouse
            </span>
            .
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Gaming Wing is a room-based wing where the User plays alongside AI 1
            and AI 2 — guided by a Game Master, a World Agent, and Room Agents.
            Worldbuilding, story quests, word games, simulation, and arcade play,
            all under a clear set of laws: play is play, never memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rooms"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-soft"
            >
              Explore the rooms
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface/60"
            >
              Read the governance
            </Link>
          </div>
        </div>
      </section>

      {/* Governance strip */}
      <section
        id="governance"
        className="rounded-3xl border border-border bg-surface/40 p-8 gw-glow"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="lg:w-72 lg:shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The laws of the wing
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              A house with rules you can read.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Every room inherits the same governance. These laws keep play warm
              and safe — and keep this wing public.
            </p>
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
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Five rooms, one wing
            </h2>
            <p className="mt-2 text-muted">
              Each room is hosted by an agent and stocked with mock games.
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
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Meet the players
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          AI 1 and AI 2 are the wing&apos;s resident companions. The User is you —
          and the wing arranges itself around your choices.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYERS.map((player) => (
            <PlayerCardView key={player.id} player={player} />
          ))}
        </div>
      </section>

      {/* Interactive demo */}
      <section className="pt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Try a turn
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          A tiny, self-contained taste of the game loop. Take a few turns, then
          save them to a local slot — nothing leaves your browser.
        </p>
        <div className="mt-8">
          <PlayhouseDemo />
        </div>
      </section>

      {/* Boundary note */}
      <section className="pt-20 pb-4">
        <div className="rounded-3xl border border-border bg-surface/40 p-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What this scaffold is — and isn&apos;t
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-teal">It is</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                <li>A frontend-only, Vercel-ready Next.js scaffold.</li>
                <li>Mock data, local state, and demo-only browser saves.</li>
                <li>A governed, room-based playhouse you can extend.</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-rose">It is not</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                <li>A database, account system, or live AI integration.</li>
                <li>A store of memory, truth, or anyone&apos;s identity.</li>
                <li>A home for any private material.</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-faint">
            Read more in the{" "}
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
