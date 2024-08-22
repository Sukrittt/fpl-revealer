"use client";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Status } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";

const statusOpts: { label: string; value: Status }[] = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Draft",
    value: "DRAFT",
  },
];

export const CreateDraft = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status | null>(null);

  const resetValues = () => {
    setName("");
  };

  const { mutate: createDraft, isPending: isLoading } =
    api.fpl.createDraft.useMutation({
      onSuccess: () => {
        toast.success("Team created successfully.");

        router.refresh();
        resetValues();
        setOpen(false);
      },
    });

  const handleAddPlayer = async () => {
    if (!name || !status) {
      toast.error("Please fill all fields.");
      return;
    }

    createDraft({
      name,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-md border bg-neutral-100 px-4 py-1 text-sm">
          Create Team
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2">
          <Input
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white px-2 py-1"
            placeholder="Type draft name"
          />

          <Select
            disabled={isLoading}
            value={status ?? undefined}
            onValueChange={(value) => setStatus(value as Status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOpts.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleAddPlayer}
            className={cn(
              "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-200/60",
              {
                "cursor-default opacity-60": isLoading,
              },
            )}
          >
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
