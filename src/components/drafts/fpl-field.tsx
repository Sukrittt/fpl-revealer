import Image from "next/image";
import { UserPlus, X } from "lucide-react";
import { type Position } from "@prisma/client";

import { getCategorizedFplPlayers } from "~/lib/utils";
import { RemovePlayerFromFpl } from "./remove-player";
import type { ExtendedFplPlayer, ExtendedFplTeam } from "~/types";

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

const PlayerCard = ({ fplPlayer }: { fplPlayer: ExtendedFplPlayer }) => {
  return (
    <div className="ring-offset-background relative flex h-32 w-24 flex-col overflow-hidden rounded-md border border-[#3ebf84] bg-[#0ea15e] transition hover:ring-1 hover:ring-white hover:ring-offset-1 focus-visible:outline-none">
      <RemovePlayerFromFpl
        fplPlayerId={fplPlayer.id}
        fplTeamId={fplPlayer.fplTeamId}
        playerName={fplPlayer.player.name}
      >
        <div className="absolute left-1 top-1">
          <div className="bg-foreground flex cursor-pointer items-center justify-center rounded-full p-0.5">
            <X className="m-auto h-3 w-3 text-white" />
          </div>
        </div>
      </RemovePlayerFromFpl>

      <p className="text-center text-white">
        £{fplPlayer.player.price.toFixed(1)}m
      </p>

      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-full w-3/4 p-4">
          <Image
            src={
              fplPlayer.player.position === "GOALKEEPER"
                ? (fplPlayer.player.club.goalkeeperJerseyUrl ??
                  fplPlayer.player.club.jerseyUrl)
                : fplPlayer.player.club.jerseyUrl
            }
            alt={`${fplPlayer.player.name} jersey`}
            fill
          />
        </div>
      </div>

      <div className="bg-white px-4 py-1">
        {/* TODO: Replace with display name if available */}
        <p className="text-center text-sm">
          {fplPlayer.player.displayName ?? fplPlayer.player.name.split(" ")[0]}
        </p>
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
    <div className="ring-offset-background flex h-32 w-24 cursor-pointer flex-col overflow-hidden rounded-md border border-[#3ebf84] bg-[#0ea15e] transition hover:ring-1 hover:ring-white hover:ring-offset-1 focus-visible:outline-none">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-1 px-4 text-white">
        <UserPlus className="h-4 w-4" />
        <p className="text-sm">
          {position.charAt(0) + position.slice(1).toLowerCase()}
        </p>
      </div>
    </div>
  );
};
