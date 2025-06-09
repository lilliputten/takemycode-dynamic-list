import { TServerConfig } from './TServerConfig';

export interface APIConfig {
  config?: TServerConfig; // Prisma.ConfigMinAggregateOutputType;
  test?: string | number | boolean;
  versionInfo: string;
  isDev?: boolean;
  VERCEL_URL?: string;
  PORT?: string | number;
}
