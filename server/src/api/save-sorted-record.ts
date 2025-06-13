import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';
import { ArgumentsError } from '@/shared/errors/ArgumentsError';

/** API method: save-sorted-record */
export async function saveSortedRecord(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  // Get parameters...
  const recordId = Number(req.body.recordId) || 0;
  const targetId = Number(req.body.targetId) || 0;
  try {
    // Check valid ids
    if (!recordId || !targetId) {
      throw new ArgumentsError('Invalid record identifier(s) passed');
    }
    // Save checked value to the database...
    await pool.query(`
        insert into sorted_records (sid, record_id, target_id) values ('${sid}', ${recordId}, ${targetId})
          on conflict (sid, record_id) do update
          set target_id=${targetId};
      `);
    // NOTE: If sourceIndex > targetIndex then source item should be inserted after target, otherwise before
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:save-sorted-record] caught error', detail, {
      recordId,
      targetId,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
