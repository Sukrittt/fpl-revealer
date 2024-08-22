import { twMerge } from "tailwind-merge";
import { type Player } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";

import type { ExtendedFplPlayer, ExtendedPlayer } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategorizedPlayers(players: Player[]) {
  const categorizedPlayers = {
    GOALKEEPER: [] as Player[],
    DEFENDER: [] as Player[],
    MIDFIELDER: [] as Player[],
    FORWARD: [] as Player[],
  };

  players.forEach((player) => {
    categorizedPlayers[player.position].push(player);
  });

  return categorizedPlayers;
}

export function getCategorizedFplPlayers(players: ExtendedFplPlayer[]) {
  const categorizedPlayers = {
    GOALKEEPER: [] as ExtendedFplPlayer[],
    DEFENDER: [] as ExtendedFplPlayer[],
    MIDFIELDER: [] as ExtendedFplPlayer[],
    FORWARD: [] as ExtendedFplPlayer[],
  };

  players.forEach((player) => {
    categorizedPlayers[player.player.position].push(player);
  });

  return categorizedPlayers;
}
export function getCategorizedPlayersWithClubs(
  players: ExtendedPlayer["player"][],
) {
  const categorizedPlayers = {
    GOALKEEPER: [] as ExtendedPlayer["player"][],
    DEFENDER: [] as ExtendedPlayer["player"][],
    MIDFIELDER: [] as ExtendedPlayer["player"][],
    FORWARD: [] as ExtendedPlayer["player"][],
  };

  players.forEach((player) => {
    categorizedPlayers[player.position].push(player);
  });

  return categorizedPlayers;
}
