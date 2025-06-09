/* eslint-disable no-console */

import cors from 'cors';
import express, { Request, Response } from 'express';

import { dataContentType, isDev, PORT, VERCEL_URL } from '@/config/env';
import { getServerConfig } from '@/features/config/actions/getServerConfig';
import { APIConfig } from '@/shared-types/APIConfig';
import appInfo from '@/shared-types/app-info.json';

// Extract to config/env
const versionInfo = appInfo.versionInfo;

export type TExpressApp = ReturnType<typeof express>;

export function createApp() {
  const app = express();

  // Set up the server app...
  app.use(cors());

  // // TODO:
  // app.use(express.bodyParser());
  // app.use(express.cookieParser());
  // app.use(express.session({ secret: `cool beans` }));
  // app.use(express.methodOverride());
  // app.use(app.router);
  // app.use(express.static(`public`));

  // CORS middleware (for local dev server, at least)
  if (isDev) {
    app.use((_req, res, next) => {
      res.header(`Access-Control-Allow-Origin`, `*`);
      res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
      res.header(`Access-Control-Allow-Headers`, `Content-Type`);
      next();
    });
  }

  app.get('/api/config', async (_req: Request, res: Response) => {
    const config = await getServerConfig();
    console.log('[Vserver/src/express-app.ts] config', {
      config,
    });
    const data: APIConfig = {
      config,
      test: 4,
      isDev,
      VERCEL_URL,
      PORT,
      versionInfo,
    };
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', dataContentType);
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

  console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready on port ${PORT}.`);
  });

  return app;
}
