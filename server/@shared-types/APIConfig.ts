export interface APIConfig {
  test?: string | number | boolean;
  versionInfo: string;
  isDev?: boolean;
  VERCEL_URL?: string;
  PORT?: string | number;
}
