/* eslint-disable no-console */

import ConnectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import express, { Request, Response } from 'express';
import expressSession from 'express-session';

import { dataContentType, isDev, ORIGIN_HOST, PORT, VERCEL_URL } from '@/config/env';
import { pool } from '@/lib/db/postgres';
import { APIConfig } from '@/shared-types/APIConfig';
import appInfo from '@/shared-types/app-info.json';
import { ArgumentsError } from '@/shared/errors/ArgumentsError';

import { recordsCount } from './config/data';
import { generateRecords } from './data/generateRecords';
import { getSchemeMigration } from './data/getSchemeMigration';
import { getServerConfig } from './data/getServerConfig';

// Extract to config/env
const versionInfo = appInfo.versionInfo;

/** Amount of milliseconds in a day */
const dayTicks = 24 * 60 * 60 * 1000;

/** Session validity period (days) */
const sessionValidityDays = isDev ? 1 : 7;

/** Default records count */
const defaultCount = 20;

export type TExpressApp = ReturnType<typeof express>;

function quotePgStr(text: string) {
  return text.replace(/'/g, "''");
}

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
    const sid = session.id;
    try {
      // Get config from the database
      const config = await getServerConfig();
      const schemeMigration = await getSchemeMigration();
      console.log('[express-app:get-config]', {
        sid,
        session,
        config,
        schemeMigration,
      });
      const data: APIConfig = {
        sid,
        config,
        schemeMigration,
        isDev,
        VERCEL_URL,
        PORT,
        versionInfo,
      };
      res.end(JSON.stringify(data));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:get-config] caught error', detail, {
        sid,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Get data records
  app.get('/api/get-data', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sid = session.id;
    // Get parameters...
    const start = Number(req.query.start) || 0;
    const count = Number(req.query.count) || defaultCount;
    try {
      if (start < 0 || start > recordsCount) {
        res.status(500).json({ detail: 'Invalid start parameter' });
        return;
      }
      if (count < 0) {
        res.status(500).json({ detail: 'Invalid count parameter' });
        return;
      }
      const recordsData = await generateRecords({ sid, start, count });
      console.log('[express-app:get-data]', {
        recordsData,
        sid,
        count,
        start,
      });
      res.end(JSON.stringify(recordsData));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:get-data] caught error', detail, {
        sid,
        count,
        start,
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
    const sid = session.id;
    // Get parameters...
    const filter = req.body.filter ? String(req.body.filter) : '';
    const quotedFilter = quotePgStr(filter);
    try {
      // Save filter value to the database...
      await pool.query(`
        insert into session_data (sid, filter) values ('${sid}', '${quotedFilter}')
          on conflict (sid) do update
          set filter='${quotedFilter}'
      `);
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:save-filter] caught error', detail, {
        filter,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Get session data
  app.get('/api/get-session-data', async (req: Request, res: Response) => {
    try {
      // Get session
      const session = req.session;
      const sid = session.id;
      // Save or remove checked value...
      const query = `select * from session_data where sid='${sid}'`;
      const dbRes = await pool.query(query);
      res.end(JSON.stringify(dbRes.rows[0] || {}));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:get-session-data] caught error', detail);
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Save checked record
  app.post('/api/save-sorted-record', async (req: Request, res: Response) => {
    // Get session
    const session = req.session;
    const sid = session.id;
    // Get parameters...
    const recordId = Number(req.body.recordId) || 0;
    const targetId = Number(req.body.targetId) || 0;
    try {
      // Check valid ids
      if (!recordId || !targetId) {
        throw new ArgumentsError('Invalid record identifier(s) passed');
      }
      // Save checked value to the database...
      await pool.query(`
        insert into sorted_records (sid, record_id, target_id) values ('${sid}', ${recordId}, ${targetId})
          on conflict (sid, record_id) do update
          set target_id=${targetId};
      `);
      // NOTE: If sourceIndex > targetIndex then source item should be inserted after target, otherwise before
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:save-sorted-record] caught error', detail, {
        recordId,
        targetId,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Save checked
  app.post('/api/save-checked-record', async (req: Request, res: Response) => {
    // Get parameters...
    const recordId = Number(req.body.recordId) || 0;
    const checked = Boolean(req.body.checked);
    try {
      // Check valid ids
      if (!recordId) {
        throw new ArgumentsError('Invalid record identifier passed');
      }
      // Get session
      const session = req.session;
      const sid = session.id;
      // Save or remove checked value...
      const query = checked
        ? `insert into checked_records (sid, record_id, checked) values ('${sid}', ${recordId}, true) on conflict do nothing`
        : `delete from checked_records where sid='${sid}' and record_id=${recordId};`;
      await pool.query(query);
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:save-checked-record] caught error', detail, {
        recordId,
      });
      debugger; // eslint-disable-line no-debugger
      res.status(500).json({ detail });
      return;
    }
  });

  // Get all checked records
  app.get('/api/get-checked-records', async (req: Request, res: Response) => {
    try {
      // Get session
      const session = req.session;
      const sid = session.id;
      // Save or remove checked value...
      const query = `select * from checked_records where sid='${sid}' and checked=true`;
      const dbRes = await pool.query(query);
      const list = dbRes.rows.map(({ record_id }) => record_id);
      res.end(
        JSON.stringify({
          ok: true,
          list,
        }),
      );
    } catch (error) {
      const detail = String(error);
      console.error('[express-app:get-checked-records] caught error', detail);
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
