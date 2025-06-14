/* eslint-disable no-console */

import express from 'express';

import { PORT, VERCEL_URL } from '@/config/env';
import { pool } from '@/lib/db/postgres';
import { api } from '@/api';

import { configure } from './configure';

/** Creates a server instance */
export function server() {
  console.log(`[server] Creating a server...`);
  const app = express();

  configure(app);

  api(app);

  console.log(`[server] Starting a server on port ${PORT} on ${VERCEL_URL || 'localhost'}...`);

  app.listen(PORT, () => {
    console.log(`[server] Server ready on port ${PORT}.`);
  });

  return app;
}

/** Graceflly shutdown the server */
export async function serverShutDown() {
  console.log('[server:serverShutDown]');
  await pool.end();
  process.exit(0);
}
