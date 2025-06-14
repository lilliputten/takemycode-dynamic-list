// // TODO: To configure jest to recognize tscofig path aliases
// import { capitalize } from '@/lib/utils';

import { defaultClampOptions } from './defaultClampOptions';
import { sortPairsByStart } from './sortPairsByStart';
import { TClampOptions } from './TClampOptions';
import { TPair } from './TPair';

export function joinOverlappedPairs(pairs: TPair[], opts: TClampOptions = defaultClampOptions) {
  if (pairs.length <= 1) {
    return pairs;
  }
  const sortedPairs = [...pairs];
  sortPairsByStart(sortedPairs);
  const combined: TPair[] = [];
  let last: TPair | undefined;
  for (const curr of sortedPairs) {
    // No last item, just save current
    if (!last) {
      last = [...curr];
      continue;
    }
    const startInCurr = curr[0] >= last[0] && curr[0] <= last[1];
    const stopInCurr = curr[1] >= last[0] && curr[1] <= last[1];
    if (startInCurr && stopInCurr) {
      // Completely folded, just skip
      continue;
    }
    if (!startInCurr && !stopInCurr) {
      // Not folded
      if (opts.joinGaps && curr[0] - last[1] <= opts.joinGaps) {
        // If the gap is narrower than joinGaps, then extend the last clamp
        last[1] = curr[1];
        continue;
      }
      // Save last item and save current
      combined.push(last);
      last = [...curr];
    } else if (startInCurr) {
      // Start in the last clamp, extend to the end of the current
      last[1] = curr[1];
    } else if (stopInCurr) {
      // (???) Stop in the last clamp, extend to the end of the current (impossible case as we wlak thru the list sorted by startIndex)
      last[0] = curr[0];
    }
  }
  if (last) {
    combined.push(last);
  }
  return combined;
}
