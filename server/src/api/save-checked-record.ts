import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';
import { ArgumentsError } from '@/shared/errors/ArgumentsError';

/** API method: save-checked-record */
export async function saveCheckedRecord(req: Request, res: Response) {
  // Get parameters...
  const recordId = Number(req.body.recordId) || 0;
  const checked = Boolean(req.body.checked);
  try {
    // Check valid ids
    if (!recordId) {
      throw new ArgumentsError('Invalid record identifier passed');
    }
    // Get session
    const session = req.session;
    const sid = session.id;
    // Save or remove checked value...
    const query = checked
      ? `insert into checked_records (sid, record_id, checked) values ('${sid}', ${recordId}, true) on conflict do nothing`
      : `delete from checked_records where sid='${sid}' and record_id=${recordId};`;
    await pool.query(query);
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:save-checked-record] caught error', detail, {
      recordId,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
