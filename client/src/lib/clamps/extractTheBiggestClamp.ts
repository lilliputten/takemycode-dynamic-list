import { TClamp } from './TClamp';

type TExtractTheBiggestClampReturn = [TClamp | undefined, TClamp[]];
export function extractTheBiggestClamp(clamps: TClamp[]): TExtractTheBiggestClampReturn {
  if (!clamps.length) {
    return [undefined, clamps];
  }
  if (clamps.length === 1) {
    return [clamps[0], []];
  }
  let maxIndex = 0;
  let maxSize = clamps[0].stopIndex - clamps[0].startIndex;
  for (let index = 1; index < clamps.length; index++) {
    const size = clamps[index].stopIndex - clamps[index].startIndex;
    if (size > maxSize) {
      maxSize = size;
      maxIndex = index;
    }
  }
  const newClamps = [...clamps];
  const clamp = newClamps.splice(maxIndex, 1)[0];
  return [clamp, newClamps];
}
