import { joinOverlappedClamps } from './joinOverlappedClamps';

test('Should combine simple overlapping clamps', () => {
  const res = joinOverlappedClamps([
    { startIndex: 5, stopIndex: 15 },
    { startIndex: 10, stopIndex: 20 },
  ]);
  expect(Array.isArray(res)).toBeTruthy();
  expect(res.length).toBe(1);
  expect(res[0].startIndex).toBe(5);
  expect(res[0].stopIndex).toBe(20);
});

test('Should join small gaps', () => {
  const res = joinOverlappedClamps(
    [
      { startIndex: 5, stopIndex: 9 },
      { startIndex: 11, stopIndex: 15 },
    ],
    { joinGaps: 5 },
  );
  expect(res.length).toBe(1);
  expect(res[0].startIndex).toBe(5);
  expect(res[0].stopIndex).toBe(15);
});

test('Should remain separate clamps', () => {
  const res = joinOverlappedClamps(
    [
      { startIndex: 5, stopIndex: 10 },
      { startIndex: 20, stopIndex: 25 },
    ],
    { joinGaps: 5 },
  );
  expect(res.length).toBe(2);
});
