import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Position } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const PositionEnum = z.nativeEnum(Position);

export const clubRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const clubs = await ctx.db.club.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return clubs;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        logoUrl: z.string(),
        jerseyUrl: z.string(),
        goalkeeperJerseyUrl: z.string(),
        shortName: z.string().min(3).max(3),
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
  edit: protectedProcedure
    .input(
      z.object({
        clubId: z.string(),
        name: z.string(),
        logoUrl: z.string(),
        jerseyUrl: z.string(),
        goalkeeperJerseyUrl: z.string(),
        shortName: z.string().min(3).max(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { clubId, ...payload } = input;

      const existingClub = await ctx.db.club.findFirst({
        where: {
          id: clubId,
        },
        select: { id: true },
      });

      if (!existingClub) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This club does not exist.",
        });
      }

      const existingClubWithSameName = await ctx.db.club.findFirst({
        where: {
          id: { not: clubId },
          name: {
            equals: input.name,
            mode: "insensitive",
          },
        },
        select: { id: true },
      });

      if (existingClubWithSameName) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This club is already added.",
        });
      }

      await ctx.db.club.update({
        where: {
          id: clubId,
        },
        data: {
          ...payload,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        clubId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { clubId } = input;

      const existingClub = await ctx.db.club.findFirst({
        where: {
          id: clubId,
        },
        select: { id: true },
      });

      if (!existingClub) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This club does not exist.",
        });
      }

      await ctx.db.club.delete({
        where: {
          id: clubId,
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
        displayName: z.string(),
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
  editPlayer: protectedProcedure
    .input(
      z.object({
        playerId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        position: PositionEnum,
        clubId: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { playerId, clubId, ...payload } = input;

      const existingPlayer = await ctx.db.player.findFirst({
        where: {
          id: playerId,
          clubId,
        },
        select: { id: true },
      });

      if (!existingPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist.",
        });
      }

      await ctx.db.player.update({
        where: {
          id: playerId,
          clubId,
        },
        data: {
          ...payload,
        },
      });
    }),

  deletePlayer: protectedProcedure
    .input(
      z.object({
        playerId: z.string(),
        clubId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { playerId, clubId } = input;

      const existingPlayer = await ctx.db.player.findFirst({
        where: {
          id: playerId,
          clubId,
        },
        select: { id: true },
      });

      if (!existingPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist.",
        });
      }

      await ctx.db.player.delete({
        where: {
          id: playerId,
          clubId,
        },
      });
    }),

  getPlayers: protectedProcedure
    .input(
      z.object({
        clubId: z.string().optional(),
        position: PositionEnum.optional(),
        maxPrice: z.number(),
        name: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const players = await ctx.db.player.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.name,
                mode: "insensitive",
              },
            },
            {
              displayName: {
                contains: input.name,
                mode: "insensitive",
              },
            },
          ],
          clubId: input.clubId,
          position: input.position,
          price: {
            lte: input.maxPrice,
          },
        },
        include: {
          club: true,
        },
        orderBy: {
          price: "desc",
        },
      });

      return players;
    }),
});
