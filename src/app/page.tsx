import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex h-screen items-center justify-center">
        <p>FPL Revealer</p>
      </div>
    </HydrateClient>
  );
}
