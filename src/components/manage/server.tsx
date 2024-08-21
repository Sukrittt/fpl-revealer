import Link from "next/link";
import Image from "next/image";
import { MoveRight } from "lucide-react";
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

      <div className="flex items-center justify-end px-20">
        <CreateClub />
      </div>

      <div className="grid grid-cols-5 items-center gap-x-4 px-20 py-10">
        {clubs.map((club) => (
          <Link
            href={`/manage/${club.id}`}
            key={club.id}
            className="flex flex-col gap-y-4 rounded-lg border p-2 hover:bg-neutral-100"
          >
            <Image
              src={club.logoUrl}
              alt={`${club.name} logo`}
              width={80}
              height={80}
            />

            <div className="flex items-center justify-between pr-4">
              <p className="text-lg font-bold text-[#37003c]">{club.name}</p>
              <MoveRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
