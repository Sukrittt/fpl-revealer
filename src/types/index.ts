import type { Club, FplPlayer, FplTeam, Player, User } from "@prisma/client";

export type ExtendedPlayer = { player: Player & { club: Club } };
export type ExtendedFplPlayer = FplPlayer & ExtendedPlayer;

export type ExtendedFplTeam = FplTeam & {
  fplPlayers: ExtendedFplPlayer[];
};

export type ExtendedFplTeamForReveal = FplTeam & {
  user: User;
  fplPlayers: ExtendedFplPlayer[];
};
