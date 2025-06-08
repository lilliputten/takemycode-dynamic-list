export const dataContentType = 'application/json; charset=utf-8';
export const VERCEL_URL = process.env.VERCEL_URL;
export const PORT = process.env.PORT || 3000;

/** Configuration slot id */
export const CONFIG_ID =
  process.env.CONFIG_ID && !isNaN(Number(process.env.CONFIG_ID))
    ? Number(process.env.CONFIG_ID)
    : 1;
