import { TRecord } from '@shared-types/TRecord';
import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import { arrayMove } from '@dnd-kit/sortable';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { SortableWrapper } from '@/components/SortableWrapper';
import { fetchServerData } from '@/api/methods/fetchServerData';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeListLayout } from './HomeListLayout';

interface TMemo {
  currentLoad?: {
    startIndex: number;
    stopIndex: number;
  };
  requestedLoad?: {
    startIndex: number;
    stopIndex: number;
  };
}

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();
  const [checkedRecords, setCheckedRecords] = React.useState<number[]>([]);

  const memo = React.useMemo<TMemo>(() => ({}), []);

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
  const loadData = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      /* // UNUSED: Check if no active loading process...
       * if (memo.currentLoad) {
       *   // ...Otherwise postpone the requested load...
       *   if (!memo.requestedLoad) {
       *     memo.requestedLoad = { startIndex, stopIndex };
       *   } else {
       *     // TODO: Optimize the load algoritm: prevent loading of wide
       *     // sequences (the while data, eg: it's possible if the user scroll to
       *     // the end of the list immediatelly)
       *     if (memo.requestedLoad.startIndex > startIndex) {
       *       memo.requestedLoad.startIndex = startIndex;
       *     }
       *     if (memo.requestedLoad.stopIndex < stopIndex) {
       *       memo.requestedLoad.stopIndex = stopIndex;
       *     }
       *     // prettier-ignore
       *     console.log('[Home:Callback:loadData] postponed loading', startIndex, stopIndex, memo.requestedLoad);
       *   }
       *   return;
       * }
       * memo.currentLoad = { startIndex, stopIndex };
       */
      const start = startIndex;
      const count = stopIndex - startIndex + 1;
      console.log('[Home:Callback:loadData] start', startIndex, stopIndex, {
        currentLoad: memo.currentLoad,
        start,
        count,
      });
      return new Promise<void>((resolve, reject) => {
        startTransition(async () => {
          try {
            // DEBUG: Delay
            await new Promise((resolve) => setTimeout(resolve, 2000));
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
              console.log('[Home:Callback:loadData] success', {
                loadedCount: data.records.length,
                totalCount: data.totalCount,
                availCount: data.availCount,
                newRecordsData,
                recordsData,
                records,
                data,
                start,
              });
              resolve();
              if (memo.requestedLoad) {
                const { startIndex, stopIndex } = memo.requestedLoad;
                console.log('[Home:Callback:loadData] starting requestedLoad', startIndex, stopIndex);
                setTimeout(() => loadData(startIndex, stopIndex), 0);
                memo.requestedLoad = undefined;
              }
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
          } finally {
            memo.currentLoad = undefined;
          }
        });
      });
    },
    [memo],
  );

  /** Fully reload all the data */
  const reloadData = React.useCallback(() => {
    // TODO: Reset/init data
    loadData(0, 20);
  }, [loadData]);

  /** Load data on init */
  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  /** Update sort order: move a record to the new position
   * @param {number} moveId - Source record id
   * @param {number} overId - Target record id: move source record after that one
   */
  const handleMoveRecord = React.useCallback((moveId: number, overId: number) => {
    setRecordsData((recordsData) => {
      if (recordsData?.records) {
        const records = recordsData.records;
        const moveIndex = records.findIndex(({ id }) => id === moveId);
        const overIndex = records.findIndex(({ id }) => id === overId);
        // Update local data
        const updatedRecords = arrayMove(records, moveIndex, overIndex);
        console.log('[Home:Callback:handleMoveRecord] start', {
          moveIndex,
          overIndex,
          moveId,
          overId,
        });
        recordsData = {
          ...recordsData,
          records: updatedRecords,
        };
      }
      return recordsData;
    });
    // TODO: Send update to the server
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
      <HomeListLayout isPending={isPending} hasData={hasData}>
        {hasData && (
          <SortableWrapper
            isPending={isPending}
            recordsData={recordsData}
            checkedRecords={checkedRecords}
            handleMoveRecord={handleMoveRecord}
          >
            <RecordsList
              isPending={isPending}
              recordsData={recordsData}
              loadMoreItems={loadData}
              checkedRecords={checkedRecords}
              toggleRecord={toggleRecord}
            />
          </SortableWrapper>
        )}
      </HomeListLayout>
      <HomeFooter />
    </div>
  );
}
