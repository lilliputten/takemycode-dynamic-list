import { CSSProperties } from 'react';
import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  record: TRecord;
  style: CSSProperties;
  checkedRecords: number[];
  toggleRecord: (recordId: number, checked: boolean) => void;
}

export function Record(props: TProps) {
  const {
    // Data...
    record,
    style,
    checkedRecords,
    toggleRecord,
  } = props;
  const { id, text } = record;
  const checked = checkedRecords.includes(id);
  return (
    <div
      data-id={id}
      className={cn(
        isDev && '__Record', // DEBUG
        'flex flex-1 items-center gap-2',
        'my-1',
      )}
      style={style}
    >
      <input
        type="checkbox"
        id="checkbox-example"
        className={cn(
          isDev && '__Record_Checkbox', // DEBUG
          'size-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500',
        )}
        onChange={(ev) => {
          const { checked } = ev.target;
          toggleRecord(id, checked);
        }}
        checked={checked}
      />
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
