import { TClamp } from './TClamp';

export function substractClamps(orig?: TClamp, subs?: TClamp): TClamp | undefined {
  if (!orig) {
    return undefined;
  }
  if (!subs) {
    return orig;
  }
  // If orig is inside: return empty
  if (orig.startIndex >= subs.startIndex && orig.stopIndex <= subs.stopIndex) {
    return undefined;
  }
  // Subs is out: return original
  if (subs.stopIndex < orig.startIndex || subs.startIndex > orig.stopIndex) {
    return orig;
  }
  // Subs is before orig: trim from the begin
  if (subs.stopIndex < orig.stopIndex) {
    return { ...orig, startIndex: subs.stopIndex + 1 };
  }
  // Subs is after orig: trim from the end
  if (subs.startIndex > orig.startIndex) {
    return { ...orig, stopIndex: subs.startIndex - 1 };
  }
}
