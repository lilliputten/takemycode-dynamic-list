-- Create schema
create schema if not exists public;

-- EG: Drop all the schema and tables
-- drop schema public cascade;

-- CreateTable
create table if not exists scheme_migrations (
  id serial not null,
  version integer not null,
  name text,
  created_at timestamp(3) not null default current_timestamp,
  updated_at timestamp(3) not null default current_timestamp,

  constraint scheme_migrations_pkey primary key (id)
);

-- CreateTable
create table if not exists configs (
  id serial not null,
  is_cleaning_now boolean,
  last_cleaned timestamp(3),
  created_at timestamp(3) not null default current_timestamp,
  updated_at timestamp(3) not null default current_timestamp,

  constraint config_pkey primary key (id)
);

-- createindex
create unique index if not exists scheme_migrations_version_key on scheme_migrations(version);

-- Initial migration
insert into scheme_migrations values (1, 1, 'initial migration') on conflict do nothing;

-- Add default config
insert into configs values (1, false, NOW()) on conflict do nothing;
-- EG: Get default config (1)
-- select * from configs where id=1;
-- EG: Update config
-- update configs set is_cleaning_now=true, last_cleaned=NOW() where id=1;

-- EG: Get the latest migration (with the highest version number)
-- select * from scheme_migrations where version = (select max(version) from scheme_migrations);
