import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { DemoList } from '@/components/debug/DemoList';

export function RecordsList() {
  return (
    <div
      className={cn(
        isDev && '__RecordsList', // DEBUG
        'flex flex-1 flex-col',
        'overflow-auto',
      )}
    >
      {/* TODO: Content */}
      <DemoList
        // title="RecordsList"
        count={30}
      />
    </div>
  );
}
