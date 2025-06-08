import { APIConfig } from '@shared-types/APIConfig';
import cors from 'cors';
import express from 'express';

export const isDev = process.env.NODE_ENV === 'development';

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

app.get('/api/config', (_req, res) => {
  const data: APIConfig = {
    isDev,
    VERCEL_URL,
    PORT,
  };
  res.setHeader('Content-Type', dataContentType);
  res.end(JSON.stringify(data));
});

app.get('/api/test', (_req, res) => {
  const data = {
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
