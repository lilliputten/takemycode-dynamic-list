import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

interface TProps {
  isPending: boolean;
  records: TRecord[];
  totalCount: number;
  availCount: number;
}

export function HomeBody(props: TProps) {
  const {
    // All the params (TODO: Use context?)
    isPending,
    records,
    totalCount,
    availCount,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__HomeBody', // DEBUG
        'w-full flex-1',
        'flex flex-col',
        'px-4 py-2',
        'overflow-hidden',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeBody_Wrapper', // DEBUG
          'w-full flex-1',
          'flex flex-col',
          'overflow-hidden',
        )}
      >
        <RecordsList
          isPending={isPending}
          records={records}
          totalCount={totalCount}
          availCount={availCount}
        />
      </MaxWidthWrapper>
    </div>
  );
}
