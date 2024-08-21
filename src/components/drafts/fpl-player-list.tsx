import Image from "next/image";
import { api } from "~/trpc/react";
import { type ExtendedFplTeam } from "~/types";
import { AddPlayerToFpl } from "./add-player-fpl";

interface FplPlayerListProps {
  fplTeam: ExtendedFplTeam;
}

const positionShorthand = {
  GOALKEEPER: "GKP",
  DEFENDER: "DEF",
  MIDFIELDER: "MID",
  FORWARD: "FWD",
};

export const FplPlayerList: React.FC<FplPlayerListProps> = ({ fplTeam }) => {
  const { data: players, isLoading } = api.club.getPlayers.useQuery();

  return (
    <div className="flex flex-col gap-y-4">
      <h4 className="text-lg">Player Selection</h4>

      <div className="flex flex-col gap-y-2">
        <div className="text-muted-foreground flex items-center justify-end pr-4 text-xs font-bold">
          <span>£</span>
        </div>

        <div className="flex max-h-[750px] flex-col gap-y-4 overflow-y-auto pr-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : !players || players.length === 0 ? (
            <p>No players found</p>
          ) : (
            players.map((player) => (
              <AddPlayerToFpl
                key={player.id}
                player={player}
                fplTeamId={fplTeam.id}
              >
                <div className="flex cursor-pointer items-center justify-between border-b pb-1">
                  <div className="flex items-center gap-x-4">
                    <Image
                      src={player.club.jerseyUrl}
                      alt={`${player.name} jersey`}
                      width={25}
                      height={25}
                    />

                    <div className="flex flex-col gap-y-0.5">
                      <p className="text-[15px] font-semibold">{player.name}</p>

                      <div className="flex items-center gap-x-1 text-[13px] font-extralight">
                        <p>{player.club.name.substring(0, 3).toUpperCase()}</p>
                        <p>{positionShorthand[player.position]}</p>
                      </div>
                    </div>
                  </div>

                  <p className="border-l pl-4 text-[13px]">
                    {player.price.toFixed(1)}
                  </p>
                </div>
              </AddPlayerToFpl>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
