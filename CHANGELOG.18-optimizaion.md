- [Issue #18: Optimize data processing on both client and server](https://github.com/lilliputten/takemycode-dynamic-list/issues/18)

- Issue #18: Optimized data generation on server: using only ids to filter and re-order the data, and only final ids list is converting to full-fledge records data (id & text). See `src/data/records/generateSortedRecords.ts`.
- Issue #18: Added jest to the client workspace.
- Issue #18: Added helpers to work with clamps (will be used in loading data optimized algorithm).
- Issue #18: Refactored server code & client.
- Issue #18: Added optimization for data loading (using a postponed queue and range clamps joins).

