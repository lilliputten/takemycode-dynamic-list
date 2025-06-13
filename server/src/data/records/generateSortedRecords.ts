import { TRecord } from '@/shared-types/TRecord';
import { TRecordsData } from '@/shared-types/TRecordsData';
import { TSortedRecord } from '@/shared-types/TSortedRecord';

function getIdForIndex(index: number) {
  return index + 1;
}

function createRecordById(id: number) {
  const text = `Item ${id}`;
  return { id, text } as TRecord;
}

interface TGenerateSortedRecordsParams {
  start: number;
  count: number;
  totalCount: number;
  sortedRecords: TSortedRecord[];
  filter?: string;
}

/** Generates records list in the given range (start, count) according to filter and order in sortedRecords
 * @param {TGenerateSortedRecordsParams} params
 * @param {number} params.start - Range start.
 * @param {number} params.count - Range width.
 * @param {number} params.totalCount - Total records count to generate.
 * @param {TSortedRecord[]} params.sortedRecords - Records reordering data.
 * @param {string} params.filter - Filter string (applies only to a record id id, treated as a string).
 */
export function generateSortedRecords(params: TGenerateSortedRecordsParams) {
  const {
    // Parameters
    start,
    count,
    totalCount,
    sortedRecords,
    filter,
  } = params;

  // Create filter lambda
  const filterCmp = filter?.toLowerCase();
  const isProtoPassFilter = !filterCmp
    ? () => true
    : (id: number) => String(id).includes(filterCmp);

  // Generate only ids first and only later convert them to real data (use more lightweight data)
  const availIds: number[] = [];
  for (let index = 0; index < totalCount; index++) {
    const id = getIdForIndex(index);
    // Check if pass filter?
    if (!isProtoPassFilter(id)) {
      continue;
    }
    availIds.push(id);
  }

  // Sort records...
  for (const { record_id, target_id } of sortedRecords) {
    if (record_id === target_id) {
      // Do nothing if ids are the same
      continue;
    }
    // Swap items if both of them are available. Don't throw an error if no
    // items found: we're looking in the filtered data, something might be
    // missed, that's ok.
    const recordIndex = availIds.indexOf(record_id);
    const targetIndex = availIds.indexOf(target_id);
    if (recordIndex !== -1 && targetIndex !== -1) {
      availIds.splice(targetIndex, 0, availIds.splice(recordIndex, 1)[0]);
    }
  }

  // Get amount of available records and the last (stop) index of the required records portion...
  const availCount = availIds.length;
  const stop = Math.min(availCount, start + count);

  // Get slice...
  const records = availIds.slice(start, stop).map(createRecordById);

  const recordsData: TRecordsData = {
    start,
    count: records.length,
    records,
    totalCount,
    availCount,
  };

  return recordsData;
}
