/* eslint-disable no-console */
/**
 *
 * @desc ExressJS server runner
 *
 * Command line arguments:
 *
 * --migrate: Apply databse migrations (not implemented yet).
 * --dev: Run in development mode (alternatively, set the environment variable NODE_ENV=development).
 *
 * Environment variables:
 *
 *   - DATABASE_URL: Postgress connection string (`postgres:...`), required.
 *   - VERCEL_URL: A vercel host name (FQDN, automaticallly passed on the deployment server).
 *   - PORT: Server lisntening port address (default: 3000).
 *   - NODE_ENV: Devlopment/production running mode.
 *   - CONFIG_ID: Config id (a configs database record id, default: 1).
 *   - DEV_CLIENT_HOST: Client host for development mode (used to set up CORS headers, default: http://localhost:5173).
 *
 * All the variables could be set in the `.env` file.
 *
 */

import { Express } from 'express';

import { DATABASE_URL, isDev, isVercel, ORIGIN_HOST, VERCEL_URL } from '@/config/env';
import { migrate } from '@/migrate';
import appInfo from '@/shared-types/app-info.json';

import { server, serverShutDown } from './server';

console.log('[index] versionInfo:', appInfo.versionInfo);
console.log('[index] process.argv:', process.argv);
console.log('[index] VERCEL_URL:', VERCEL_URL);
console.log('[index] ORIGIN_HOST:', ORIGIN_HOST);
console.log('[index] DATABASE_URL:', DATABASE_URL);
console.log('[index] isVercel:', isVercel);
console.log('[index] isDev:', isDev);

if (!DATABASE_URL) {
  // prettier-ignore
  console.error('No DATABASE_URL has provided. Use `set -a; source .env; set +a` in to expose local variables or set it in command line.');
  debugger; // eslint-disable-line no-debugger
  process.exit(1);
}

/** ExpressJS server instance (won't be initialized in migrate mode) */
let app: Express | undefined;

// Check if is invoked in migrate mode?
if (process.argv?.includes('--migrate')) {
  // Do migrations...
  console.log('Migration started...');
  migrate()
    .then((result) => {
      console.log('Migration finished:', result || 'OK');
      process.exit();
    })
    .catch((error) => {
      console.error('Migration error:', error);
      debugger; // eslint-disable-line no-debugger
      process.exit();
    });
} else {
  // Create the ExpressJS server...
  app = server();
}

process.on('SIGINT', serverShutDown);
process.on('SIGTERM', serverShutDown);

export default app;
