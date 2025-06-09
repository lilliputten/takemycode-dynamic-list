/** `scheme_migrations` database row type
 * @see `server/migrations/01-init/migration.sql`
 */
export interface TSchemeMigrations {
  id: number; // serial not null
  is_cleaning_now?: boolean; // boolean
  last_cleaned?: Date; // timestamp(3)
  created_at: Date; // timestamp(3) not null default current_timestamp
  updated_at: Date; // timestamp(3) not null default current_timestamp
}
