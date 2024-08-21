import { redirect } from "next/navigation";

import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

export const ClubServer = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  return <div>club server</div>;
};
