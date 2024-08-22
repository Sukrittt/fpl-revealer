import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex h-screen items-center justify-center">
        <p>FPL Revealer</p>
      </div>
    </HydrateClient>
  );
}
