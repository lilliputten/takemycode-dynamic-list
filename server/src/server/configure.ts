import ConnectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import express, { Express } from 'express';
import expressSession from 'express-session';

import { dataContentType, isDev, ORIGIN_HOST } from '@/config/env';
import { pool } from '@/lib/db/postgres';

/** Amount of milliseconds in a day */
const dayTicks = 24 * 60 * 60 * 1000;

/** Session validity period (days) */
const sessionValidityDays = isDev ? 1 : 7;

/** Set up the server app */
export function configure(app: Express) {
  // JSON parser
  app.use(express.json());

  // Setup CORS
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
        // secure: true, // Disable access from inside the browser
        maxAge: sessionValidityDays * dayTicks, // Session validity period (days)
      },
    }),
  );

  // Default request
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
}
