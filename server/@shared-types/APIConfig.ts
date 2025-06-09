// import { Prisma } from '@prisma-generated/prisma';
import { Prisma } from '../prisma-generated/prisma';

export interface APIConfig {
  config?: Prisma.ConfigMinAggregateOutputType;
  test?: string | number | boolean;
  versionInfo: string;
  isDev?: boolean;
  VERCEL_URL?: string;
  PORT?: string | number;
}
