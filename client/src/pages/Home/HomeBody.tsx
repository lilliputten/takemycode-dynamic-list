import { TRecordsData } from '@shared-types/TRecordsData';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { LoadingSplash } from '@/blocks/LoadingSplash';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

interface TProps {
  isPending: boolean;
  recordsData?: TRecordsData;
}

export function HomeBody(props: TProps) {
  const {
    // All the params (TODO: Use context?)
    isPending,
    recordsData,
  } = props;
  const hasData = !!recordsData;

  return (
    <div
      className={cn(
        isDev && '__HomeBody', // DEBUG
        'w-full flex-1',
        'flex flex-col',
        'px-4 py-2',
        'relative overflow-hidden',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeBody_Wrapper', // DEBUG
          'w-full flex-1',
          'flex flex-col',
          'relative overflow-hidden',
        )}
      >
        {hasData && (
          <RecordsList
            // TODO: Use context?
            isPending={isPending}
            recordsData={recordsData}
          />
        )}
      </MaxWidthWrapper>
      {/* TODO: Show fatal error splash here */}
      <LoadingSplash isPending={!hasData} />
    </div>
  );
}
