import { notFound, redirect } from "next/navigation";

import { db } from "~/server/db";
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

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!fplTeam) notFound();

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex h-48 items-center bg-gradient-to-r from-[#22cbff] via-[#5a87ff] to-[#8e45ff] px-40 py-20">
        <p className="text-6xl font-extrabold">{fplTeam.name}</p>
      </div>

      <FplTeamSelection fplTeam={fplTeam} />
    </div>
  );
};
