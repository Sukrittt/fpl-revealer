import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface DeletePlayerProps {
  playerId: string;
  clubId: string;
}

export const DeletePlayer: React.FC<DeletePlayerProps> = ({
  playerId,
  clubId,
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { mutate: deletePlayer, isPending: isLoading } =
    api.club.deletePlayer.useMutation({
      onSuccess: () => {
        toast.success("Changes saved successfully.");

        router.refresh();
        setOpen(false);
      },
    });

  const handleDeletePlayer = async () => {
    deletePlayer({
      playerId,
      clubId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-red-200 px-2 py-1 text-sm transition hover:bg-red-200/60">
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            player and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-2">
          <button
            onClick={() => setOpen(false)}
            className="mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-200/60"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletePlayer}
            disabled={isLoading}
            className={cn(
              "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-red-200 px-2 py-1 text-sm transition hover:bg-red-200/60",
              {
                "cursor-default opacity-60": isLoading,
              },
            )}
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
