import { CSSProperties } from 'react';
import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  record: TRecord;
  style: CSSProperties;
}

export function Record(props: TProps) {
  const {
    // Data...
    record,
    style,
  } = props;
  const { id, text } = record;
  return (
    <div
      data-id={id}
      className={cn(
        isDev && '__Record', // DEBUG
        'flex flex-1',
        'my-1',
      )}
      style={style}
    >
      <span
        className={cn(
          isDev && '__Record_Text', // DEBUG
        )}
      >
        {text}
      </span>
    </div>
  );
}
