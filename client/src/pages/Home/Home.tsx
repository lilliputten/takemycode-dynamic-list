import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';

import { defaultToastOptions } from '@/config/defaultToastOptions';
import { isDev } from '@/config/env';
import { getRemSize } from '@/lib/getRemSize';
import { cn } from '@/lib/utils';
import { RecordsList } from '@/components/RecordsList';
import { SortableWrapper } from '@/components/SortableWrapper';
import { fetchServerData } from '@/api/methods/fetchServerData';
import { saveCheckedToServer } from '@/api/methods/saveCheckedToServer';
import { saveFilterToServer } from '@/api/methods/saveFilterToServer';
import { saveOrderToServer } from '@/api/methods/saveOrderToServer';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeListLayout } from './HomeListLayout';

interface TMemo {
  /** Currently loading request (usign if we limit only one loading request in the same time */
  currentLoad?: {
    startIndex: number;
    stopIndex: number;
  };
  /** Postponed requested data to load. Required optimization. */
  requestedLoad?: {
    startIndex: number;
    stopIndex: number;
  };
}

const __doDebugDelay = isDev;
const __debugDelay = 500;

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [isNonBlockingPending, startNonBlockingTransition] = React.useTransition();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();
  const [checkedRecords, setCheckedRecords] = React.useState<number[]>([]);

  /** Approximate 'window' size for initial data load (a little more than window can fit) */
  const initialRecordsCount = React.useMemo(() => {
    const remSize = getRemSize();
    const windowSize = window.innerHeight || 480;
    const value = Math.round(windowSize / remSize);
    return value;
  }, []);

  // Local filter value
  const [filterText, setFilterText] = React.useState('Filter text');

  const memo = React.useMemo<TMemo>(() => ({}), []);

  /** Toggle record state handler */
  const toggleRecord = React.useCallback((recordId: number, checked: boolean) => {
    // Update local data...
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
    // Send update to the server...
    startNonBlockingTransition(async () => {
      try {
        // DEBUG: Simulate network delay
        if (__doDebugDelay) {
          await new Promise((resolve) => setTimeout(resolve, __debugDelay));
        }
        await saveCheckedToServer({ recordId, checked });
        // prettier-ignore
        setTimeout(() => toast.success('Checked record data saved to the server.', defaultToastOptions), 0);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Home:Callback:toggleRecord] error', error, {
          recordId,
          checked,
        });
        debugger; // eslint-disable-line no-debugger
        // prettier-ignore
        setTimeout(() => toast.error('Error saving checked record data to the server.', defaultToastOptions), 0);
      }
    });
  }, []);

  const hasData = !!recordsData;

  /** Load data handler */
  const loadData = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      /* // UNUSED: Postponed loading (a naive implementation)
       * Check if no active loading process...
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
      // DEBUG: Indicate data load start
      // eslint-disable-next-line no-console
      console.log('[Home:Callback:loadData] start', startIndex, stopIndex, {
        currentLoad: memo.currentLoad,
        start,
        count,
      });
      return new Promise<void>((resolve, reject) => {
        startTransition(async () => {
          try {
            // DEBUG: Simulate network delay
            if (__doDebugDelay) {
              await new Promise((resolve) => setTimeout(resolve, __debugDelay));
            }
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
              // DEBUG: Show loaded data info
              // eslint-disable-next-line no-console
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
              // Show success toast
              setTimeout(() => toast.success('Data succesfully loaded.', defaultToastOptions), 0);
              resolve();
              /* // UNUSED: Postponed loading
               * if (memo.requestedLoad) {
               *   const { startIndex, stopIndex } = memo.requestedLoad;
               *   console.log('[Home:Callback:loadData] starting requestedLoad', startIndex, stopIndex);
               *   setTimeout(() => loadData(startIndex, stopIndex), 0);
               *   memo.requestedLoad = undefined;
               * }
               */
              return newRecordsData;
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[Home:Callback:loadData] error', error, {
              start,
              count,
            });
            debugger; // eslint-disable-line no-debugger
            // Show error toast
            setTimeout(() => toast.error('Error loading data.', defaultToastOptions), 0);
            reject(error);
          } finally {
            /* // UNUSED: Postponed loading
             * memo.currentLoad = undefined;
             */
          }
        });
      });
    },
    [memo],
  );

  /** Fully reload all the data */
  const reloadData = React.useCallback(() => {
    // TODO: Reset/init data
    setRecordsData(undefined);
    loadData(0, initialRecordsCount);
  }, [loadData]);

  /** Load data on init */
  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  /** Update sort order: move a record to the new position
   * @param {number} moveId - Source record id
   * @param {number} overId - Target record id: move source record after that one
   */
  const changeRecordsOrder = React.useCallback((moveId: number, overId: number) => {
    setRecordsData((recordsData) => {
      if (recordsData?.records) {
        const records = recordsData.records;
        const moveIndex = records.findIndex(({ id }) => id === moveId);
        const overIndex = records.findIndex(({ id }) => id === overId);
        // Update local data.
        // NOTE: If moveIndex > overIndex then source (move) item inserts after target (over), otherwise before
        const updatedRecords = arrayMove(records, moveIndex, overIndex);
        /* console.log('[Home:Callback:changeRecordsOrder] start', {
         *   moveIndex,
         *   overIndex,
         *   moveId,
         *   overId,
         *   records,
         *   updatedRecords,
         * });
         */
        recordsData = {
          ...recordsData,
          records: updatedRecords,
        };
      }
      return recordsData;
    });
    // Send update to the server
    startNonBlockingTransition(async () => {
      try {
        // DEBUG: Simulate network delay
        if (__doDebugDelay) {
          await new Promise((resolve) => setTimeout(resolve, __debugDelay));
        }
        await saveOrderToServer({ moveId, overId });
        setTimeout(() => toast.success('Order data saved to the server.', defaultToastOptions), 0);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Home:Callback:changeRecordsOrder] error', error, {
          moveId,
          overId,
        });
        debugger; // eslint-disable-line no-debugger
        // Show error toast
        setTimeout(() => toast.error('Error saving order data to server.', defaultToastOptions), 0);
      }
    });
  }, []);

  /** Fully reload all the data */
  const saveFilter = React.useCallback(
    (filterText: string) => {
      // Set local data
      setFilterText(filterText);
      // Send data to the server & reload data
      startNonBlockingTransition(async () => {
        try {
          // DEBUG: Simulate network delay
          if (__doDebugDelay) {
            await new Promise((resolve) => setTimeout(resolve, __debugDelay));
          }
          await saveFilterToServer({ filter: filterText });
          // prettier-ignore
          setTimeout(() => toast.success('Filter saved to the server.', defaultToastOptions), 0);
          reloadData();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:saveFilter] error', error, {
            filterText,
          });
          debugger; // eslint-disable-line no-debugger
          // prettier-ignore
          setTimeout(() => toast.error('Error saving filter data to server.', defaultToastOptions), 0);
        }
      });
    },
    [reloadData],
  );

  return (
    <div
      className={cn(
        isDev && '__Home', // DEBUG
        'flex flex-1 flex-col',
        'overflow-hidden',
      )}
    >
      <HomeHeader
        isNonBlockingPending={isNonBlockingPending}
        isPending={isPending}
        hasData={hasData}
        reloadData={reloadData}
        saveFilter={saveFilter}
        initialFilter={filterText}
        actualFilter={filterText}
      />
      <HomeListLayout isPending={isPending} hasData={hasData}>
        {hasData && (
          <SortableWrapper
            isPending={isPending}
            recordsData={recordsData}
            checkedRecords={checkedRecords}
            changeRecordsOrder={changeRecordsOrder}
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
