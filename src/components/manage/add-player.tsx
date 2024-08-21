"use client";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Position } from "@prisma/client";

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

const positionOpts: { label: string; value: Position }[] = [
  {
    label: "Goalkeeper",
    value: "GOALKEEPER",
  },
  {
    label: "Defender",
    value: "DEFENDER",
  },
  {
    label: "Midfielder",
    value: "MIDFIELDER",
  },
  {
    label: "Forward",
    value: "FORWARD",
  },
];

export const AddPlayer = ({ clubId }: { clubId: string }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const resetValues = () => {
    setName("");
    setPrice("");
    setDisplayName("");
    setPosition(null);
  };

  const { mutate: addPlayer, isPending: isLoading } =
    api.club.addPlayer.useMutation({
      onSuccess: () => {
        toast.success("Player added successfully.");

        router.refresh();
        resetValues();
        setOpen(false);
      },
    });

  const handleAddPlayer = async () => {
    if (!name || !price || !position) {
      toast.error("Please fill all fields.");
      return;
    }

    addPlayer({
      name,
      price: Number(price),
      position,
      clubId,
      displayName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-md border bg-neutral-100 px-4 py-1 text-sm">
          Add Player
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Player</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2">
          <Input
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white px-2 py-1"
            placeholder="Player name"
          />

          <Input
            disabled={isLoading}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-white px-2 py-1"
            placeholder="Display name (optional)"
          />

          <div className="grid grid-cols-2 gap-x-2">
            <Input
              disabled={isLoading}
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white px-2 py-1"
              placeholder="Player price"
            />

            <Select
              disabled={isLoading}
              value={position ?? undefined}
              onValueChange={(value) => setPosition(value as Position)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                {positionOpts.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleAddPlayer}
            className={cn(
              "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-200/60",
              {
                "cursor-default opacity-60": isLoading,
              },
            )}
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
