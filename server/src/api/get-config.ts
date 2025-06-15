import { Request, Response } from 'express';

import { isDev, PORT, VERCEL_URL } from '@/config/env';
import { getSchemeMigration } from '@/data/getSchemeMigration';
import { getServerConfig } from '@/data/getServerConfig';
import { APIConfig } from '@/shared-types/APIConfig';
import appInfo from '@/shared-types/app-info.json';

/** API method: get-config */
export async function getConfig(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  try {
    // Get config from the database
    const config = await getServerConfig();
    const schemeMigration = await getSchemeMigration();
    // eslint-disable-next-line no-console
    console.log('[get-config:getConfig]', {
      sid,
      session,
      config,
      schemeMigration,
    });
    const versionInfo = appInfo.versionInfo;
    const data: APIConfig = {
      sid,
      config,
      schemeMigration,
      isDev,
      VERCEL_URL,
      PORT,
      versionInfo,
    };
    res.end(JSON.stringify(data));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[get-config:getConfig] caught error', detail, {
      sid,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
