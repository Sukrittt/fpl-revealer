import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "~/server/db";
import { CreateClub } from "./create-club";
import { getServerAuthSession } from "~/server/auth";

export const ManageServer = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  const clubs = await db.club.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex h-48 items-center bg-gradient-to-r from-[#22cbff] via-[#5a87ff] to-[#8e45ff] px-40 py-20 text-white">
        <p className="text-6xl font-extrabold">Clubs</p>
      </div>

      <div className="flex items-center justify-end px-40">
        <CreateClub />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 px-40 py-20">
        {clubs.map((club) => (
          <div key={club.id} className="flex flex-col gap-y-2">
            <Image
              src={club.logoUrl}
              alt={`${club.name} logo`}
              width={100}
              height={100}
            />

            <p>{club.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
