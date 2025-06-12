import { recordsCount } from '@/config/data';
import { DatabaseError } from '@/shared/errors/DatabaseError';

import { getSessionData } from './getSessionData';
import { getSortedRecords } from './getSortedRecords';
import { generateSortedRecords } from './records/generateSortedRecords';

interface TParams {
  sid: string;
  start: number;
  count: number;
}

export async function generateRecords(params: TParams) {
  const { sid, start, count } = params;
  const { filter } = await getSessionData(sid);
  const sortedRecords = await getSortedRecords(sid);
  try {
    const recordsData = generateSortedRecords({
      start,
      count,
      totalCount: recordsCount,
      sortedRecords,
      filter,
    });
    return recordsData;
  } catch (error) {
    const detail = String(error);
    // eslint-disable-next-line no-console
    console.error('[generateRecords] caught error', detail, {
      sid,
      count,
      start,
    });
    debugger; // eslint-disable-line no-debugger
    return new DatabaseError('Records generation error');
  }
}
