import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { db } from "~/server/db";
import { AddPlayer } from "./add-player";
import { getServerAuthSession } from "~/server/auth";

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

        <AddPlayer clubId={clubId} />
      </div>

      <div className="flex flex-col gap-y-2">
        {club.players.map((player) => (
          <div key={player.id} className="flex items-center gap-x-2">
            <Image
              src={club.jerseyUrl}
              alt={`${player.name} jersey`}
              width={30}
              height={30}
            />
            <p>{player.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
