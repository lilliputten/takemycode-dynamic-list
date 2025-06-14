import { Request, Response } from 'express';

import { getErrorText } from '@/lib/helpers/strings';
import { generateRecords } from '@/data/generateRecords';
import { ArgumentsError } from '@/shared/errors/ArgumentsError';
import { TPair } from '@/types/TPair';

/** API method: get-data */
export async function getData(req: Request, res: Response) {
  // Get session
  const session = req.session;
  const sid = session.id;
  // Get parameters...
  // Expecting json-style 2-dimension list (eg, `[[1,2],[3,4]]`)
  const pairsStr = String(req.query.pairs);
  let pairs: TPair[] | undefined;
  try {
    pairs = JSON.parse(pairsStr) as TPair[];
    if (!Array.isArray(pairs) || !Array.isArray(pairs[0])) {
      throw new ArgumentsError(
        'Expected index pairs list, like [[1,2],[3,4]], but got: ' + pairsStr,
      );
    }
    // Check all pairs...
    for (const pair of pairs) {
      if (!Array.isArray(pair)) {
        throw new ArgumentsError('Got invalid indices pair: ' + pair + ', in: ' + pairsStr);
      }
      const [start, stop] = pair;
      if (isNaN(start)) {
        throw new ArgumentsError('Got invalid stop index: ' + start + ', in: ' + pairsStr);
      }
      if (isNaN(stop)) {
        throw new ArgumentsError('Got invalid tartindex: ' + stop + ', in: ' + pairsStr);
      }
      if (start < 0) {
        throw new ArgumentsError('Start index should positive: ' + start + ', in: ' + pairsStr);
      }
      if (stop < 0) {
        throw new ArgumentsError('Stop index should positive: ' + stop + ', in: ' + pairsStr);
      }
      if (start > stop) {
        throw new ArgumentsError('Start index should be less that stop, in: ' + pairsStr);
      }
    }
  } catch (error) {
    const detail = 'Parameters error: ' + getErrorText(error);
    // eslint-disable-next-line no-console
    console.error('[api:get-data] caught error', detail, {
      sid,
      pairsStr,
      pairs,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
  try {
    const resData = await generateRecords(sid, pairs);
    res.end(JSON.stringify(resData));
  } catch (error) {
    const detail = 'Data processing error: ' + getErrorText(error);
    // eslint-disable-next-line no-console
    console.error('[api:get-data] caught error', detail, {
      sid,
      pairs,
    });
    debugger; // eslint-disable-line no-debugger
    res.status(500).json({ detail });
    return;
  }
}
