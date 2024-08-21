import Image from "next/image";
import { UserPlus } from "lucide-react";
import { type Position } from "@prisma/client";

import { cn, getCategorizedFplPlayers } from "~/lib/utils";
import type { ExtendedFplTeam, ExtendedPlayer } from "~/types";

interface FplFieldProps {
  fplTeam: ExtendedFplTeam;
}

export const FplField: React.FC<FplFieldProps> = ({ fplTeam }) => {
  const players = getCategorizedFplPlayers(fplTeam.fplPlayers);

  return (
    <div className="relative h-[750px] w-full">
      <Image src="/images/pitch.svg" alt="pitch" fill />

      {/* Goalkeepers*/}
      <div className="absolute left-[275px] top-16">
        <div className="flex items-center justify-center gap-x-32">
          {2 - players.GOALKEEPER.length > 0 &&
            Array.from({ length: 2 - players.GOALKEEPER.length }).map(
              (_, index) => (
                <EmptyPlayerCard
                  key={index}
                  index={index}
                  position="GOALKEEPER"
                />
              ),
            )}

          {players.GOALKEEPER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>
      </div>

      {/* Defenders */}
      <div className="absolute left-20 top-60">
        <div className="flex items-center justify-center gap-x-16">
          {5 - players.DEFENDER.length > 0 &&
            Array.from({ length: 5 - players.DEFENDER.length }).map(
              (_, index) => (
                <EmptyPlayerCard
                  key={index}
                  index={index}
                  position="DEFENDER"
                />
              ),
            )}

          {players.DEFENDER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>
      </div>

      {/* Midfielders */}
      <div className="absolute left-20 top-[416px]">
        <div className="flex items-center justify-center gap-x-16">
          {5 - players.MIDFIELDER.length > 0 &&
            Array.from({ length: 5 - players.MIDFIELDER.length }).map(
              (_, index) => (
                <EmptyPlayerCard
                  key={index}
                  index={index}
                  position="MIDFIELDER"
                />
              ),
            )}

          {players.MIDFIELDER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>
      </div>

      {/* Forwards */}
      <div className="absolute left-28 top-[600px]">
        <div className="flex items-center justify-center gap-x-[200px]">
          {3 - players.FORWARD.length > 0 &&
            Array.from({ length: 3 - players.FORWARD.length }).map(
              (_, index) => (
                <EmptyPlayerCard key={index} index={index} position="FORWARD" />
              ),
            )}

          {players.FORWARD.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlayerCard = ({ fplPlayer }: { fplPlayer: ExtendedPlayer }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-[#0ea15e] ring ring-transparent ring-offset-2 hover:ring-white">
      <Image
        src={fplPlayer.player.club.jerseyUrl}
        alt={`${fplPlayer.player.name} jersey`}
        width={80}
        height={80}
      />

      <div className="bg-white px-4 py-2">
        <p className="text-center text-sm">{fplPlayer.player.name}</p>
      </div>
    </div>
  );
};

interface EmptyPlayerCardProps {
  index: number;
  position: Position;
}

const EmptyPlayerCard = ({ index, position }: EmptyPlayerCardProps) => {
  return (
    <div className="ring-offset-background flex cursor-pointer flex-col overflow-hidden rounded-md bg-[#0ea15e] transition hover:ring-1 hover:ring-white hover:ring-offset-1 focus-visible:outline-none">
      <div className="flex h-28 w-24 flex-col items-center justify-center gap-y-1 px-4 text-white">
        <UserPlus className="h-4 w-4" />
        <p className="text-sm">
          {position.charAt(0) + position.slice(1).toLowerCase()}
        </p>
      </div>
    </div>
  );
};
