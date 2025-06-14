import { joinOverlappedPairs } from './joinOverlappedPairs';

test('Should combine simple overlapping clamps', () => {
  const res = joinOverlappedPairs([
    [5, 15],
    [10, 20],
  ]);
  expect(Array.isArray(res)).toBeTruthy();
  expect(res.length).toBe(1);
  const range = res[0];
  expect(range[0]).toBe(5);
  expect(range[1]).toBe(20);
});

test('Should join small gaps', () => {
  const res = joinOverlappedPairs(
    [
      [5, 9],
      [11, 15],
    ],
    { joinGaps: 5 },
  );
  expect(res.length).toBe(1);
  const range = res[0];
  expect(range[0]).toBe(5);
  expect(range[1]).toBe(15);
});

test('Should remain separate clamps', () => {
  const res = joinOverlappedPairs(
    [
      [5, 10],
      [20, 25],
    ],
    { joinGaps: 5 },
  );
  expect(res.length).toBe(2);
});
