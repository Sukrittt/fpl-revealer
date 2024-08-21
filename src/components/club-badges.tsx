import Image from "next/image";

import { db } from "~/server/db";

export const ClubBadges = async () => {
  const clubs = await db.club.findMany({
    select: { logoUrl: true },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex h-16 items-center justify-center gap-x-4">
      {clubs.map((club) => (
        <Image
          key={club.logoUrl}
          src={club.logoUrl}
          alt="club badge"
          width={35}
          height={35}
        />
      ))}
    </div>
  );
};
