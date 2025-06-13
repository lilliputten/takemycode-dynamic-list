// // TODO: To configure jest to recognize tscofig path aliases
// import { capitalize } from '@/lib/utils';

import { defaultClampOptions } from './defaultClampOptions';
import { sortClampsByStart } from './sortClampsByStart';
import { TClamp } from './TClamp';
import { TClampOptions } from './TClampOptions';

export function joinOverlappedClamps(clamps: TClamp[], opts: TClampOptions = defaultClampOptions) {
  if (clamps.length <= 1) {
    return clamps;
  }
  const sortedClamps = [...clamps];
  sortClampsByStart(sortedClamps);
  const combined: TClamp[] = [];
  let last: TClamp | undefined;
  for (const curr of sortedClamps) {
    // No last item, just save current
    if (!last) {
      last = { ...curr };
      continue;
    }
    const startInCurr = curr.startIndex >= last.startIndex && curr.startIndex <= last.stopIndex;
    const stopInCurr = curr.stopIndex >= last.startIndex && curr.stopIndex <= last.stopIndex;
    if (startInCurr && stopInCurr) {
      // Completely folded, just skip
      continue;
    }
    if (!startInCurr && !stopInCurr) {
      // Not folded
      if (opts.joinGaps && curr.startIndex - last.stopIndex <= opts.joinGaps) {
        // If the gap is narrower than joinGaps, then extend the last clamp
        last.stopIndex = curr.stopIndex;
        continue;
      }
      // Save last item and save current
      combined.push(last);
      last = { ...curr };
    } else if (startInCurr) {
      // Start in the last clamp, extend to the end of the current
      last.stopIndex = curr.stopIndex;
    } else if (stopInCurr) {
      // (???) Stop in the last clamp, extend to the end of the current (impossible case as we wlak thru the list sorted by startIndex)
      last.startIndex = curr.startIndex;
    }
  }
  if (last) {
    combined.push(last);
  }
  return combined;
}
