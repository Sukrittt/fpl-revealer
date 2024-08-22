import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const revealRouter = createTRPCRouter({
  createReveal: protectedProcedure
    .input(
      z.object({
        challengerEmail: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.challengerEmail === ctx.session.user.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You can't challenge yourself.",
        });
      }

      const homeFplTeam = await ctx.db.fplTeam.findFirst({
        where: {
          user: {
            email: ctx.session.user.email,
          },
          status: "ACTIVE",
        },
        select: { id: true, fplPlayers: true },
      });

      if (!homeFplTeam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You do not have an active FPL team.",
        });
      }

      if (homeFplTeam.fplPlayers.length !== 15) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You need to have 15 players in your FPL team.",
        });
      }

      const homeFplTeamStartingEleven = homeFplTeam.fplPlayers.filter(
        (fplPlayer) => fplPlayer.status === "STARTER",
      );

      if (homeFplTeamStartingEleven.length < 11) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You need to have 11 starting players in your FPL team.",
        });
      }

      const awaitFplUser = await ctx.db.user.findFirst({
        where: {
          email: input.challengerEmail,
        },
        select: { id: true },
      });

      if (!awaitFplUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Challenger does not exist.",
        });
      }

      const awayFplTeam = await ctx.db.fplTeam.findFirst({
        where: {
          user: {
            email: input.challengerEmail,
          },
          status: "ACTIVE",
        },
        select: { id: true, fplPlayers: true },
      });

      if (!awayFplTeam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Challenger does not has an active FPL team.",
        });
      }

      if (awayFplTeam.fplPlayers.length !== 15) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You need to have 15 players in your FPL team.",
        });
      }

      const awayFplTeamStartingEleven = awayFplTeam.fplPlayers.filter(
        (fplPlayer) => fplPlayer.status === "STARTER",
      );

      if (awayFplTeamStartingEleven.length < 11) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You need to have 11 starting players in your FPL team.",
        });
      }

      const reveal = await ctx.db.revealMatch.create({
        data: {
          homeTeamId: homeFplTeam.id,
          awayTeamId: awayFplTeam.id,
        },
        select: { id: true },
      });

      return reveal;
    }),
});
