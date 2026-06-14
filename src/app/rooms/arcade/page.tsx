import type { Metadata } from "next";
import { getRoom } from "@/lib/rooms";
import { RoomDetail } from "@/components/RoomDetail";

export const metadata: Metadata = {
  title: getRoom("arcade").name,
  description: getRoom("arcade").description,
};

export default function ArcadeRoomPage() {
  return <RoomDetail roomId="arcade" />;
}
