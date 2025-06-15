import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';

/** API method: get-checked-records */
export async function getCheckedRecords(req: Request, res: Response) {
  try {
    // Get session
    const session = req.session;
    const sid = session.id;
    // Save or remove checked value...
    const query = `select * from checked_records where sid='${sid}' and checked=true`;
    const dbRes = await pool.query(query);
    const list = dbRes.rows.map(({ record_id }) => record_id);
    res.end(
      JSON.stringify({
        ok: true,
        list,
      }),
    );
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[get-checked-records] caught error', detail);
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
