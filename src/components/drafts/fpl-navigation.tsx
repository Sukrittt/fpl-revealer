"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

export const FplNavigation = ({ teamId }: { teamId: string }) => {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0">
      <div className="flex items-center gap-x-2 text-sm">
        <Link
          href={`/teams/${teamId}/pick-team`}
          className={cn("rounded-t-md bg-[#00ff87] px-4 py-2", {
            "bg-white": pathname.includes("/pick-team"),
          })}
        >
          Pick Team
        </Link>
        <Link
          href={`/teams/${teamId}/transfers`}
          className={cn("rounded-t-md bg-[#00ff87] px-4 py-2", {
            "bg-white": pathname.includes("/transfers"),
          })}
        >
          Transfers
        </Link>
      </div>
    </div>
  );
};
