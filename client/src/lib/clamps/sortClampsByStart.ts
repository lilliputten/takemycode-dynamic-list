import { TClamp } from './TClamp';

export function sortPairsByStart(clamps: TClamp[]) {
  clamps.sort((a, b) => {
    return a.startIndex - b.startIndex;
  });
}
