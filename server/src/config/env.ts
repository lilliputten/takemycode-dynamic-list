import dotenv from 'dotenv';

dotenv.config();

export const dataContentType = 'application/json; charset=utf-8';
export const VERCEL_URL = process.env.VERCEL_URL || '';
export const PORT = process.env.PORT || 3000;

export const DATABASE_URL = process.env.DATABASE_URL || '';

export const isVercel = !!VERCEL_URL;
export const isDev = process.env.NODE_ENV === 'development';

/** Configuration slot id */
export const CONFIG_ID =
  process.env.CONFIG_ID && !isNaN(Number(process.env.CONFIG_ID))
    ? Number(process.env.CONFIG_ID)
    : 1;
