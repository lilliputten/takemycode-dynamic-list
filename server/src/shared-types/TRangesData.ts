import { TRange } from './TRange';

export interface TRangesData {
  /** Total records count in the system (see `server/src/config/data.ts:recordsCount` */
  totalCount: number;
  /** Total records available after filters applied (if any) */
  availCount: number;
  /** Resulting ranges list */
  ranges: TRange[];
  /** Has reordered records */
  reordered: boolean;
  /** Number of rearranged records in the range */
  rearrangedCount: number;
}
