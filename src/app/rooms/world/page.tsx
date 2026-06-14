import type { Metadata } from "next";
import { getRoom } from "@/lib/rooms";
import { RoomDetail } from "@/components/RoomDetail";

export const metadata: Metadata = {
  title: getRoom("world").name,
  description: getRoom("world").description,
};

export default function WorldRoomPage() {
  return <RoomDetail roomId="world" />;
}
