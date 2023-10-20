import { PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

db.$use(createSoftDeleteMiddleware({
  models: {
    Game: true,
    PlayerStat: true
  }
}))

export {db};

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
