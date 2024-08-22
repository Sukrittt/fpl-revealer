import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Position, Status } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const DraftStatusEnum = z.nativeEnum(Status);

export const fplRouter = createTRPCRouter({
  createDraft: protectedProcedure
    .input(
      z.object({
        name: z.string().max(300),
        status: DraftStatusEnum,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.status === "ACTIVE") {
        const activeDraft = await ctx.db.fplTeam.findFirst({
          where: {
            userId: ctx.session.user.id,
            status: "ACTIVE",
          },
          select: { id: true },
        });

        if (activeDraft) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You already have an active team.",
          });
        }
      }

      await ctx.db.fplTeam.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  addPlayer: protectedProcedure
    .input(
      z.object({
        fplTeamId: z.string(),
        playerId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const fplTeam = await ctx.db.fplTeam.findFirst({
        where: {
          id: input.fplTeamId,
          userId: ctx.session.user.id,
        },
        select: { id: true },
      });

      if (!fplTeam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This team does not exist.",
        });
      }

      const player = await ctx.db.player.findFirst({
        where: {
          id: input.playerId,
        },
        select: { id: true, position: true, clubId: true },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist.",
        });
      }

      const playerLimitForClub = await ctx.db.fplPlayer.count({
        where: {
          fplTeamId: input.fplTeamId,
          player: {
            clubId: player.clubId,
          },
        },
      });

      if (playerLimitForClub >= 3) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You can't have more than 3 players from the same club.",
        });
      }

      const fplPlayer = await ctx.db.fplPlayer.findFirst({
        where: {
          fplTeamId: input.fplTeamId,
          playerId: input.playerId,
        },
        select: { id: true },
      });

      if (fplPlayer) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This player is already added in this team.",
        });
      }

      const playersWithThisPosition = await ctx.db.fplPlayer.count({
        where: {
          fplTeamId: input.fplTeamId,
          player: {
            position: player.position,
          },
        },
      });

      const maxPlayersForThisPosition = getMaxPlayersForThisPosition(
        player.position,
      );

      if (playersWithThisPosition >= maxPlayersForThisPosition) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You don't have any more slots for this position.",
        });
      }

      await ctx.db.fplPlayer.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          status: getPlayerStatus(playersWithThisPosition, player.position),
        },
      });
    }),
  removePlayer: protectedProcedure
    .input(
      z.object({
        fplPlayerId: z.string(),
        fplTeamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const fplPlayer = await ctx.db.fplPlayer.findFirst({
        where: {
          id: input.fplPlayerId,
          userId: ctx.session.user.id,
          fplTeamId: input.fplTeamId,
        },
      });

      if (!fplPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist in this team.",
        });
      }

      await ctx.db.fplPlayer.delete({
        where: {
          id: input.fplPlayerId,
          fplTeamId: input.fplTeamId,
          userId: ctx.session.user.id,
        },
      });
    }),
  makeCaptain: protectedProcedure
    .input(
      z.object({
        fplPlayerId: z.string(),
        fplTeamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingFplPlayer = await ctx.db.fplPlayer.findFirst({
        where: {
          id: input.fplPlayerId,
          userId: ctx.session.user.id,
          fplTeamId: input.fplTeamId,
        },
        select: { isCaptain: true },
      });

      if (!existingFplPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist in your team.",
        });
      }

      if (existingFplPlayer.isCaptain) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This player is already your captain.",
        });
      }

      await ctx.db.fplPlayer.updateMany({
        where: {
          fplTeamId: input.fplTeamId,
        },
        data: {
          isCaptain: false,
        },
      });

      await ctx.db.fplPlayer.update({
        where: {
          id: input.fplPlayerId,
        },
        data: {
          isCaptain: true,
        },
      });
    }),
  makeViceCaptain: protectedProcedure
    .input(
      z.object({
        fplPlayerId: z.string(),
        fplTeamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingFplPlayer = await ctx.db.fplPlayer.findFirst({
        where: {
          id: input.fplPlayerId,
          userId: ctx.session.user.id,
          fplTeamId: input.fplTeamId,
        },
        select: { isViceCaptain: true },
      });

      if (!existingFplPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist in your team.",
        });
      }

      if (existingFplPlayer.isViceCaptain) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This player is already your vice captain.",
        });
      }

      await ctx.db.fplPlayer.updateMany({
        where: {
          fplTeamId: input.fplTeamId,
        },
        data: {
          isViceCaptain: false,
        },
      });

      await ctx.db.fplPlayer.update({
        where: {
          id: input.fplPlayerId,
        },
        data: {
          isViceCaptain: true,
        },
      });
    }),
  toggleSubstite: protectedProcedure
    .input(
      z.object({
        fplPlayerId: z.string(),
        fplTeamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingFplPlayer = await ctx.db.fplPlayer.findFirst({
        where: {
          id: input.fplPlayerId,
          userId: ctx.session.user.id,
          fplTeamId: input.fplTeamId,
        },
      });

      if (!existingFplPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This player does not exist in your team.",
        });
      }

      await ctx.db.fplPlayer.update({
        where: {
          id: input.fplPlayerId,
        },
        data: {
          status: existingFplPlayer.status === "STARTER" ? "BENCH" : "STARTER",
        },
      });
    }),
});

// Going with 4-4-2 formation
const getPlayerStatus = (noOfPlayers: number, position: Position) => {
  switch (position) {
    case "GOALKEEPER":
      return noOfPlayers === 1 ? "BENCH" : "STARTER";
      break;

    case "DEFENDER":
    case "MIDFIELDER":
      return noOfPlayers === 4 ? "BENCH" : "STARTER";

    case "FORWARD":
      return noOfPlayers === 2 ? "BENCH" : "STARTER";

    default:
      return "STARTER";
      break;
  }
};

const getMaxPlayersForThisPosition = (position: Position) => {
  switch (position) {
    case "GOALKEEPER":
      return 2;
      break;

    case "DEFENDER":
    case "MIDFIELDER":
      return 5;

    case "FORWARD":
      return 3;

    default:
      return 0;
      break;
  }
};
