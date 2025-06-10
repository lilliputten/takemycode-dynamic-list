import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  record: TRecord;
}

export function Record(props: TProps) {
  const {
    // Data...
    record,
  } = props;
  const { id, text } = record;
  return (
    <div
      data-id={id}
      className={cn(
        isDev && '__Record', // DEBUG
        'flex flex-1',
      )}
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
