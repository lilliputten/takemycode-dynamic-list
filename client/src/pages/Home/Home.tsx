import React from 'react';
import { TRecord } from '@shared-types/TRecord';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { fetchServerData } from '@/api/methods/fetchServerData';

import { HomeBody } from './HomeBody';
import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [records, setRecords] = React.useState<TRecord[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [availCount, setAvailCount] = React.useState<number>(0);

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const data = await fetchServerData();
        const { records, totalCount, availCount } = data;
        console.log('[Home:Effect:Data]', {
          records,
          totalCount,
          availCount,
          data,
        });
        setRecords(records);
        setTotalCount(totalCount);
        setAvailCount(availCount);
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
        isPending={isPending}
        records={records}
        totalCount={totalCount}
        availCount={availCount}
      />
      <HomeFooter />
    </div>
  );
}
