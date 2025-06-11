import React from 'react';
import { TRecordsData } from '@shared-types/TRecordsData';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { fetchServerData } from '@/api/methods/fetchServerData';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeListLayout } from './HomeListLayout';

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();
  const [checkedRecords, setCheckedRecords] = React.useState<number[]>([]);

  /** Toggle record state handler */
  const toggleRecord = React.useCallback((recordId: number, checked: boolean) => {
    setCheckedRecords((checkedRecords) => {
      const isIncluded = checkedRecords.includes(recordId);
      // TODO: Invoke server handlers
      if (!checked && isIncluded) {
        return checkedRecords.filter((id) => id !== recordId);
      }
      if (checked && !isIncluded) {
        return checkedRecords.concat(recordId);
      }
      return checkedRecords;
    });
  }, []);

  const hasData = !!recordsData;

  /** Load data handler */
  const loadData = React.useCallback((startIndex: number, stopIndex: number) => {
    const start = startIndex;
    const count = stopIndex - startIndex + 1;
    /* console.log('[Home:Callback:loadData] start', {
     *   start,
     *   count,
     * });
     */
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const data = await fetchServerData({ start, count });
          // Combine records...
          setRecordsData((recordsData) => {
            const records = recordsData?.records ? [...recordsData.records] : [];
            data.records.forEach((record, index) => {
              records[start + index] = record;
            });
            const newRecordsData = {
              ...data,
              records,
            };
            /* console.log('[Home:Callback:loadData] success', {
             *   loadedCount: data.records.length,
             *   totalCount: data.totalCount,
             *   availCount: data.availCount,
             *   newRecordsData,
             *   recordsData,
             *   records,
             *   data,
             *   start,
             * });
             */
            resolve();
            return newRecordsData;
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:loadData] error', error, {
            start,
            count,
          });
          debugger; // eslint-disable-line no-debugger
          // TODO: Show toast
          reject(error);
        }
      });
    });
  }, []);

  /** Fully reload all the data */
  const reloadData = React.useCallback(() => {
    // TODO: Reset/init data
    loadData(0, 20);
  }, [loadData]);

  /** Load data on init */
  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <div
      className={cn(
        isDev && '__Home', // DEBUG
        'flex flex-1 flex-col',
        'overflow-hidden',
      )}
    >
      <HomeHeader />
      <HomeListLayout isPending={isPending} hasData={hasData}>
        {hasData && (
          <RecordsList
            isPending={isPending}
            recordsData={recordsData}
            loadMoreItems={loadData}
            checkedRecords={checkedRecords}
            toggleRecord={toggleRecord}
          />
        )}
      </HomeListLayout>
      <HomeFooter />
    </div>
  );
}
