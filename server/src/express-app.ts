/* eslint-disable no-console */

import ConnectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import express, { Request, Response } from 'express';
import expressSession from 'express-session';

import { dataContentType, isDev, ORIGIN_HOST, PORT, VERCEL_URL } from '@/config/env';
import { pool } from '@/lib/db/postgres';
import { getServerConfig } from '@/features/config/actions/getServerConfig';
import { APIConfig } from '@/shared-types/APIConfig';
import appInfo from '@/shared-types/app-info.json';
import { TRecord } from '@/shared-types/TRecord';
import { TRecordsData } from '@/shared-types/TRecordsData';

// Extract to config/env
const versionInfo = appInfo.versionInfo;

/** Amount of milliseconds in a day */
const dayTicks = 24 * 60 * 60 * 1000;

/** Session validity period (days) */
const sessionValidityDays = isDev ? 1 : 7;

/** Default records count */
const defaultCount = 20;

export type TExpressApp = ReturnType<typeof express>;

export function createApp() {
  const app = express();

  /* // TODO: Also add the following express extensions (if/when needed):
   * - express.bodyParser
   * - express.cookieParser
   * - express.methodOverride
   * - express.static
   * - app.router
   */

  // Set up the server app...
  const corsOptions = {
    origin: ORIGIN_HOST,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204, // some legacy browsers choke on 204
  };
  const corsHandler = cors(corsOptions);
  app.use(corsHandler);
  app.options('*', corsHandler);

  // Configure session
  const SessionStoreFactory = ConnectPgSimple(expressSession);
  const sessionStore = new SessionStoreFactory({
    // @see https://www.npmjs.com/package/connect-pg-simple
    pool,
  });
  app.use(
    expressSession({
      // @see https://www.npmjs.com/package/express-session
      store: sessionStore,
      secret: process.env.SESSION_COOKIE_SECRET || 'some-secret',
      resave: false,
      cookie: {
        // secure: true,
        maxAge: sessionValidityDays * dayTicks, // Session validity period (days)
      },
    }),
  );

  // Default request processing
  app.use((_req, res, next) => {
    /* // CORS headers (unused: see cors settings above)
     * res.header('Access-Control-Allow-Credentials', 'true');
     * res.header('Access-Control-Allow-Origin', ORIGIN_HOST);
     * res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     * res.header('Access-Control-Allow-Headers', 'Content-Type');
     */
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', dataContentType);
    next();
  });

  app.get('/api/config', async (req: Request, res: Response) => {
    const test = 5;
    // Check session
    const session = req.session;
    const sessionId = session.id;
    // Get config from the database
    const config = await getServerConfig();
    console.log('[server/src/express-app.ts] config', {
      sessionId,
      session,
      config,
    });
    // DEMO: It's possible to store some simple data in the session (TODO: Find solution to calm typescript)
    // @ts-ignore
    req.session.test = test;
    const data: APIConfig = {
      sessionId,
      config,
      test,
      isDev,
      VERCEL_URL,
      PORT,
      versionInfo,
    };
    res.end(JSON.stringify(data));
  });

  app.get('/api/test', async (_req: Request, res: Response) => {
    const data = {
      test: 1,
      a: 1,
    };
    res.setHeader('Content-Type', dataContentType);
    res.end(JSON.stringify(data));
  });

  // Get data records
  app.get('/api/data', async (req: Request, res: Response) => {
    // Get parameters...
    const count = Number(req.query.count) || defaultCount;
    const start = Number(req.query.start) || 0;
    // Check session
    const session = req.session;
    const sessionId = session.id;
    // Get config from the database
    const config = await getServerConfig();
    console.log('[server/src/express-app.ts] data', {
      count,
      start,
      sessionId,
      session,
      config,
    });
    // TODO: Use data generator, apply filter and sort
    const totalCount = 50;
    const availCount = totalCount;
    const records = Array.from(Array(count)).map((_none, idx) => {
      const id = start + idx + 1;
      const text = `Item ${id}`;
      return { id, text } as TRecord;
    });
    const resData: TRecordsData = {
      totalCount,
      availCount,
      start,
      records,
    };
    res.end(JSON.stringify(resData));
  });

  console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready on port ${PORT}.`);
  });

  return app;
}
