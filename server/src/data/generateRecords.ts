import { recordsCount } from '@/config/data';
import { DatabaseError } from '@/shared/errors/DatabaseError';
import { TPair } from '@/types/TPair';

import { getSessionData } from './getSessionData';
import { getSortedRecords } from './getSortedRecords';
import { generateSortedRecords } from './records/generateSortedRecords';

export async function generateRecords(sid: string, pairs: TPair[]) {
  // const { sid, start, count } = params;
  const { filter } = await getSessionData(sid);
  const sortedRecords = await getSortedRecords(sid);
  try {
    const recordsData = generateSortedRecords({
      pairs,
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
      filter,
      pairs,
    });
    debugger; // eslint-disable-line no-debugger
    return new DatabaseError('Records generation error');
  }
}
