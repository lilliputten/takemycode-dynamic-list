// import { DatabaseError } from 'pg';
import { CONFIG_ID } from '@/config/env';
import { pool } from '@/lib/db/postgres';
import { TServerConfig } from '@/shared-types/TServerConfig';
import { DatabaseError } from '@/shared/errors/DatabaseError';

export async function getServerConfig() {
  const res = await pool.query(`select * from configs where id=${CONFIG_ID}`);
  const row = res.rows[0] as TServerConfig | undefined;
  /* console.log('[migrate:getServerConfig]', {
   *   CONFIG_ID,
   *   res,
   * });
   */
  if (!row) {
    throw new DatabaseError('No config record has found');
  }
  return row;
}
