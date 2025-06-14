import { TPair } from './TPair';

export function sortPairsByStart(pairs: TPair[]) {
  pairs.sort((a, b) => {
    return a[0] - b[0];
  });
}
