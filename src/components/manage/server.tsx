import { redirect } from "next/navigation";

import { db } from "~/server/db";
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

  return <p>Manage Teams</p>;
};
