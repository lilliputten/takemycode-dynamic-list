import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';

/** API method: get-session-data */
export async function getSessionData(req: Request, res: Response) {
  try {
    // Get session
    const session = req.session;
    const sid = session.id;
    // Save or remove checked value...
    const query = `select * from session_data where sid='${sid}'`;
    const dbRes = await pool.query(query);
    res.end(JSON.stringify(dbRes.rows[0] || {}));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:get-session-data] caught error', detail);
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
