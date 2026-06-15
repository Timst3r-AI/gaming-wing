import type { Metadata } from "next";
import { getPlayableById } from "@/lib/playableGames";
import { GameShell } from "@/components/games/GameShell";
import { CartographersTableGame } from "@/components/games/CartographersTableGame";

const game = getPlayableById("cartographers-table")!;

export const metadata: Metadata = {
  title: game.name,
  description: game.tagline,
};

export default function CartographersTablePage() {
  return (
    <GameShell game={game}>
      <CartographersTableGame />
    </GameShell>
  );
}
