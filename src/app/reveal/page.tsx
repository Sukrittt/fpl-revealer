import { Suspense } from "react";

import { RevealServer } from "~/components/reveal/server";

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RevealServer />
    </Suspense>
  );
}
