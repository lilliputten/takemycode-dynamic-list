import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { TPropsWithChildrenAndClassName } from '@/types/react';

export function MaxWidthWrapper(props: TPropsWithChildrenAndClassName) {
  const { children, className } = props;
  return (
    <div
      className={cn(
        isDev && '__MaxWidthWrapper', // DEBUG
        // isDev && 'border', // DEBUG
        className,
        'mx-auto max-w-2xl',
      )}
    >
      {children}
    </div>
  );
}
