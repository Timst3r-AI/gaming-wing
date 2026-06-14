import type { Metadata } from "next";
import { getRoom } from "@/lib/rooms";
import { RoomDetail } from "@/components/RoomDetail";

export const metadata: Metadata = {
  title: getRoom("simulation").name,
  description: getRoom("simulation").description,
};

export default function SimulationRoomPage() {
  return <RoomDetail roomId="simulation" />;
}
