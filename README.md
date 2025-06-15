<!--
 @since 2025.06.07, 19:45
 @changed 2025.06.14, 21:06
-->

# Sample monorepository dynamic list app

The applicaiton is implemented via ExpressJS, React, Vite, TS, and Tailwind, and deployed to Vercel.

## Build info (auto-generated)

- Project info: v.0.1.2 / 2025.06.16 01:24:34 +0300

## Resources

- Vercel deployed app: https://takemycode-dynamic-list.vercel.app/
- Repository: https://github.com/lilliputten/takemycode-dynamic-list/

## Workspaces

The application is organized as a mono repository with a following structure:

- [server](server): ExpressJS serverless function app. It accesses a local (dev) or vercel/neon hosted (prod) postgres database (see [database](#database) section below).
- [client](client): Static client applicaiton built via Vite/React/TS/Tailwind.

Core resources:

- Vercel deploy configuration file: [vercel.json](vercel.json). See [vercel deploy configuration](#vercel-deploy-integration) section.
- Server entry point: [server/src/index.ts](server/src/index.ts). This script could be run with `--migration` argument to update database schema (not implemented yet). Key `--dev` is used to run in a development mode (the same as with `NODE_ENV=development` environment variable).
- Server API methods: [server/src/api](server/src/api).
- Server-side records generator function (with filtering and sort): [server/src/data/records/generateSortedRecords.ts](server/src/data/records/generateSortedRecords.ts).
- Server creation: [server/src/server](server/src/server).
- Client entry point (react app): [client/src/main.tsx](client/src/main.tsx).
- Client template: [client/index.html](client/index.html).
- Client-side core data-handling component: [client/src/pages/Home/Home.tsx](client/src/pages/Home/Home.tsx).

## Installation

Just run `pnpm install` to install all the dependencies for both workspaces.

Set up a local database as described in the [database](#database) section below.

Set up local [environent variables](#environent-variables).

## Local development

Run both local servers via a command:

```bash
pnpm dev
```

-- It will start both client and server apps locally, on ports 5173 and 3000 respectively.

It's possible to run servers separately, via:

```bash
pnpm --filter server run dev
pnpm --filter client run dev
```

Or:

```bash
pnpm dev-server
pnpm dev-client
```

## Maintenance tools

Run prettier and all the linters for both workspaces:

```bash
pnpm check-all
```

Run tests:

```bash
pnpm test
```

## Vercel deploy integration

Vercel deploy set up as pre-built with old-fashion [vercel.json](vercel.json) configuration file (v1?), with `builds` data (what doesn't allow to use modern features and builds via `installCommand`, `buildCommand`, etc). So the only way to deploy is to build locally in deploy this pre-built code.

Run a command to clean, build, deploy and remove obsolete deploys from vercel:

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

## Environent variables

- `DATABASE_URL`: Postgress connection string (`postgres:...`), **REQUIRED**.
- `SESSION_COOKIE_SECRET`: A random value to seed session generator, **REQUIRED**.
- `VERCEL_URL`: A vercel host name (FQDN, automaticallly passed on the deployment server).
- `PORT`: Server lisntening port address (default: 3000).
- `NODE_ENV`: Devlopment/production running mode.
- `CONFIG_ID`: Config id (a configs database record id, default: 1).
- `DEV_CLIENT_HOST`: Client host for development mode (used to set up CORS headers, default: `http://localhost:5173`). Used `VERCEL_URL` if has been provided.

The variables could be provided by the environment or in the local `.env` file (see a template in [server/.env.SAMPLE](server/.env.SAMPLE); and there no specific variables are required for the client app).

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

HINT: Use `set -a; source .env; set +a` in  your shell to expose local variables form a local `.env` file. Check the environment variable via: `echo $DATABASE_URL` (see [environent variables](#environent-variables) section).

## Server sessions

Used client libraries:

- [express-session](https://www.npmjs.com/package/express-session#compatible-session-stores)
- [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple)

See `node_modules/connect-pg-simple/table.sql` (copied to [server/src/migrations/01-init/01-connect-pg-simple-table.sql](server/src/migrations/01-init/01-connect-pg-simple-table.sql)).

Environment variable `SESSION_COOKIE_SECRET` (see [environent variables](#environent-variables) section) is required.

## TODO

- Allow to check/uncheck all the records.
- Fix 'infinity' scrollbar to show real loaded/total data relation in in Firefox. Also, it's impossible to jump to the bottommost items by keyboard, by press End, only by PgDns.
- Add periodical data cleaning code invocation on the server.

See other [issues](https://github.com/lilliputten/takemycode-dynamic-list/issues) in the project' repository.

## See also

- [Change log](CHANGELOG.md)
