import { Suspense } from "react";

import { DraftsServer } from "~/components/drafts/server";

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DraftsServer />
    </Suspense>
  );
}
