import { z } from "zod";
import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
});
