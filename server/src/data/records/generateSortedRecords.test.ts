/** @jest-environment node */

import { generateSortedRecords } from './generateSortedRecords';

const sid = 'xxx';

test('Should create {count} records even there are more records', () => {
  const res = generateSortedRecords({
    pairs: [[0, 1]],
    totalCount: 10,
    sortedRecords: [],
    filter: '',
  });
  expect(typeof res).toBe('object');
  const range = res.ranges[0];
  expect(range.count).toBe(2);
});

test('Should create a range staring from particular start index', () => {
  const res = generateSortedRecords({
    pairs: [[2, 4]],
    totalCount: 10,
    sortedRecords: [],
    filter: '',
  });
  const range = res.ranges[0];
  expect(range.records[0].id).toBe(3);
});

test('Should not exceed total count', () => {
  const res = generateSortedRecords({
    pairs: [[0, 100]],
    totalCount: 2,
    sortedRecords: [],
    filter: '',
  });
  const range = res.ranges[0];
  expect(range.count).toBe(2);
});

test('Should create an inclusive range', () => {
  const res = generateSortedRecords({
    pairs: [[0, 9]],
    totalCount: 100,
    sortedRecords: [],
    filter: '',
  });
  const range = res.ranges[0];
  expect(range.count).toBe(10);
});

test('Should filter records', () => {
  const res = generateSortedRecords({
    pairs: [[0, 10]],
    totalCount: 10,
    sortedRecords: [],
    filter: '1',
  });
  const range = res.ranges[0];
  expect(range.count).toBe(2);
  expect(range.records[0].id).toBe(1);
  expect(range.records[1].id).toBe(10);
});

test('Should provide correct availCount', () => {
  const res = generateSortedRecords({
    pairs: [[0, 1]],
    totalCount: 30,
    sortedRecords: [],
    filter: '5',
  });
  const range = res.ranges[0];
  expect(range.count).toBe(2);
  expect(res.availCount).toBe(3); // There are 3 records with '5' below 30: 5, 15, 25
});

test('Should sort records', () => {
  const res = generateSortedRecords({
    pairs: [[0, 1]],
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
  const range = res.ranges[0];
  expect(range.count).toBe(2);
  expect(range.records[0].id).toBe(2);
  expect(range.records[1].id).toBe(1);
});
