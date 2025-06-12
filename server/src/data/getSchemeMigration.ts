import { pool } from '@/lib/db/postgres';
import { TSchemeMigration } from '@/shared-types/TSchemeMigration';
import { DatabaseError } from '@/shared/errors/DatabaseError';

export async function getSchemeMigration() {
  const res = await pool.query(
    `select * from scheme_migrations where version = (select max(version) from scheme_migrations)`,
  );
  const schemeMigration = res.rows[0] as TSchemeMigration | undefined;
  if (!schemeMigration) {
    throw new DatabaseError('No scheme migration record found');
  }
  return schemeMigration;
}
