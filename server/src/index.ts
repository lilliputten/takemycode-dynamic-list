import { APIConfig } from '../@shared-types/APIConfig';
import appInfo from '../@shared-types/app-info.json';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { CONFIG_ID, dataContentType, isDev, isVercel, PORT, VERCEL_URL } from './config/env';
import { getOrCreateConfig } from './features/config/actions/getOrCreateConfig';

// Extract to config/env
const versionInfo = appInfo.versionInfo;

// eslint-disable-next-line no-console
console.log('[server/src/index] versionInfo:', versionInfo);
console.log('[server/src/index] VERCEL_URL:', VERCEL_URL);
console.log('[server/src/index] isVercel:', isVercel);
console.log('[server/src/index] isDev:', isDev);

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
app.use((_req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});

app.get('/api/config', async (_req: Request, res: Response) => {
  const config = await getOrCreateConfig(CONFIG_ID);
  console.log('[server/src/index.ts] config', {
    config,
  });
  debugger;
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

// if (!isVercel || isDev) {
// eslint-disable-next-line no-console
console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ready on port ${PORT}.`);
});
// } else {
//   // eslint-disable-next-line no-console
//   console.log(`Serverless mode (without port listening) on ${VERCEL_URL}...`);
// }

export default app;
