/* eslint-disable no-console */

import { DATABASE_URL, isDev, isVercel, ORIGIN_HOST, VERCEL_URL } from '@/config/env';
import { pool } from '@/lib/db/postgres';
import { createApp, TExpressApp } from '@/express-app';
import { migrate } from '@/migrate';
import appInfo from '@/shared-types/app-info.json';

// Extract to config/env
const versionInfo = appInfo.versionInfo;

console.log('[server/src/index] versionInfo:', versionInfo);
console.log('[server/src/index] process.argv:', process.argv);
console.log('[server/src/index] VERCEL_URL:', VERCEL_URL);
console.log('[server/src/index] ORIGIN_HOST:', ORIGIN_HOST);
console.log('[server/src/index] DATABASE_URL:', DATABASE_URL);
console.log('[server/src/index] isVercel:', isVercel);
console.log('[server/src/index] isDev:', isDev);

if (!DATABASE_URL) {
  // eslint-disable-next-line no-console, prettier/prettier
  console.error(
    'No DATABASE_URL has provided. Use `set -a; source .env; set +a` in to expose local variables.',
  );
  debugger; // eslint-disable-line no-debugger
  process.exit(1);
}

let app: TExpressApp | undefined;

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
  // Create the server...
  app = createApp();
}

// Shutdown gracefully
async function serverShutDown() {
  console.log('[server/src/index:serverShutDown]');
  await pool.end();
  process.exit(0);
}
process.on('SIGINT', serverShutDown);
process.on('SIGTERM', serverShutDown);

export default app;
