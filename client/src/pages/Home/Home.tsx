import { APIConfig } from '@shared-types/APIConfig';
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
import { getAPIConfigData } from '@/api/methods/getAPIConfigData';
import { getCheckedRecordsData } from '@/api/methods/getCheckedRecordsData';
import { getServerSessionData } from '@/api/methods/getServerSessionData';
import { saveCheckedToServer } from '@/api/methods/saveCheckedToServer';
import { saveFilterToServer } from '@/api/methods/saveFilterToServer';
import { saveOrderToServer } from '@/api/methods/saveOrderToServer';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeListLayout } from './HomeListLayout';

/* // UNUSED: Postponed loading (a naive implementation)
 * interface TMemo {
 *   [>* Currently loading request (usign if we limit only one loading request in the same time <]
 *   currentLoad?: {
 *     startIndex: number;
 *     stopIndex: number;
 *   };
 *   [>* Postponed requested data to load. Required optimization. <]
 *   requestedLoad?: {
 *     startIndex: number;
 *     stopIndex: number;
 *   };
 * }
 */

const __doDebugDelay = isDev;
const __debugDelay = 500;

export function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [isNonBlockingPending, startNonBlockingTransition] = React.useTransition();

  const [apiConfigData, setApiConfigData] = React.useState<APIConfig | undefined>();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();
  const [checkedRecords, setCheckedRecords] = React.useState<number[] | undefined>();
  const [filterText, setFilterText] = React.useState<string | undefined>();

  /* // UNUSED: Postponed loading (a naive implementation)
   * const memo = React.useMemo<TMemo>(() => ({}), []);
   */

  /** Approximate 'window' size for initial data load (a little more than window can fit) */
  const initialRecordsCount = React.useMemo(() => {
    const remSize = getRemSize();
    const windowSize = window.innerHeight || 480;
    const value = Math.round(windowSize / remSize);
    return value;
  }, []);

  /** Toggle record state handler */
  const toggleRecord = React.useCallback((recordId: number, checked: boolean) => {
    // Update local data...
    setCheckedRecords((checkedRecords) => {
      if (checkedRecords) {
        const isIncluded = checkedRecords?.includes(recordId);
        // TODO: Invoke server handlers
        if (!checked && isIncluded) {
          return checkedRecords.filter((id) => id !== recordId);
        }
        if (checked && !isIncluded) {
          return checkedRecords.concat(recordId);
        }
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

  const hasData = !!(apiConfigData && recordsData && checkedRecords && filterText !== undefined);

  /** Load data handler */
  const loadData = React.useCallback((startIndex: number, stopIndex: number) => {
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
      // currentLoad: memo.currentLoad,
      start,
      count,
      startIndex,
      stopIndex,
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
            /* // DEBUG: Show loaded data info
             * // eslint-disable-next-line no-console
             * console.log('[Home:Callback:loadData] success', {
             *   loadedCount: data.records.length,
             *   totalCount: data.totalCount,
             *   availCount: data.availCount,
             *   newRecordsData,
             *   recordsData,
             *   records,
             *   data,
             *   start,
             *   startIndex,
             *   stopIndex,
             * });
             */
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
  }, []);

  /** Fully reload all the data */
  const reloadData = React.useCallback(() => {
    // TODO: Reset/init data
    setRecordsData(undefined);
    loadData(0, initialRecordsCount);
  }, [loadData]);

  /** Load checked records data */
  const loadCheckedRecords = React.useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          // DEBUG: Simulate network delay
          if (__doDebugDelay) {
            await new Promise((resolve) => setTimeout(resolve, __debugDelay));
          }
          const checkedRecords = await getCheckedRecordsData();
          setCheckedRecords(checkedRecords);
          // prettier-ignore
          setTimeout(() => toast.success('Checked records succesfully loaded.', defaultToastOptions), 0);
          resolve();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:loadCheckedRecords] error', error);
          debugger; // eslint-disable-line no-debugger
          // prettier-ignore
          setTimeout(() => toast.error('Error loading checked records data.', defaultToastOptions), 0);
          reject(error);
        }
      });
    });
  }, []);

  /** Load checked records data */
  const loadFilter = React.useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          // DEBUG: Simulate network delay
          if (__doDebugDelay) {
            await new Promise((resolve) => setTimeout(resolve, __debugDelay));
          }
          const serverSessionData = await getServerSessionData();
          const { filter } = serverSessionData;
          setFilterText(filter || '');
          // prettier-ignore
          setTimeout(() => toast.success('Filter succesfully loaded.', defaultToastOptions), 0);
          resolve();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:loadFilter] error', error);
          debugger; // eslint-disable-line no-debugger
          // prettier-ignore
          setTimeout(() => toast.error('Error loading filter.', defaultToastOptions), 0);
          reject(error);
        }
      });
    });
  }, []);

  /** Load server config */
  const loadAPIConfig = React.useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          // DEBUG: Simulate network delay
          if (__doDebugDelay) {
            await new Promise((resolve) => setTimeout(resolve, __debugDelay));
          }
          const apiConfigData = await getAPIConfigData();
          // eslint-disable-next-line no-console
          console.info('[Home] Loaded API config', apiConfigData);
          // TODO: Check scheme migration versions and versionInfo?
          setApiConfigData(apiConfigData);
          // prettier-ignore
          setTimeout(() => toast.success('API config succesfully loaded.', defaultToastOptions), 0);
          resolve();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:loadFilter] error', error);
          debugger; // eslint-disable-line no-debugger
          // prettier-ignore
          setTimeout(() => toast.error('Error loading API config.', defaultToastOptions), 0);
          reject(error);
        }
      });
    });
  }, []);

  /** Inital effect */
  React.useEffect(() => {
    // NOTE: Launching async loaders in sync way, instead of Promise.all
    loadAPIConfig();
    loadCheckedRecords();
    loadFilter();
    reloadData();
  }, [reloadData]);

  /** Update sort order: move a record to the new position
   * @param {number} recordId - Source record id
   * @param {number} targetId - Target record id: move source record after that one
   */
  const changeRecordsOrder = React.useCallback((recordId: number, targetId: number) => {
    setRecordsData((recordsData) => {
      if (recordsData?.records) {
        const records = recordsData.records;
        const moveIndex = records.findIndex(({ id }) => id === recordId);
        const overIndex = records.findIndex(({ id }) => id === targetId);
        // Update local data.
        const updatedRecords = arrayMove(records, moveIndex, overIndex);
        // NOTE: If moveIndex > overIndex then source (move) item inserts after target (over), otherwise before
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
        await saveOrderToServer({ recordId, targetId });
        setTimeout(() => toast.success('Order data saved to the server.', defaultToastOptions), 0);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Home:Callback:changeRecordsOrder] error', error, {
          recordId,
          targetId,
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
        // initialFilter={filterText}
        actualFilter={filterText || ''}
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
