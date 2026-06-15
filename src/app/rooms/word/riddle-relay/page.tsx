import type { Metadata } from "next";
import { getPlayableById } from "@/lib/playableGames";
import { GameShell } from "@/components/games/GameShell";
import { RiddleRelayGame } from "@/components/games/RiddleRelayGame";

const game = getPlayableById("riddle-relay")!;

export const metadata: Metadata = {
  title: game.name,
  description: game.tagline,
};

export default function RiddleRelayPage() {
  return (
    <GameShell game={game}>
      <RiddleRelayGame />
    </GameShell>
  );
}
