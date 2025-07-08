import { isDev } from './env';

// TODO: Get the value from the environment
export const RECORDS_COUNT =
  process.env.RECORDS_COUNT && !isNaN(Number(process.env.RECORDS_COUNT))
    ? Number(process.env.recordsCount)
    : isDev
      ? 1000
      : 100000;
