import { Express } from 'express';

import { getCheckedRecords } from './get-checked-records';
import { getConfig } from './get-config';
import { getData } from './get-data';
import { getSessionData } from './get-session-data';
import { resetSortedRecords } from './reset-sorted-records';
import { saveCheckedRecord } from './save-checked-record';
import { saveFilter } from './save-filter';
import { saveSortedRecord } from './save-sorted-record';
import { test } from './test';

export function api(app: Express) {
  app.get('/api/test', test);

  app.get('/api/get-config', getConfig);

  // Get data records
  app.get('/api/get-data', getData);

  // Save filter
  app.post('/api/save-filter', saveFilter);

  // Get session data
  app.get('/api/get-session-data', getSessionData);

  // Save checked record
  app.post('/api/save-sorted-record', saveSortedRecord);

  // Save checked state for a record
  app.post('/api/save-checked-record', saveCheckedRecord);

  // Save checked state for a record
  app.post('/api/reset-sorted-records', resetSortedRecords);

  // Get all checked records
  app.get('/api/get-checked-records', getCheckedRecords);
}
