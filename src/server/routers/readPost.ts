import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { protectedProcedure, router } from '../trpc';

export const readPostRouter = router({
  set: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      return prisma.readPosts.upsert({
        where: {
          postId_userId: {
            userId: ctx.session.user.id,
            postId: id,
          },
        },
        update: {},
        create: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          post: {
            connect: {
              id,
            },
          },
        },
      });
    }),
});