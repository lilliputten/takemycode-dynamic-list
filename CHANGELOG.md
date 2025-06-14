<!--
 @since 2025.06.08
 @changed 2025.06.14, 05:34
-->

# CHANGELOG

## [v.0.1.2](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.1.2) - 2025.06.13

- [Issue #18: Optimize data processing on both client and server](https://github.com/lilliputten/takemycode-dynamic-list/issues/18)

- Optimized data generation on server: using only ids to filter and re-order the data, and only final ids list is converting to full-fledge records data (id & text). See `src/data/records/generateSortedRecords.ts`.
- Added jest to the client workspace.
- Added helpers to work with clamps (will be used in loading data optimized algorithm).
- Refactored server code & client.
- Added optimization for data loading (using a postponed queue and range clamps joins).
- Fixed mobile drag-n-drop issues (using @dnd-kit's MouseSensor and TouchSensor instead of PointerSensor).
- Using pair of indices instead of start and count data. Added ability to load several record ranges at once. Changed the way of handling requested clamps: loading all the requested chunks at the moment.
- Added a "Reset order" button.

See also:

- [Compare](https://github.com/lilliputten/takemycode-dynamic-list/compare/v.0.1.1...v.0.1.2)

## [v.0.1.1](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.1.1) - 2025.06.12

[Issue #11: Create simple data load routine on the client](https://github.com/lilliputten/takemycode-dynamic-list/issues/11)

- Implemented basic data load (on both server & client).
- Loading splash, basic data render using react-window.
- Incremental records loading (via `react-window-infinite-loader`), records toggling.

[Issue #12: Implement records drag and drop on the client](https://github.com/lilliputten/takemycode-dynamic-list/issues/12)

- Added sortable support for the records list (using `@dnd-kit`).

[Issue #15: Create toolbar panel with filters and controls](https://github.com/lilliputten/takemycode-dynamic-list/issues/15)

- Added toast notifications.
- Added toolbar panel with an indicator, a filter and action buttons.

[Issue #16: Upgrade server database scheme to handle filter and sort order](https://github.com/lilliputten/takemycode-dynamic-list/issues/16)

- Added server api methods (without actual data save) and client handlers for save order, checkbox and filter data.
- Migrations divided to a set of separated sql files, added jest (in the server workspace), added tests for records generation code.
- The investigation of the error related to the very long scrolls has been finished so far just decreased row sizes).

[Issue #3: Create basic application layout (nav bar with control buttons & filters & adaptive layout)](https://github.com/lilliputten/takemycode-dynamic-list/issues/3)

- Created a simple adaptive layout.

[Issue #8: Add server sessions](https://github.com/lilliputten/takemycode-dynamic-list/issues/8)

- Added server sessions, fixed cors settings on client and server.

See also:

- [Compare](https://github.com/lilliputten/takemycode-dynamic-list/compare/v.0.1.0...v.0.1.1)

## [v.0.1.0](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.1.0) - 2025.06.10

[Issue #4: Add server database & prisma types](https://github.com/lilliputten/takemycode-dynamic-list/issues/4)

- Failed attempts to deploy prisma on vercel monorepo, to inject prisma in project.
- Implemented server data storage using raw postgres connection (pg).

See also:

- [Compare](https://github.com/lilliputten/takemycode-dynamic-list/compare/v.0.0.2...v.0.1.0)

## [v.0.0.2](https://github.com/lilliputten/takemycode-dynamic-list/releases/tag/v.0.0.2) - 2025.06.08

[Issue #1: Set up basic project environment](https://github.com/lilliputten/takemycode-dynamic-list/issues/1)

- Configured multi-workspace repository for client and server vercel subprojects.
- Added server cors mode, removed dist folders from the repository, checking client vercel url environment variable passing (in progress), added conditional strict mode wrapper (only in dev mode and if `VITE_OMIT_STRICT_MODE_WRAP` environment variable has been set), added `.env` client environment variables file template (`client/.env.SAMPLE`), added api route request in the `App.tsx`. Removed unused files.
- Allowed to use absolute include paths.
- Added shared types (`APIConfig`), added `config` api route, created particular type-check commands for both client and server workspaces.
- Added maintenance scripts (`.utils`). Provided `versionInfo` date for both server and client (app-info).
- Added shared types, re-implemented server package build via esbuild.
- Client: Added tailwind (with demo markups), added router & pages, removed unused dependencies.

(Initial version.)