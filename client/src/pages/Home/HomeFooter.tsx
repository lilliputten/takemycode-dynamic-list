import { isDev, versionInfo } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

export function HomeFooter() {
  return (
    <footer
      className={cn(
        isDev && '__HomeFooter', // DEBUG
        'bg-(--primaryColor)/20',
        'px-4 py-2',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeFooter_Wrapper', // DEBUG
          'text-xs',
          'opacity-50',
          // 'overflow-hidden text-ellipsis whitespace-nowrap',
          'truncate',
        )}
      >
        {/* TODO: Content */}
        {versionInfo}
      </MaxWidthWrapper>
    </footer>
  );
}
