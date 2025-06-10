import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

export function HomeBody() {
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
        <RecordsList />
      </MaxWidthWrapper>
    </div>
  );
}
