import { TRange } from '@/shared-types/TRange';
import { TRangesData } from '@/shared-types/TRangesData';
import { TRecord } from '@/shared-types/TRecord';
import { TSortedRecord } from '@/shared-types/TSortedRecord';
import { TPair } from '@/types/TPair';

function getIdForIndex(index: number) {
  return index + 1;
}

interface TGenerateSortedRecordsParams {
  pairs: TPair[];
  totalCount: number;
  sortedRecords: TSortedRecord[];
  filter?: string;
}

/** Generates records list in the given range (start, count) according to filter and order in sortedRecords
 * @param {TGenerateSortedRecordsParams} params
 * @param {number[][]} params.pairs - Ranges list.
 * @param {number} params.totalCount - Total records count to generate.
 * @param {TSortedRecord[]} params.sortedRecords - Records reordering data.
 * @param {string} params.filter - Filter string (applies only to a record id id, treated as a string).
 */
export function generateSortedRecords(params: TGenerateSortedRecordsParams) {
  const {
    // Parameters
    pairs,
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

  let rearrangedCount = 0;

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
      rearrangedCount++;
    }
  }

  // Get amount of available records and the last (stop) index of the required records portion...
  const availCount = availIds.length;

  // Get range slices...
  const ranges = pairs.map(([start, stop]) => {
    start = Math.min(start, totalCount);
    stop = Math.min(stop + 1, totalCount + 1);
    // Inflate records data from ids...
    const records: TRecord[] = availIds.slice(start, stop).map((id) => {
      const text = `Item ${id}`;
      return { id, text };
    });
    // Create range data...
    const range: TRange = {
      start,
      count: records.length,
      records,
    };
    return range;
  });

  const rangesData: TRangesData = {
    totalCount,
    availCount,
    ranges,
    reordered: !!sortedRecords.length,
    rearrangedCount,
  };

  return rangesData;
}
