import { Suspense } from "react";

// import { FplTeamServer } from "~/components/drafts/team-server";

interface PageProps {
  params: {
    teamId: string;
  };
}

export default function page({ params }: PageProps) {
  const { teamId } = params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* <FplTeamServer teamId={teamId} /> */}
      <p>Pick Team</p>
    </Suspense>
  );
}
