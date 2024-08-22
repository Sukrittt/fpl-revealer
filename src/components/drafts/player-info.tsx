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
import { type ExtendedFplPlayer } from "~/types";

interface FplPlayerInfoProps {
  fplPlayer: ExtendedFplPlayer;
  children: React.ReactNode;
}

export const FplPlayerInfo: React.FC<FplPlayerInfoProps> = ({
  fplPlayer,
  children,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: makeCaptain, isPending: isMakingCaptain } =
    api.fpl.makeCaptain.useMutation({
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
    });

  const { mutate: makeViceCaptain, isPending: isMakingViceCaptain } =
    api.fpl.makeViceCaptain.useMutation({
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
    });

  const { mutate: toggleSubstite, isPending: isTogglingSubstite } =
    api.fpl.toggleSubstite.useMutation({
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {fplPlayer.player.name}
          </DialogTitle>

          <div className="flex flex-col gap-y-2 pt-2">
            <Button
              disabled={isTogglingSubstite}
              onClick={() =>
                toggleSubstite({
                  fplPlayerId: fplPlayer.id,
                  fplTeamId: fplPlayer.fplTeamId,
                })
              }
              className="bg-[#963cff] text-[13px] hover:bg-[#963cff]/90 focus-visible:ring-[#963cff]"
            >
              {isTogglingSubstite ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : fplPlayer.status === "STARTER" ? (
                "Make Substitute"
              ) : (
                "Make Starter"
              )}
            </Button>

            <Button
              disabled={isMakingCaptain}
              onClick={() =>
                makeCaptain({
                  fplPlayerId: fplPlayer.id,
                  fplTeamId: fplPlayer.fplTeamId,
                })
              }
              className="bg-[#01faaf] text-[13px] font-semibold text-foreground hover:bg-[#01faaf]/90 focus-visible:ring-[#01faaf]"
            >
              {isMakingCaptain ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : fplPlayer.isCaptain ? (
                "Remove Captain"
              ) : (
                "Make Captain"
              )}
            </Button>
            <Button
              disabled={isMakingViceCaptain}
              onClick={() =>
                makeViceCaptain({
                  fplPlayerId: fplPlayer.id,
                  fplTeamId: fplPlayer.fplTeamId,
                })
              }
              className="bg-[#01faaf] text-[13px] font-semibold text-foreground hover:bg-[#01faaf]/90 focus-visible:ring-[#01faaf]"
            >
              {isMakingViceCaptain ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : fplPlayer.isViceCaptain ? (
                "Remove Vice Captain"
              ) : (
                "Make Vice Captain"
              )}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
