import { extractTheBiggestClamp } from './extractTheBiggestClamp';

test('Should get undefined for empty list', () => {
  const [clamp, rest] = extractTheBiggestClamp([]);
  expect(clamp).toBeUndefined();
  // Empty rest list
  expect(Array.isArray(rest)).toBeTruthy();
  expect(rest.length).toBe(0);
});

test('Should get the single clamp in the list', () => {
  const single = { startIndex: 5, stopIndex: 10 };
  const [clamp, rest] = extractTheBiggestClamp([single]);
  expect(clamp).toBe(single);
  // Empty rest list
  expect(Array.isArray(rest)).toBeTruthy();
  expect(rest.length).toBe(0);
});

test('Should get the widest clamp', () => {
  const widest = { startIndex: 1, stopIndex: 100 };
  const origClamps = [
    { startIndex: 5, stopIndex: 10 },
    { startIndex: 15, stopIndex: 50 },
    widest,
    { startIndex: 5, stopIndex: 10 },
  ];
  const [clamp, rest] = extractTheBiggestClamp(origClamps);
  expect(clamp).toStrictEqual(widest);
  // Empty rest list
  expect(rest.length).toBe(origClamps.length - 1);
});
