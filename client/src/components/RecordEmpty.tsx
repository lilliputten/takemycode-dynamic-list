import React from 'react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  index: number;
  style: React.CSSProperties;
}

export function RecordEmpty(props: TProps) {
  const { index, style } = props;
  return (
    <div
      data-index={index}
      className={cn(
        isDev && '__RecordEmpty', // DEBUG
        'overflow-hidden',
      )}
      style={style}
    >
      <div
        className={cn(
          isDev && '__RecordEmpty_Inner', // DEBUG
          'bg-gray-500/10',
          'text-transparent',
          'position-absolute',
          'inset-1',
          'rounded-sm',
        )}
      >
        Item {index}
      </div>
    </div>
  );
}
