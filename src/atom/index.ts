import { atom } from "jotai";
import { type Position } from "@prisma/client";

export const clubFitlerAtom = atom<string | null>(null);
export const positionFilterAtom = atom<Position | null>(null);
export const maxPlayerPriceAtom = atom(15);
export const playerSearchAtom = atom<string | null>(null);
