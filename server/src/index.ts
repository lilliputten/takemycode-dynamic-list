import appInfo from '../../@shared-types/app-info.json';
import { APIConfig } from '@shared-types/APIConfig';
import cors from 'cors';
import express from 'express';

// Extract to config/env
const isDev = process.env.NODE_ENV === 'development';
const versionInfo = appInfo.versionInfo;

// eslint-disable-next-line no-console
console.log('[server/src/index] versionInfo:', versionInfo);

const dataContentType = 'application/json; charset=utf-8';
const VERCEL_URL = process.env.VERCEL_URL;
const PORT = process.env.PORT || 3000;

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

// eslint-disable-next-line no-console
console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);

// DEBUG
app.get('/api/version-info', (_req, res) => {
  const data: APIConfig = {
    versionInfo,
  };
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', dataContentType);
  res.end(JSON.stringify(data));
});

app.get('/api/config', (_req, res) => {
  const data: APIConfig = {
    test: 1,
    versionInfo,
    isDev,
    VERCEL_URL,
    PORT,
  };
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', dataContentType);
  res.end(JSON.stringify(data));
});

app.get('/api/test', (_req, res) => {
  const data = {
    test: 1,
    a: 1,
  };
  res.setHeader('Content-Type', dataContentType);
  res.end(JSON.stringify(data));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ready on port ${PORT}.`);
});

export default app;
