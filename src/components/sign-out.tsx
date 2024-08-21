"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

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
    <p onClick={handleLogout}>{loading ? "Signing Out..." : "Sign Out"}</p>
  );
};
