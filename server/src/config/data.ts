import { isDev } from './env';

/** Default records count */
export const defaultCount = 20;

// TODO: Get the value from the environment
export const recordsCount =
  process.env.recordsCount && !isNaN(Number(process.env.recordsCount))
    ? Number(process.env.recordsCount)
    : isDev
      ? 10000
      : 1000000;
