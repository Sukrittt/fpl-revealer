import { Suspense } from "react";

import { ClubServer } from "~/components/manage/club-server";

interface PageProps {
  params: {
    clubId: string;
  };
}

export default function page({ params }: PageProps) {
  const { clubId } = params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ClubServer clubId={clubId} />
    </Suspense>
  );
}
