import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { db } from "~/server/db";
import { AddPlayer } from "./add-player";
import { getServerAuthSession } from "~/server/auth";
import { getCategorizedPlayers } from "~/lib/utils";
import { EditClub } from "./edit-club";

export const ClubServer = async ({ clubId }: { clubId: string }) => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  const club = await db.club.findFirst({
    where: { id: clubId },
    include: { players: true },
  });

  if (!club) notFound();

  const players = getCategorizedPlayers(club.players);

  return (
    <div className="flex flex-col gap-y-10 px-20 py-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Image
            src={club.logoUrl}
            alt={`${club.name} logo`}
            width={50}
            height={50}
          />
          <h3 className="text-xl font-bold">{club.name}</h3>
        </div>

        <div className="flex items-center gap-x-2">
          <EditClub club={club} />
          <AddPlayer clubId={clubId} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {Object.entries(players).map(([position, players]) => (
          <div key={position} className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">
                {position.charAt(0) + position.slice(1).toLowerCase()}
              </h4>
              <span>£</span>
            </div>

            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-x-2">
                  <Image
                    src={
                      position === "GOALKEEPER"
                        ? (club.goalkeeperJerseyUrl ?? club.jerseyUrl)
                        : club.jerseyUrl
                    }
                    alt={`${player.name} jersey`}
                    width={30}
                    height={30}
                  />
                  <p>{player.name}</p>
                </div>

                <span className="font-light">{player.price.toFixed(1)}m</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
