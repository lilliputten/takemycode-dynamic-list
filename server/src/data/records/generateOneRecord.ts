import { TRecord } from '@/shared-types/TRecord';

export function generateOneRecord(index: number) {
  const id = index + 1;
  const text = `Item ${id}`;
  return { id, text } as TRecord;
}
