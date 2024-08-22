"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";

export const CreateReveal = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const { mutate: createReveal, isPending } =
    api.reveal.createReveal.useMutation({
      onSuccess: (reveal) => {
        router.push(`/reveal/${reveal.id}`);
      },
    });

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[url('/images/background.png')]">
      <div className="flex min-w-[500px] flex-col gap-y-2">
        <Input
          type="email"
          disabled={isPending}
          placeholder="Challenger Email"
          value={email}
          className="border-[#070f20] bg-transparent text-white ring-offset-[#070f20] focus-visible:ring-[#070f20]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={isPending}
          onClick={() => createReveal({ challengerEmail: email })}
          className={cn(
            "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-[#070f20] px-2 py-1.5 text-sm text-white transition hover:bg-[#070f20]/60",
            {
              "cursor-default opacity-60": isPending,
            },
          )}
        >
          Create
        </button>
      </div>
    </div>
  );
};
