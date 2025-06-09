import { TConfigId } from './TConfigId';

/** `configs` database row type
 * @see `server/migrations/01-init/migration.sql`
 */
export interface TServerConfig {
  id: TConfigId; // serial not null
  version: number; // integer not null
  name?: string; // text
  created_at: Date; // timestamp(3) not null default current_timestamp
  updated_at: Date; // timestamp(3) not null default current_timestamp
}
