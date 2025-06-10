import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

import { Record } from './Record';

// import { DemoList } from '@/components/debug/DemoList';

interface TProps {
  isPending: boolean;
  records: TRecord[];
  totalCount: number;
  availCount: number;
}

export function RecordsList(props: TProps) {
  const {
    // All the params (TODO: Use context?)
    isPending,
    records,
    // totalCount,
    // availCount,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__RecordsList', // DEBUG
        'flex flex-1 flex-col gap-2',
        'overflow-auto',
        isPending && 'pointer-events-none opacity-50',
      )}
    >
      {records.map((record) => (
        <Record key={record.id} record={record} />
      ))}
      {/* TODO: Demo content
      <DemoList
        // title="RecordsList"
        count={30}
      />
      */}
    </div>
  );
}
