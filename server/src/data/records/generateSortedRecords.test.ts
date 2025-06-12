/** @jest-environment node */

import { generateSortedRecords } from './generateSortedRecords';

const sid = 'xxx';

test('Should create {count} records even there are more records', () => {
  const res = generateSortedRecords({
    start: 0,
    count: 2,
    totalCount: 10,
    sortedRecords: [],
    filter: '',
  });
  expect(typeof res).toBe('object');
  expect(res.records.length).toBe(2);
});

test('Should create records from {start}', () => {
  const res = generateSortedRecords({
    start: 2,
    count: 2,
    totalCount: 10,
    sortedRecords: [],
    filter: '',
  });
  expect(res.records[0].id).toBe(3);
});

test('Should filter records', () => {
  const res = generateSortedRecords({
    start: 0,
    count: 10,
    totalCount: 10,
    sortedRecords: [],
    filter: '1',
  });
  expect(res.records.length).toBe(2);
  expect(res.records[0].id).toBe(1);
  expect(res.records[1].id).toBe(10);
});

test('Should provide correct availCount', () => {
  const res = generateSortedRecords({
    start: 0,
    count: 2,
    totalCount: 30,
    sortedRecords: [],
    filter: '5',
  });
  expect(res.records.length).toBe(2);
  expect(res.availCount).toBe(3); // There are 3 records with '5' below 30: 5, 15, 25
});

test('Should sort records', () => {
  const res = generateSortedRecords({
    start: 0,
    count: 2,
    totalCount: 10,
    sortedRecords: [
      {
        sid,
        record_id: 2,
        target_id: 1,
      },
    ],
    filter: '',
  });
  expect(res.records.length).toBe(2);
  expect(res.records[0].id).toBe(2);
  expect(res.records[1].id).toBe(1);
});
