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
  app.use(express.json());
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

  app.get('/api/test', async (_req: Request, res: Response) => {
    const data = {
      test: 1,
      a: 1,
    };
    res.setHeader('Content-Type', dataContentType);
    res.end(JSON.stringify(data));
  });

  app.get('/api/get-config', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sessionId = session.id;
    try {
      // Get config from the database
      const config = await getServerConfig();
      console.log('[server/src/express-app.ts:api:get-config]', {
        sessionId,
        session,
        config,
      });
      /* // DEMO: It's possible to store some simple data in the session (TODO: Find solution to calm typescript)
       * // @ts-ignore
       * req.session.test = test;
       */
      const data: APIConfig = {
        sessionId,
        config,
        isDev,
        VERCEL_URL,
        PORT,
        versionInfo,
      };
      res.end(JSON.stringify(data));
    } catch (error) {
      const detail = String(error);
      console.error('[server/src/express-app.ts:api:get-config] caught error', detail, {
        sessionId,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Total records count
  const totalCount = 10;

  // Get data records
  app.get('/api/get-data', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sessionId = session.id;
    // Get parameters...
    const start = Number(req.query.start) || 0;
    let count = Number(req.query.count) || defaultCount;
    try {
      if (start < 0 || start > totalCount) {
        res.status(500).json({ detail: 'Invalid start parameter' });
        return;
      }
      if (count < 0) {
        res.status(500).json({ detail: 'Invalid count parameter' });
        return;
      }
      if (start + count > totalCount) {
        count = totalCount - start;
      }
      console.log('[server/src/express-app.ts:api:get-data]', {
        sessionId,
        count,
        start,
      });
      // TODO: Use data generator, apply filter and sort
      const availCount = totalCount;
      const records = Array.from(Array(count)).map((_none, idx) => {
        const index = start + idx;
        const id = index + 1;
        let text = `Item ${id}`;
        if (isDev) {
          text = `[${index}] ${text}`;
        }
        return { id, text } as TRecord;
      });
      const resData: TRecordsData = {
        start,
        count: records.length,
        records,
        totalCount,
        availCount,
      };
      res.end(JSON.stringify(resData));
    } catch (error) {
      const detail = String(error);
      console.error('[server/src/express-app.ts:api:get-data] caught error', detail, {
        sessionId,
        count,
        start,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Save order
  app.post('/api/save-order', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sessionId = session.id;
    // Get parameters...
    const moveId = Number(req.body.moveId) || 0;
    const overId = Number(req.body.overId) || 0;
    try {
      // Check valid ids
      if (!moveId || !overId) {
        throw new Error('Invalid record identifier(s) passed');
      }
      console.log('[server/src/express-app.ts:api:save-order] data', {
        sessionId,
        moveId,
        overId,
      });
      // TODO: Save to database
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[server/src/express-app.ts:api:save-order] caught error', detail, {
        moveId,
        overId,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Save filter
  app.post('/api/save-filter', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sessionId = session.id;
    // Get parameters...
    const filter = req.body.filter ? String(req.body.filter) : '';
    console.log('[server/src/express-app.ts:api:save-filter] data', {
      sessionId,
      filter,
    });
    try {
      // TODO: Save to database
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[server/src/express-app.ts:api:save-filter] caught error', detail, {
        filter,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Save checked
  app.post('/api/save-checked', async (req: Request, res: Response) => {
    // Get parameters...
    const checked = Boolean(req.body.checked);
    const recordId = Number(req.body.recordId) || 0;
    try {
      // Check valid ids
      if (!recordId) {
        throw new Error('Invalid record identifier passed');
      }
      // Get session
      const session = req.session;
      const sessionId = session.id;
      console.log('[server/src/express-app.ts:api:save-checked] data', {
        sessionId,
        recordId,
        checked,
      });
      // TODO: Save to database
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[server/src/express-app.ts:api:save-checked] caught error', detail, {
        recordId,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready on port ${PORT}.`);
  });

  return app;
}
