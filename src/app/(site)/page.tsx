import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="flex h-screen items-center justify-center">
        <p>FPL Revealer</p>
      </div>
    </HydrateClient>
  );
}
