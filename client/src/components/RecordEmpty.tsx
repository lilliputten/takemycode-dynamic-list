import { CSSProperties } from 'react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  index: number;
  style: CSSProperties;
}

export function RecordEmpty(props: TProps) {
  const {
    // Data...
    index,
    style,
  } = props;
  return (
    <div
      data-index={index}
      className={cn(
        isDev && '__RecordEmpty', // DEBUG
        // 'flex-1',
        'overflow-hidden',
      )}
      style={style}
    >
      <div
        className={cn(
          isDev && '__RecordEmpty_Inner', // DEBUG
          // 'flex flex-1',
          'bg-gray-500/10',
          // 'animate-bgColorShift',
          'text-transparent',
          'position-absolute',
          'inset-x-0 inset-y-2',
          'rounded-sm',
        )}
      >
        Item {index}
      </div>
    </div>
  );
}
