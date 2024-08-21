"use client";

import { cn } from "~/lib/utils";
import { FplField } from "./fpl-field";
import type { ExtendedFplTeam } from "~/types";

interface FplTeamSelectionProps {
  fplTeam: ExtendedFplTeam;
}

export const FplTeamSelection: React.FC<FplTeamSelectionProps> = ({
  fplTeam,
}) => {
  const budgetLeft =
    100 -
    fplTeam.fplPlayers.reduce((acc, player) => {
      return acc + player.player.price;
    }, 0);

  return (
    <div className="grid grid-cols-8 gap-x-4 px-40 pb-40">
      <div className="col-span-6 flex flex-col gap-y-4 rounded-md p-2">
        <div className="flex flex-col gap-y-1">
          <h4 className="text-lg font-bold">Transfers</h4>
          <p className="text-sm">
            Select a maximum of 3 players from a single team.
          </p>
        </div>

        <div className="flex items-center justify-evenly rounded-md bg-[#bccfff] px-2 py-4">
          <div className="flex flex-col items-center gap-y-2">
            <p className="text-sm">Players Selected</p>
            <div
              className={cn("rounded-lg bg-[#07db77] px-6 py-1", {
                "bg-[#ff1751] text-white": fplTeam.fplPlayers.length < 15,
              })}
            >
              <p className="font-semibold">{fplTeam.fplPlayers.length} / 15</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <p className="text-sm">Budget</p>
            <div
              className={cn("rounded-lg bg-[#07db77] px-6 py-1", {
                "bg-[#ff1751] text-white": budgetLeft < 0,
              })}
            >
              <p className="font-semibold">{budgetLeft.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <FplField fplTeam={fplTeam} />
      </div>
      <div className="col-span-2">
        <p>Player Selection</p>
      </div>
    </div>
  );
};
