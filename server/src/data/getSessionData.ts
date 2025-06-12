import { pool } from '@/lib/db/postgres';
import { TServerSessionData } from '@/shared-types/TServerSessionData';

export async function getSessionData(sid: string) {
  // Save or remove checked value...
  const query = `select * from session_data where sid='${sid}'`;
  const dbRes = await pool.query(query);
  return (dbRes.rows[0] || {}) as TServerSessionData;
}
