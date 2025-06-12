import { pool } from '@/lib/db/postgres';
import { TSortedRecord } from '@/shared-types/TSortedRecord';

export async function getSortedRecords(sid: string) {
  const res = await pool.query(`
    select * from sorted_records
    where sid='${sid}'
    order by record_id asc
  `);
  const items = res.rows as TSortedRecord[];
  return items;
}
