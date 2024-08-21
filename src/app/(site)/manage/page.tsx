import { Suspense } from "react";

import { ManageServer } from "~/components/manage/server";

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ManageServer />
    </Suspense>
  );
}
