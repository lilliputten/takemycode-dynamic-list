import { Request, Response } from 'express';

import { defaultCount, recordsCount } from '@/config/data';
import { generateRecords } from '@/data/generateRecords';

/** API method: get-data */
export async function getData(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  // Get parameters...
  const start = Number(req.query.start) || 0;
  const count = Number(req.query.count) || defaultCount;
  try {
    if (start < 0 || start > recordsCount) {
      res.status(500).json({ detail: 'Invalid start parameter' });
      return;
    }
    if (count < 0) {
      res.status(500).json({ detail: 'Invalid count parameter' });
      return;
    }
    const recordsData = await generateRecords({ sid, start, count });
    res.end(JSON.stringify(recordsData));
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[api:get-data] caught error', detail, {
      sid,
      count,
      start,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
