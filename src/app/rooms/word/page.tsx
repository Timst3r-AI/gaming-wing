import type { Metadata } from "next";
import { getRoom } from "@/lib/rooms";
import { RoomDetail } from "@/components/RoomDetail";

export const metadata: Metadata = {
  title: getRoom("word").name,
  description: getRoom("word").description,
};

export default function WordRoomPage() {
  return <RoomDetail roomId="word" />;
}
