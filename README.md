<!--
 @since 2025.06.07, 19:45
 @changed 2025.06.12, 15:31
-->

# Dynamic list implemented via ExpressJS and React

## Build info (auto-generated)

- Project info: v.0.1.1 / 2025.06.12 15:14:05 +0300

## Resources

- Vercel deployed app: https://takemycode-dynamic-list.vercel.app/
- Repository: https://github.com/lilliputten/takemycode-dynamic-list/

## Workspaces

Application structure:

- [server](server): ExpressJS serverless function app (accessing to local or vercel/neon postgres database).
- [client](client): Static cleint applicaiton built via Vite/React/Tailwind.

## Installation

Just run `pnpm install`

## Dev-servers, build, deploy

Vercel deploy set up as pre-built with old-fashion vercel.json file (v1?), with `builds` data (what doesn't allow to use modern features and builds via `installCommand`, `buildCommand`, etc).

So the only way to deploy is to build locally.

Use command:

```bash
pnpm vercel-publish
```

Which means:

```bash
rm -Rf server/dist client/dist
pnpm --filter server run build
pnpm --filter client run build
vercel --prod
vercel remove --safe --yes takemycode-dynamic-list
```

Run local servers via `pnpm dev`: it will start both client and server apps locally, on ports 5173 and 3000 respectively.

## Vercel configuration

## Database

PostgreSQL database used in the project to store sessions and user data for records orders, checked statuses and filters (per session).

Used local or vercel based neon postgess instance, configured through environment `DATABASE_URL` variable.

See migration files in [server/src/migrations](server/src/migrations):

- [00-init-scheme.sql](server/src/migrations/01-init/00-init-scheme.sql): Scheme initialization.
- [01-connect-pg-simple-table.sql](server/src/migrations/01-init/01-connect-pg-simple-table.sql): Session table, as required by [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple) plugin.
- [02-system-tables.sql](server/src/migrations/01-init/02-system-tables.sql): Maintenance tables (might be used for migrations and other system things).
- [03-data-tables.sql](server/src/migrations/01-init/03-data-tables.sql): Applied tables, stored the filter, sorting order and checked records state.

Create the database via commands:

```bash
psql "$DATABASE_URL" < server/src/migrations/01-init/00-init-scheme.sql
psql "$DATABASE_URL" < server/src/migrations/01-init/01-connect-pg-simple-table.sql
psql "$DATABASE_URL" < server/src/migrations/01-init/02-system-tables.sql
psql "$DATABASE_URL" < server/src/migrations/01-init/03-data-tables.sql
```

See also a script [server/src/migrations/01-init/install-all.sh](server/src/migrations/01-init/install-all.sh).

HINT: Use `set -a; source .env; set +a` in to expose local variables form a local `.env` file. Check the environment variable via: `echo $DATABASE_URL`

## Server sessions

Used:

- [express-session](https://www.npmjs.com/package/express-session#compatible-session-stores)
- [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple)

See `node_modules/connect-pg-simple/table.sql` (copied to [server/src/migrations/01-init/01-connect-pg-simple-table.sql](server/src/migrations/01-init/01-connect-pg-simple-table.sql)).
Environment variable: `SESSION_COOKIE_SECRET`.

## TODO

- [Add a 'Reset order' action button.](https://github.com/lilliputten/takemycode-dynamic-list/issues/19)
- [Optimize incremental data load in `client/src/pages/Home/Home:loadData`.](https://github.com/lilliputten/takemycode-dynamic-list/issues/18)
- Allow to check/uncheck all the records.
- Fix 'infinity' scrollbar to show real loaded/total data relatioin in Firefox. Also, it's impossible to jump to the bottommost items by keyboard, by press End, only by PgDns.
- Add periodical data cleaning code invocation on the server.
- Fix drag-n-drop on mobile devices.
- Reduce action notifications amount (completely remove?).

See other [issues](https://github.com/lilliputten/takemycode-dynamic-list/issues) in the project' repository.

## See also

- [Changelog](CHANGELOG.md)
