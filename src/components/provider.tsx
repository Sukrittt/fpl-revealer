"use client";
import gsap from "gsap";
import { Toaster } from "sonner";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />

      {children}
    </>
  );
};
