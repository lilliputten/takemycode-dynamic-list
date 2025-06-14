import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';

/** API method: reset-checked-records */
export async function resetCheckedRecords(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  try {
    // Save checked value to the database...
    await pool.query(`delete from checked_records where sid='${sid}'`);
    // NOTE: If sourceIndex > targetIndex then source item should be inserted after target, otherwise before
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:reset-checked-records] caught error', detail, {
      sid,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
