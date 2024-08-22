import { Suspense } from "react";

import { RevealMatchServer } from "~/components/reveal/reveal-match-server";

interface PageProps {
  params: {
    revealId: string;
  };
}

export default function page({ params }: PageProps) {
  const { revealId } = params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RevealMatchServer revealId={revealId} />
    </Suspense>
  );
}
