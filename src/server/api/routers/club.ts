import { z } from "zod";
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
      await ctx.db.player.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
