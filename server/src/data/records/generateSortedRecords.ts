import { TRecord } from '@/shared-types/TRecord';
import { TRecordsData } from '@/shared-types/TRecordsData';
import { TSortedRecord } from '@/shared-types/TSortedRecord';

import { generateOneRecord } from './generateOneRecord';

interface TGenerateSortedRecordsParams {
  start: number;
  count: number;
  totalCount: number;
  sortedRecords: TSortedRecord[];
  filter?: string;
}

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
  const isRecordPassFilter = (record: TRecord) =>
    !filterCmp || record.text.toLowerCase().includes(filterCmp);

  // Generate all the available records...
  const availRecords: TRecord[] = [];
  for (let realIdx = 0; realIdx < totalCount; realIdx++) {
    const record = generateOneRecord(realIdx);
    // Check if pass filter?
    if (!isRecordPassFilter(record)) {
      continue;
    }
    availRecords.push(record);
  }

  // Sort records...
  for (const { record_id, target_id } of sortedRecords) {
    if (record_id === target_id) {
      // Do nothing if ids are the same
      continue;
    }
    const recordIndex = availRecords.findIndex(({ id }) => id === record_id);
    const targetIndex = availRecords.findIndex(({ id }) => id === target_id);
    if (recordIndex === -1 || targetIndex === -1) {
      // Don't throw an error: we're looking in the filtered data, something might be missed, that's ok.
      continue;
    }
    // Swap records
    availRecords.splice(targetIndex, 0, availRecords.splice(recordIndex, 1)[0]);
  }

  // Get amount of available records and the last (stop) index of the required records portion...
  const availCount = availRecords.length;
  const stop = Math.min(availCount, start + count);

  // Get slice...
  const records = availRecords.slice(start, stop);

  const recordsData: TRecordsData = {
    start,
    count: records.length,
    records,
    totalCount,
    availCount,
  };

  return recordsData;
}
