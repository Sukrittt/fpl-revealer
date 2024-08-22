import { useAtom } from "jotai";
import { type Position } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  clubFitlerAtom,
  maxPlayerPriceAtom,
  playerSearchAtom,
  positionFilterAtom,
} from "~/atom";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "~/hooks/get-debounce";
import { SearchIcon } from "lucide-react";

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

export const FplFilter = () => {
  const [clubId, setClubId] = useAtom(clubFitlerAtom);
  const [position, setPosition] = useAtom(positionFilterAtom);
  const [maxPrice, setMaxPrice] = useAtom(maxPlayerPriceAtom);
  const [playerSearch, setPlayerSearch] = useAtom(playerSearchAtom);

  const [name, setName] = useState(playerSearch ?? "");

  const debouncedName = useDebounce(name, 250);

  const { data: clubs, isLoading } = api.club.get.useQuery();

  useEffect(() => {
    setPlayerSearch(debouncedName);
  }, [debouncedName, setPlayerSearch]);

  const handlePositionChange = (val: string) => {
    const typedVal = val as Position;

    setPosition(val === "UNDEFINED" ? null : typedVal);

    if (val === "UNDEFINED") {
      setMaxPrice(15);
    }

    if (typedVal === "GOALKEEPER") {
      setMaxPrice(5.5);
    } else if (typedVal === "MIDFIELDER") {
      setMaxPrice(12.5);
    } else if (typedVal === "DEFENDER") {
      setMaxPrice(7);
    } else if (typedVal === "FORWARD") {
      setMaxPrice(15);
    }
  };

  const getMaxPriceOpts = (position: Position | null) => {
    let optCount: number;

    if (position === "GOALKEEPER") {
      optCount = 5.5;
    } else if (position === "MIDFIELDER") {
      optCount = 12.5;
    } else if (position === "DEFENDER") {
      optCount = 7;
    } else {
      optCount = 15;
    }

    const length = Math.floor((optCount - 0.5) * 2) + 1;

    return Array.from({ length }, (_, i) => optCount - i * 0.5).map((i) => ({
      label: i.toFixed(1).toString(),
      value: i,
    }));
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <p className="text-sm">Clubs</p>
        <Select
          value={clubId ?? undefined}
          onValueChange={(val) => {
            setClubId(val === "UNDEFINED" ? null : val);
          }}
        >
          <SelectTrigger>
            {clubId ? <SelectValue /> : <p>All Clubs</p>}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNDEFINED">All Clubs</SelectItem>

            {isLoading ? (
              <p>Loading...</p>
            ) : !clubs || clubs.length === 0 ? (
              <p>No clubs found.</p>
            ) : (
              clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  {club.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-1">
        <p className="text-sm">Position</p>
        <Select
          value={position ?? undefined}
          onValueChange={handlePositionChange}
        >
          <SelectTrigger>
            {position ? <SelectValue /> : <p>All Positions</p>}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNDEFINED">All Positions</SelectItem>

            {positionOpts.map((position) => (
              <SelectItem key={position.value} value={position.value}>
                {position.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-1">
        <p className="text-sm">Max cost</p>
        <Select
          value={maxPrice.toString() ?? undefined}
          onValueChange={(val) => {
            setMaxPrice(Number(val));
          }}
        >
          <SelectTrigger>
            {position ? <SelectValue /> : <p>All Positions</p>}
          </SelectTrigger>
          <SelectContent>
            {getMaxPriceOpts(position).map((price) => (
              <SelectItem key={price.value} value={price.value.toString()}>
                {price.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative py-2">
        <Input
          placeholder="Search for player..."
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="absolute right-1 top-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#37003c] text-white">
            <SearchIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
