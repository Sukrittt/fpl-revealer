"use client";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { cn } from "~/lib/utils";

const oauthProviders = [
  { name: "Sign in with Google", strategy: "google" as const, icon: "google" },
];

type Strategy = (typeof oauthProviders)[number]["strategy"];

export const SignIn = () => {
  const [isLoading, setIsLoading] = useState<Strategy | null>(null);

  const handleOAuthLogin = async (strategy: Strategy) => {
    try {
      setIsLoading(strategy);
      await signIn(strategy);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  return oauthProviders.map((provider, index) => {
    return (
      <p
        className={cn("cursor-pointer", {
          "cursor-default opacity-60": isLoading === provider.strategy,
        })}
        key={index}
        onClick={() => handleOAuthLogin(provider.strategy)}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </p>
    );
  });
};
