import { redirect } from "next/navigation";

import { CreateReveal } from "./create-reveal";
import { getServerAuthSession } from "~/server/auth";

export const RevealServer = async () => {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  return <CreateReveal />;
};
