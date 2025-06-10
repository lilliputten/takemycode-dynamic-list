import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

export function HomeHeader() {
  return (
    <header
      className={cn(
        isDev && '__HomeHeader', // DEBUG
        'bg-(--primaryColor)/50',
        'px-4 py-2',
      )}
    >
      <MaxWidthWrapper>
        {/* TODO: Content */}
        HomeHeader
      </MaxWidthWrapper>
    </header>
  );
}
