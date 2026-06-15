import type { Metadata } from "next";
import { getPlayableById } from "@/lib/playableGames";
import { GameShell } from "@/components/games/GameShell";
import { SeedlingCommonsGame } from "@/components/games/SeedlingCommonsGame";

const game = getPlayableById("seedling-commons")!;

export const metadata: Metadata = {
  title: game.name,
  description: game.tagline,
};

export default function SeedlingCommonsPage() {
  return (
    <GameShell game={game}>
      <SeedlingCommonsGame />
    </GameShell>
  );
}
