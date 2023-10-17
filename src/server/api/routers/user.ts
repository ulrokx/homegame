import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
