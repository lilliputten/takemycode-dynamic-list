// import { Prisma } from '@prisma-generated/prisma';

import { prisma } from '@/lib/db';

import { TConfigId } from '../types/TConfigId';

export async function getConfig(id: TConfigId) {
  try {
    const config = await prisma.config.findUnique({ where: { id } });
    const configId = config?.id;
    console.log('[server/src/features/config/actions/getConfig.ts]', {
      configId,
      config,
    });
    debugger;
    return config;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[server/src/features/config/actions/getConfig.ts] error', error);
    debugger; // eslint-disable-line no-debugger
    return null;
  }
}
