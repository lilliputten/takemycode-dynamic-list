import { isDev } from './env';

// TODO: Get the value from the environment
export const recordsCount =
  process.env.recordsCount && !isNaN(Number(process.env.recordsCount))
    ? Number(process.env.recordsCount)
    : isDev
      ? 10000
      : 1000000;
