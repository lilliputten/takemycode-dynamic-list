// import { Prisma } from '@prisma-generated/prisma';

import { prisma } from '@/lib/db/prisma';
import { getErrorText } from '@/lib/helpers/strings';
import { DatabaseError } from '@/shared/errors/DatabaseError';

import { TConfigId } from '../types/TConfigId';

export async function getOrCreateConfig(id: TConfigId) {
  try {
    return await prisma.$transaction(async (tx) => {
      let config = await tx.config.findUnique({ where: { id } });
      console.log('[server/src/features/config/actions/getOrCreateConfig.ts] Got config', {
        config,
      });
      debugger;
      if (config) {
        return config;
      }
      config = await tx.config.create({
        data: {
          id,
        },
      });
      console.log('[server/src/features/config/actions/getOrCreateConfig.ts] Created config', {
        config,
      });
      debugger;
      if (!config) {
        throw new Error('Created undefined config object');
      }
      return config;
    });
  } catch (error) {
    const nextText = 'Can not get or create config';
    const errorMessage = getErrorText(error);
    const nextMessage = [nextText, errorMessage].filter(Boolean).join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console, prettier/prettier
    console.log(
      '[server/src/features/config/actions/getOrCreateConfig.ts] error',
      nextMessage,
      error,
    );
    debugger; // eslint-disable-line no-debugger
    throw nextError;
  }
}
