import { TRecord } from './TRecord';

export interface TRecordsData {
  start: number;
  count: number;
  records: TRecord[];
  totalCount: number;
  availCount: number;
}
