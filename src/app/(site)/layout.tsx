import { Suspense } from "react";

import { Navbar } from "~/components/navbar";
import { ClubBadges } from "~/components/club-badges";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<p>Loading...</p>}>
        <ClubBadges />
      </Suspense>

      <Suspense fallback={<p>Loading...</p>}>
        <Navbar />
      </Suspense>

      <main className="flex-1">{children}</main>
    </div>
  );
}
