import React from 'react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { LoadingSplash } from '@/blocks/LoadingSplash';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

interface TProps extends React.PropsWithChildren {
  hasData: boolean;
  isPending: boolean;
}

export function HomeListLayout(props: TProps) {
  const {
    // isPending,
    hasData,
    children,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__HomeListLayout', // DEBUG
        'w-full flex-1',
        'flex flex-col',
        'p-4',
        'relative overflow-hidden',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeListLayout_Wrapper', // DEBUG
          'w-full flex-1',
          'flex flex-col',
          'relative overflow-hidden',
        )}
      >
        {children}
      </MaxWidthWrapper>
      {/* TODO: Show a fatal error splash here? */}
      <LoadingSplash isPending={!hasData} />
    </div>
  );
}
