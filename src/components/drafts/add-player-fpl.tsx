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
import { type ExtendedPlayer } from "~/types";
import { Button } from "~/components/ui/button";

interface AddPlayerToFplProps {
  player: ExtendedPlayer["player"];
  fplTeamId: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const AddPlayerToFpl: React.FC<AddPlayerToFplProps> = ({
  player,
  fplTeamId,
  children,
  disabled,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: addPlayer, isPending } = api.fpl.addPlayer.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  const handleAddPlayer = () => {
    if (disabled) return;

    addPlayer({
      playerId: player.id,
      fplTeamId,
    });
  };

  return (
    <Dialog open={open && disabled === undefined} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{player.name}</DialogTitle>
        </DialogHeader>

        <Button
          disabled={isPending}
          onClick={handleAddPlayer}
          className="bg-[#963cff] hover:bg-[#963cff]/90 focus-visible:ring-[#963cff]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add Player"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
