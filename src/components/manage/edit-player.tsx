"use client";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Player, type Position } from "@prisma/client";

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
import { DeletePlayer } from "./delete-player";

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

interface EditPlayerProps {
  player: Player;
  children: React.ReactNode;
}

export const EditPlayer: React.FC<EditPlayerProps> = ({ player, children }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState(player.name);
  const [price, setPrice] = useState(player.price.toString());
  const [displayName, setDisplayName] = useState(player.displayName ?? "");
  const [position, setPosition] = useState(player.position);

  const { mutate: editPlayer, isPending: isLoading } =
    api.club.editPlayer.useMutation({
      onSuccess: () => {
        toast.success("Changes saved successfully.");

        router.refresh();
        setOpen(false);
      },
    });

  const handleEditPlayer = async () => {
    if (!name || !price || !position) {
      toast.error("Please fill all fields.");
      return;
    }

    editPlayer({
      playerId: player.id,
      clubId: player.clubId,
      name,
      price: Number(price),
      position,
      displayName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
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

          <div className="grid grid-cols-2 gap-x-2">
            <DeletePlayer playerId={player.id} clubId={player.clubId} />

            <button
              onClick={handleEditPlayer}
              disabled={isLoading}
              className={cn(
                "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-200/60",
                {
                  "cursor-default opacity-60": isLoading,
                },
              )}
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
