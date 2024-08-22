import { notFound, redirect } from "next/navigation";

import { db } from "~/server/db";
import { FplNavigation } from "./fpl-navigation";
import { getServerAuthSession } from "~/server/auth";
import { FplTeamSelection } from "./fpl-team-selection";

export const FplTeamServer = async ({ teamId }: { teamId: string }) => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const fplTeam = await db.fplTeam.findFirst({
    where: {
      id: teamId,
      userId: session.user.id,
    },
    include: {
      fplPlayers: {
        include: {
          player: {
            include: {
              club: true,
            },
          },
        },
      },
    },
  });

  if (!fplTeam) notFound();

  return (
    <div className="flex flex-col gap-y-10">
      <div className="relative flex h-48 items-center bg-gradient-to-r from-[#22cbff] via-[#5a87ff] to-[#8e45ff] px-40 py-20">
        <p className="text-6xl font-extrabold">{fplTeam.name}</p>

        <FplNavigation teamId={fplTeam.id} />
      </div>

      <FplTeamSelection fplTeam={fplTeam} />
    </div>
  );
};
