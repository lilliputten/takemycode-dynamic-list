import { PrismaClient } from '@prisma-generated/prisma/client';

// export type TPrismaClient = PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

export let prisma: PrismaClient;

const isJest = process.env.JEST_WORKER_ID !== undefined;
const isProduction = process.env.NODE_ENV !== 'development';

if (isProduction || isJest) {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}
