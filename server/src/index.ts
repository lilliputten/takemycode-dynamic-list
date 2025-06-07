import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Starting a server on port ${PORT}...`);

app.get('/', (_req, res) => {
  res.send('Root route');
});

app.get('/api', (_req, res) => {
  res.send('API route');
});

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;
