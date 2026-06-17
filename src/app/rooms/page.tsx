import type { Metadata } from "next";
import { ROOMS } from "@/lib/rooms";
import { PageHeader } from "@/components/PageHeader";
import { RoomCard } from "@/components/RoomCard";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Five rooms of The AI Gaming Arena: worldbuilding, story quests, word games, simulation, and arcade play.",
};

export default function RoomsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="The arena"
        title="Rooms"
        icon="🚪"
        lead="Five rooms, each with a first playable game and a small board of future game concepts. Pick a door and step in — every room runs under the same governance."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </main>
  );
}
