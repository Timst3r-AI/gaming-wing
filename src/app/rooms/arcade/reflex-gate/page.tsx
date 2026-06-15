import type { Metadata } from "next";
import { getPlayableById } from "@/lib/playableGames";
import { GameShell } from "@/components/games/GameShell";
import { ReflexGateGame } from "@/components/games/ReflexGateGame";

const game = getPlayableById("reflex-gate")!;

export const metadata: Metadata = {
  title: game.name,
  description: game.tagline,
};

export default function ReflexGatePage() {
  return (
    <GameShell game={game}>
      <ReflexGateGame />
    </GameShell>
  );
}
