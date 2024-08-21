import Link from "next/link";
import Image from "next/image";

import { db } from "~/server/db";
import { SignIn } from "./sign-in";
import { SignOut } from "./sign-out";
import { getServerAuthSession } from "~/server/auth";

export const Navbar = async () => {
  const session = await getServerAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: { role: true },
  });

  return (
    <div className="sticky top-0 z-40 mt-10 flex h-16 items-center justify-between bg-[#37003c] px-6 text-white">
      <div className="flex items-center gap-x-16">
        <Image src="/images/logo.png" alt="logo" width={90} height={90} />

        <div className="flex items-center gap-x-8 text-[16.5px] font-bold tracking-wide">
          <p>Team Reveal</p>
          <p>Manage Drafts</p>
          {user?.role === "ADMIN" && <Link href="/manage">Manage Teams</Link>}
        </div>
      </div>

      {session ? <SignOut /> : <SignIn />}
    </div>
  );
};
