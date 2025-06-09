<!--
 @since 2025.06.07, 19:45
 @changed 2025.06.10, 01:03
-->

# Dynamic list implemented via ExpressJS and React

## Build info (auto-generated)

- Project info: v.0.0.3 / 2025.06.08 22:15:53 +0300

## Resources

- Vercel deployed app: https://takemycode-dynamic-list.vercel.app/
- Repository: https://github.com/lilliputten/takemycode-dynamic-list/

## Workspaces

Application structure:

- [server](server): ExpressJS serverless funciton app (accessing to local or vercel/neon postgres database).
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

Used local or vercel based neon postgess instance, configured through environment `DATABASE_URL` variable.

See migration files in [server/src/migrations](server/src/migrations).

## See also

- [Changelog](CHANGELOG.md)
