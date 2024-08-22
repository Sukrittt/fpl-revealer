import Image from "next/image";
import { useAtom } from "jotai";
import { UserPlus, X } from "lucide-react";
import { type Position } from "@prisma/client";

import { FplPlayerInfo } from "./player-info";
import { RemovePlayerFromFpl } from "./remove-player";
import { getCategorizedFplPlayers } from "~/lib/utils";
import { maxPlayerPriceAtom, positionFilterAtom } from "~/atom";
import type { ExtendedFplPlayer, ExtendedFplTeam } from "~/types";

interface FplFieldProps {
  fplTeam: ExtendedFplTeam;
}

export const FplField: React.FC<FplFieldProps> = ({ fplTeam }) => {
  const players = getCategorizedFplPlayers(fplTeam.fplPlayers);

  return (
    <div className="relative h-[750px] w-full">
      <Image src="/images/pitch.svg" alt="pitch" fill />

      <div className="absolute flex h-[750px] w-full flex-col items-center justify-between">
        {/* Goalkeepers*/}
        <div className="flex items-center justify-center gap-x-32">
          {2 - players.GOALKEEPER.length > 0 &&
            Array.from({ length: 2 - players.GOALKEEPER.length }).map(
              (_, index) => (
                <EmptyPlayerCard key={index} position="GOALKEEPER" />
              ),
            )}

          {players.GOALKEEPER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>

        {/* Defenders */}
        <div className="flex items-center justify-center gap-x-16">
          {5 - players.DEFENDER.length > 0 &&
            Array.from({ length: 5 - players.DEFENDER.length }).map(
              (_, index) => <EmptyPlayerCard key={index} position="DEFENDER" />,
            )}

          {players.DEFENDER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>

        {/* Midfielders */}
        <div className="flex items-center justify-center gap-x-16">
          {5 - players.MIDFIELDER.length > 0 &&
            Array.from({ length: 5 - players.MIDFIELDER.length }).map(
              (_, index) => (
                <EmptyPlayerCard key={index} position="MIDFIELDER" />
              ),
            )}

          {players.MIDFIELDER.map((player) => (
            <PlayerCard key={player.id} fplPlayer={player} />
          ))}
        </div>

        {/* Forwards */}
        <div className="flex items-center justify-center gap-x-[200px]">
          {3 - players.FORWARD.length > 0 &&
            Array.from({ length: 3 - players.FORWARD.length }).map(
              (_, index) => <EmptyPlayerCard key={index} position="FORWARD" />,
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
    <FplPlayerInfo fplPlayer={fplPlayer}>
      <div className="relative flex h-36 w-24 cursor-pointer flex-col overflow-hidden rounded-md border border-[#3ebf84] bg-[#0ea15e] ring-offset-background transition hover:ring-1 hover:ring-white hover:ring-offset-1 focus-visible:outline-none">
        <RemovePlayerFromFpl
          fplPlayerId={fplPlayer.id}
          fplTeamId={fplPlayer.fplTeamId}
          playerName={fplPlayer.player.name}
        >
          <div className="absolute left-1 top-1">
            <div className="flex cursor-pointer items-center justify-center rounded-full bg-foreground p-0.5">
              <X className="m-auto h-3 w-3 text-white" />
            </div>
          </div>
        </RemovePlayerFromFpl>

        <p className="text-center text-sm text-white">
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
              quality={100}
            />
          </div>
        </div>

        <div className="bg-white px-4 py-1">
          <p className="text-center text-sm">
            {fplPlayer.player.displayName?.split(" ")[0] ??
              fplPlayer.player.name.split(" ")[0]}
          </p>
        </div>

        <div className="flex items-center justify-center gap-x-2 bg-white/80 px-4 py-1">
          <p className="text-center text-[10px]">
            {fplPlayer.status === "STARTER" ? "Starter" : "Bench"}
          </p>
          {fplPlayer.isCaptain || fplPlayer.isViceCaptain ? (
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] text-white">
              <span className="h-fit">{fplPlayer.isCaptain ? "C" : "V"}</span>
            </div>
          ) : null}
        </div>
      </div>
    </FplPlayerInfo>
  );
};

interface EmptyPlayerCardProps {
  position: Position;
}

const EmptyPlayerCard = ({ position }: EmptyPlayerCardProps) => {
  const [, setPosition] = useAtom(positionFilterAtom);
  const [, setMaxPrice] = useAtom(maxPlayerPriceAtom);

  const handleCardClick = () => {
    setPosition(position);

    if (position === "GOALKEEPER") {
      setMaxPrice(5.5);
    } else if (position === "MIDFIELDER") {
      setMaxPrice(12.5);
    } else if (position === "DEFENDER") {
      setMaxPrice(7);
    } else {
      setMaxPrice(15);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex h-36 w-24 cursor-pointer flex-col overflow-hidden rounded-md border border-[#3ebf84] bg-[#0ea15e] ring-offset-background transition hover:ring-1 hover:ring-white hover:ring-offset-1 focus-visible:outline-none"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-1 px-4 text-white">
        <UserPlus className="h-4 w-4" />
        <p className="text-sm">
          {position.charAt(0) + position.slice(1).toLowerCase()}
        </p>
      </div>
    </div>
  );
};
