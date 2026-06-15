import type { Metadata } from "next";
import { getPlayableById } from "@/lib/playableGames";
import { GameShell } from "@/components/games/GameShell";
import { LanternBridgeGame } from "@/components/games/LanternBridgeGame";

const game = getPlayableById("lantern-bridge")!;

export const metadata: Metadata = {
  title: game.name,
  description: game.tagline,
};

export default function LanternBridgePage() {
  return (
    <GameShell game={game}>
      <LanternBridgeGame />
    </GameShell>
  );
}
