import { Request, Response } from 'express';

import { pool } from '@/lib/db/postgres';
import { quotePgStr } from '@/lib/helpers/quotePgStr';

/** API method: save-filter */
export async function saveFilter(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  // Get parameters...
  const filter = req.body.filter ? String(req.body.filter) : '';
  const quotedFilter = quotePgStr(filter);
  try {
    // Save filter value to the database...
    await pool.query(`
        insert into session_data (sid, filter) values ('${sid}', '${quotedFilter}')
          on conflict (sid) do update
          set filter='${quotedFilter}'
      `);
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:save-filter] caught error', detail, {
      filter,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
