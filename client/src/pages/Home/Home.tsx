import React from 'react';
import { TRecordsData } from '@shared-types/TRecordsData';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { fetchServerData } from '@/api/methods/fetchServerData';

import { HomeBody } from './HomeBody';
import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const data = await fetchServerData();
        const recordsData = data;
        console.log('[Home:Effect:Data]', {
          recordsData,
        });
        setRecordsData(recordsData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Home:Effect:Data]', error);
        debugger; // eslint-disable-line no-debugger
      }
    });
  }, []);

  return (
    <div
      className={cn(
        isDev && '__Home', // DEBUG
        'flex flex-1 flex-col',
        'overflow-hidden',
      )}
    >
      <HomeHeader />
      <HomeBody
        // TODO: Use context?
        isPending={isPending}
        recordsData={recordsData}
      />
      <HomeFooter />
    </div>
  );
}
