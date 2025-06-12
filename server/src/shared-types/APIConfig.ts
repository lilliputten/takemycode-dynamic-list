import { TSchemeMigration } from './TSchemeMigration';
import { TServerConfig } from './TServerConfig';

export interface APIConfig {
  sid?: string;
  config?: TServerConfig; // Prisma.ConfigMinAggregateOutputType;
  schemeMigration?: TSchemeMigration;
  test?: string | number | boolean;
  versionInfo: string;
  isDev?: boolean;
  VERCEL_URL?: string;
  PORT?: string | number;
}
