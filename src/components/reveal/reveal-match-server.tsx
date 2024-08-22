import { notFound, redirect } from "next/navigation";

import { db } from "~/server/db";
import { RevealClient } from "./reveal-client";
import { getServerAuthSession } from "~/server/auth";

export const RevealMatchServer = async ({ revealId }: { revealId: string }) => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const reveal = await db.revealMatch.findFirst({
    where: {
      id: revealId,
    },
    include: {
      homeTeam: {
        include: {
          user: true,

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
      },
      awayTeam: {
        include: {
          user: true,

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
      },
    },
  });

  if (!reveal) notFound();

  return <RevealClient reveal={reveal} />;
};
