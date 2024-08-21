"use client";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { uploadFiles } from "~/lib/uploadthing";
import { Check } from "lucide-react";
import { Club, Player } from "@prisma/client";

type UploadType = "logo" | "jersey" | "goalkeeperJersey";

type ExtendedClub = Club & { players: Player[] };

export const EditClub = ({ club }: { club: ExtendedClub }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState(club.name);
  const [shortName, setShortName] = useState(club.shortName ?? "");

  const [logoUrl, setLogoUrl] = useState<string | null>(club.logoUrl);
  const [jerseyUrl, setJerseyUrl] = useState<string | null>(club.jerseyUrl);
  const [goalkeeperJerseyUrl, setGoalkeeperJerseyUrl] = useState<string | null>(
    club.goalkeeperJerseyUrl,
  );

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingJersey, setUploadingJersey] = useState(false);
  const [uploadingGoalkeeperJersey, setUploadingGoalkeeperJersey] =
    useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const jerseyInputRef = useRef<HTMLInputElement | null>(null);
  const goalkeeperJerseyInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = (type: UploadType) => {
    if (type === "logo" && uploadingLogo) return;

    if (type === "jersey" && uploadingJersey) return;

    if (type === "goalkeeperJersey" && uploadingGoalkeeperJersey) return;

    if (type === "logo") {
      if (logoInputRef.current) {
        logoInputRef.current.click();
      }
    } else if (type === "jersey") {
      if (jerseyInputRef.current) {
        jerseyInputRef.current.click();
      }
    } else {
      if (goalkeeperJerseyInputRef.current) {
        goalkeeperJerseyInputRef.current.click();
      }
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: UploadType,
  ) => {
    const files = event.target.files;

    if (!files) return;

    const file = files[0];

    try {
      if (!file) return;

      if (type === "logo") {
        setUploadingLogo(true);
      } else if (type === "jersey") {
        setUploadingJersey(true);
      } else {
        setUploadingGoalkeeperJersey(true);
      }

      const fileObj = await uploadByFile(file);

      if (!fileObj) return;

      if (type === "logo") {
        setLogoUrl(fileObj.url);
      } else if (type === "jersey") {
        setJerseyUrl(fileObj.url);
      } else {
        setGoalkeeperJerseyUrl(fileObj.url);
      }

      toast.success("Files uploaded successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (type === "logo") {
        setUploadingLogo(false);
      } else if (type === "jersey") {
        setUploadingJersey(false);
      } else {
        setUploadingGoalkeeperJersey(false);
      }
    }
  };

  async function uploadByFile(file: File) {
    const [res] = await uploadFiles("imageUploader", {
      files: [file],
    });

    if (!res) return null;

    return {
      url: res.url,
    };
  }

  const resetValues = () => {
    setName("");
    setLogoUrl(null);
    setJerseyUrl(null);
    setGoalkeeperJerseyUrl(null);
    setShortName("");
  };

  const { mutate: editClub, isPending: isLoading } = api.club.edit.useMutation({
    onSuccess: () => {
      toast.success("Club created successfully.");

      router.refresh();
      resetValues();
      setOpen(false);
    },
  });

  const handleEditClub = async () => {
    if (!name || !logoUrl || !jerseyUrl || !goalkeeperJerseyUrl || !shortName) {
      toast.error("Please fill all fields.");
      return;
    }

    editClub({
      clubId: club.id,
      name,
      logoUrl,
      jerseyUrl,
      goalkeeperJerseyUrl,
      shortName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-md border bg-neutral-100 px-4 py-1 text-sm">
          Edit Club
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Club</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2">
          <Input
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white px-2 py-1"
            placeholder="Club name"
          />

          <Input
            disabled={isLoading}
            value={shortName}
            onChange={(e) => {
              if (e.target.value.length > 3) return;

              setShortName(e.target.value.toUpperCase());
            }}
            className="bg-white px-2 py-1"
            placeholder="Club short name (3 characters), e.g. MUN"
          />

          <div className="grid grid-cols-3 gap-x-2">
            <div
              onClick={() => handleFileClick("logo")}
              className={cn(
                "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-100 px-2 py-1 transition hover:bg-neutral-100/60",
                {
                  "cursor-default opacity-60": uploadingLogo || isLoading,
                },
              )}
            >
              <p className="text-sm">Logo</p>
              {logoUrl && <Check className="h-3 w-3" />}
            </div>

            <div
              onClick={() => handleFileClick("jersey")}
              className={cn(
                "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-100 px-2 py-1 transition hover:bg-neutral-100/60",
                {
                  "cursor-default opacity-60": uploadingJersey || isLoading,
                },
              )}
            >
              <p className="text-sm">Jersey</p>
              {jerseyUrl && <Check className="h-3 w-3" />}
            </div>

            <div
              onClick={() => handleFileClick("goalkeeperJersey")}
              className={cn(
                "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-100 px-2 py-1 transition hover:bg-neutral-100/60",
                {
                  "cursor-default opacity-60":
                    uploadingGoalkeeperJersey || isLoading,
                },
              )}
            >
              <p className="text-sm">Gk Jersey</p>
              {goalkeeperJerseyUrl && <Check className="h-3 w-3" />}
            </div>
          </div>

          <input
            disabled={uploadingLogo || isLoading}
            ref={logoInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, "logo")}
            accept="image/*"
            type="file"
          />

          <input
            disabled={uploadingJersey || isLoading}
            ref={jerseyInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, "jersey")}
            accept="image/*"
            type="file"
          />

          <input
            disabled={uploadingGoalkeeperJersey || isLoading}
            ref={goalkeeperJerseyInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, "goalkeeperJersey")}
            accept="image/*"
            type="file"
          />

          <button
            onClick={handleEditClub}
            className={cn(
              "mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-200/60",
              {
                "cursor-default opacity-60":
                  uploadingLogo ||
                  uploadingJersey ||
                  uploadingGoalkeeperJersey ||
                  isLoading,
              },
            )}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
