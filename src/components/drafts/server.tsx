import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { db } from "~/server/db";
import { CreateDraft } from "./create-draft";
import { getServerAuthSession } from "~/server/auth";

export const DraftsServer = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const drafts = await db.fplTeam.findMany({
    where: { userId: session.user.id },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeDraft = drafts.find((draft) => draft.status === "ACTIVE");

  const formattedDrafts = [
    ...drafts.filter((draft) => draft.status !== "ACTIVE"),
  ];

  if (activeDraft) formattedDrafts.unshift(activeDraft);

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex h-48 items-center bg-gradient-to-r from-[#22cbff] via-[#5a87ff] to-[#8e45ff] px-40 py-20 text-white">
        <p className="text-6xl font-extrabold">Teams</p>
      </div>

      <div className="flex items-center justify-end px-20">
        <CreateDraft />
      </div>

      <div className="grid grid-cols-4 gap-4 px-20">
        {formattedDrafts.length === 0 || !activeDraft ? (
          <p>No active team</p>
        ) : (
          formattedDrafts.map((draft) => (
            <Link
              href={`/teams/${draft.id}`}
              key={draft.id}
              className="group flex items-center justify-between border px-4 py-2"
            >
              <p>{draft.name}</p>
              <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
