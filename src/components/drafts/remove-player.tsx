import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

interface RemovePlayerFromFplProps {
  fplPlayerId: string;
  fplTeamId: string;
  children: React.ReactNode;
  playerName: string;
}

export const RemovePlayerFromFpl: React.FC<RemovePlayerFromFplProps> = ({
  fplPlayerId,
  fplTeamId,
  children,
  playerName,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: removePlayer, isPending } = api.fpl.removePlayer.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  const handleRemoverPlayer = () => {
    removePlayer({
      fplPlayerId,
      fplTeamId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Remove {playerName}?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-2">
          <Button
            disabled={isPending}
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleRemoverPlayer}
            className="bg-[#963cff] hover:bg-[#963cff]/90 focus-visible:ring-[#963cff]"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
