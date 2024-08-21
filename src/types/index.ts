import type { Club, FplPlayer, FplTeam, Player } from "@prisma/client";

export type ExtendedPlayer = { player: Player & { club: Club } };
export type ExtendedFplPlayer = FplPlayer & ExtendedPlayer;

export type ExtendedFplTeam = FplTeam & {
  fplPlayers: ExtendedFplPlayer[];
};
