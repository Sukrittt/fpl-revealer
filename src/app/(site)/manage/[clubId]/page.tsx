import { Suspense } from "react";

import { ClubServer } from "~/components/manage/club-server";

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ClubServer />
    </Suspense>
  );
}
