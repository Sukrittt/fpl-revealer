"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

import { cn } from "~/lib/utils";

export const SignOut = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    await signOut({
      callbackUrl: `/`,
      redirect: true,
    });
  };

  return (
    <p
      onClick={handleLogout}
      className={cn("cursor-pointer", {
        "cursor-default opacity-60": loading,
      })}
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </p>
  );
};
