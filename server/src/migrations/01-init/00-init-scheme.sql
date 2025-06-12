-- Drop all the schema and tables (cleanup the database)
drop schema public cascade;

-- Create database schema
create schema if not exists public;
