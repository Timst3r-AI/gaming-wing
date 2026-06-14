import type { Metadata } from "next";
import { ROOMS } from "@/lib/rooms";
import { GAMES } from "@/lib/games";
import { PageHeader } from "@/components/PageHeader";
import { RoomCard } from "@/components/RoomCard";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Five rooms of the Gaming Wing: worldbuilding, story quests, word games, simulation, and arcade play.",
};

export default function RoomsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <PageHeader
        eyebrow="The wing"
        title="Rooms"
        icon="🚪"
        lead={`Five rooms, each hosted by an agent and stocked with ${GAMES.length} mock games. Pick a door and step in — every room runs under the same governance.`}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </main>
  );
}
