import type { Metadata } from "next";
import { getRoom } from "@/lib/rooms";
import { RoomDetail } from "@/components/RoomDetail";

export const metadata: Metadata = {
  title: getRoom("story").name,
  description: getRoom("story").description,
};

export default function StoryRoomPage() {
  return <RoomDetail roomId="story" />;
}
