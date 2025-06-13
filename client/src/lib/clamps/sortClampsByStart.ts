import { TClamp } from './TClamp';

export function sortClampsByStart(clamps: TClamp[]) {
  clamps.sort((a, b) => {
    return a.startIndex - b.startIndex;
  });
}
