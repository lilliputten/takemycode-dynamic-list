import cors from 'cors';
import express from 'express';

const VERCEL_URL = process.env.VERCEL_URL;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
// app.use(express.bodyParser());
// app.use(express.cookieParser());
// app.use(express.session({ secret: `cool beans` }));
// app.use(express.methodOverride());
// CORS middleware
app.use((_req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});
// app.use(app.router);
// app.use(express.static(`public`));

console.log(`Starting a server on port ${PORT} on ${VERCEL_URL}...`);

// app.get('/', (_req, res) => {
//   res.send('Root route');
// });

app.get('/api/test', (_req, res) => {
  const data = {
    a: 1,
    VERCEL_URL,
    PORT,
  };
  // res.send('Got API route');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;
