import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
});
