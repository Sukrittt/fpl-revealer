import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Position } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const PositionEnum = z.nativeEnum(Position);

export const clubRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        logoUrl: z.string(),
        jerseyUrl: z.string(),
        goalkeeperJerseyUrl: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingClub = await ctx.db.club.findFirst({
        where: {
          name: {
            equals: input.name,
            mode: "insensitive",
          },
        },
        select: { id: true },
      });

      if (existingClub) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This club is already added.",
        });
      }

      await ctx.db.club.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  addPlayer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number().positive(),
        position: PositionEnum,
        clubId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingPlayer = await ctx.db.player.findFirst({
        where: {
          name: {
            equals: input.name,
            mode: "insensitive",
          },
          clubId: input.clubId,
        },
        select: { id: true },
      });

      if (existingPlayer) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Player already exists in this club",
        });
      }

      await ctx.db.player.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  getPlayers: protectedProcedure.query(async ({ ctx }) => {
    const players = await ctx.db.player.findMany({
      include: {
        club: true,
      },
    });

    return players;
  }),
});
