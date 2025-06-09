<!--
 @since 2025.05.02
 @changed 2025.06.10, 01:07
-->

# CHANGELOG

## [v.0.1.0](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.1.0) - 2025.06.10

- Failed attempts to deploy prisma on vercel monorepo, to inject prisma in project.
- Implemented server data storage using raw postgres connection (pg).

See also:

- [Issue #4: Add server database & prisma types](https://github.com/lilliputten/takemycode-dynamic-list/issues/4)
- [Compare](https://github.com/lilliputten/takemycode-dynamic-list/compare/v.0.0.2...v.0.1.0)

## [v.0.0.2](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.0.2) - 2025.06.08

- Configured multi-workspace repository for client and server vercel subprojects.
- Added server cors mode, removed dist folders from the repository, checking client vercel url environment variable passing (in progress), added conditional strict mode wrapper (only in dev mode and if `VITE_OMIT_STRICT_MODE_WRAP` environment variable has been set), added `.env` client environment variables file template (`client/.env.SAMPLE`), added api route request in the `App.tsx`. Removed unused files.
- Allowed to use absolute include paths.
- Added shared types (`APIConfig`), added `config` api route, created particular type-check commands for both client and server workspaces.
- Added maintenance scripts (`.utils`). Provided `versionInfo` date for both server and client (app-info).
- Added shared types, re-implemented server package build via esbuild.
- Client: Added tailwind (with demo markups), added router & pages, removed unused dependencies.

See also:

- [Issue #1: Set up basic project environment](https://github.com/lilliputten/takemycode-dynamic-list/issues/1)
- [Compare](https://github.com/lilliputten/takemycode-dynamic-list/compare/v.0.0.0...v.0.0.2)
