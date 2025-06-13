import { APIConfig } from '@shared-types/APIConfig';
import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'react-toastify';

import {
  extractTheBiggestClamp,
  joinOverlappedClamps,
  substractClamps,
  TClamp,
} from '@/lib/clamps';
import { createDefer, TDefer } from '@/lib/createDefer';
import {
  fetchServerData,
  getAPIConfigData,
  getCheckedRecordsData,
  getServerSessionData,
  saveCheckedToServer,
  saveFilterToServer,
  saveOrderToServer,
} from '@/api/methods';
import { RecordsList, SortableWrapper } from '@/components';
import { defaultToastOptions, isDev } from '@/config';
import { cn, getRemSize } from '@/lib';

import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';
import { HomeListLayout } from './HomeListLayout';

/** Debug delay */
const __debugDelayFunc = isDev
  ? async () => await new Promise((r) => setTimeout(r, 500))
  : async () => {};

const postponedLoadDelay = 500;

// Postponed loading and other memoized parameters
interface TMemo {
  /** Is there active data loading process? */
  isLoading?: boolean;
  /** Postponed load data function timeout handler */
  timeoutHandler?: ReturnType<typeof setTimeout>;
  /** Currently loading request promise */
  loadingDefer?: TDefer<void>;
  /** Currently loading request (usign if we limit only one loading request in the same time */
  loadingClamp?: TClamp;
  /** Postponed requested data to load */
  requested: TClamp[];
  /** Load data chunk size */
  batchSize: number;
}

/** Calculate batch size for the dom node height (pixels) */
function calcBatchSize(height: number = window?.innerHeight || 480) {
  const remSize = getRemSize();
  return Math.ceil(height / remSize / 10) * 10;
}

const initialBatchSize = calcBatchSize();

export function Home() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = React.useTransition();
  const [isNonBlockingPending, startNonBlockingTransition] = React.useTransition();

  const [apiConfigData, setApiConfigData] = React.useState<APIConfig | undefined>();
  const [recordsData, setRecordsData] = React.useState<TRecordsData | undefined>();
  const [checkedRecords, setCheckedRecords] = React.useState<number[] | undefined>();
  const [filterText, setFilterText] = React.useState<string | undefined>();

  const memo = React.useMemo<TMemo>(() => ({ requested: [], batchSize: initialBatchSize }), []);

  /** Approximate 'window' size for initial data load (a little more than window can fit) */
  const [batchSize, setBatchSize] = React.useState<number>(initialBatchSize);

  // Set batch size derived from the current node size and register an observer to update it on window resize
  React.useEffect(() => {
    if (nodeRef.current) {
      const updateBatchSize = (batchSize: number) => setBatchSize((memo.batchSize = batchSize));
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateBatchSize(calcBatchSize(entry.contentRect.height));
        }
      });
      observer.observe(nodeRef.current);
      updateBatchSize(calcBatchSize(nodeRef.current.offsetHeight));
      return () => observer.disconnect();
    }
  }, [memo, nodeRef]);

  const hasData = !!(apiConfigData && recordsData && checkedRecords && filterText !== undefined);

  /** Load data handler */
  const loadRealData = React.useCallback(
    (clamp: TClamp) => {
      const { startIndex, stopIndex } = clamp;
      // eslint-disable-next-line no-console
      memo.loadingClamp = { startIndex, stopIndex };
      const start = startIndex;
      const count = stopIndex - startIndex + 1;
      const __debugStr = `${startIndex}-${stopIndex} (${count})`;
      // eslint-disable-next-line no-console
      console.log('[Home:Callback:loadRealData] Started', __debugStr, {
        loadingClamp: memo.loadingClamp,
        requested: [...memo.requested],
      });
      if (!memo.loadingDefer) {
        memo.loadingDefer = createDefer();
      }
      memo.isLoading = true;
      startTransition(async () => {
        try {
          await __debugDelayFunc();
          const data = await fetchServerData({ start, count });
          // Combine records and update state data...
          setRecordsData((recordsData) => {
            const records = recordsData?.records ? [...recordsData.records] : [];
            data.records.forEach((record, index) => {
              records[start + index] = record;
            });
            return { ...data, records };
          });
          // Show success toast
          const successMsg = `Loaded ${stopIndex - startIndex + 1} record(s) (${startIndex + 1}-${stopIndex + 1}).`;
          setTimeout(() => toast.success(successMsg, defaultToastOptions), 0);
          // Resolve data
          memo.loadingDefer?.resolve();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Home:Callback:loadRealData] error', error, {
            start,
            count,
          });
          debugger; // eslint-disable-line no-debugger
          // Show error toast
          setTimeout(() => toast.error('Error loading data.', defaultToastOptions), 0);
          memo.loadingDefer?.reject(error);
        } finally {
          memo.loadingClamp = undefined;
          memo.loadingDefer = undefined;
          memo.isLoading = false;
          // eslint-disable-next-line no-console
          console.log('[Home:Callback:loadRealData] Finished', __debugStr, {
            requested: [...memo.requested],
          });
        }
      });
      return memo.loadingDefer.promise;
    },
    [memo],
  );

  /** Select next data clamp and load it */
  const loadNextData = React.useCallback(() => {
    // If there are some postponed requests...
    if (memo.requested.length) {
      // If is loading currently...
      if (memo.isLoading) {
        if (!memo.loadingDefer) {
          memo.loadingDefer = createDefer();
        }
        if (memo.timeoutHandler) {
          clearTimeout(memo.timeoutHandler);
        }
        memo.timeoutHandler = setTimeout(loadNextData, postponedLoadDelay);
      } else {
        // Otherwise try to combine postponed clamps and find the biggest one to load now...
        memo.requested = joinOverlappedClamps(memo.requested, {
          joinGaps: memo.batchSize * 5,
        });
        // TODO: Select most recent ranges (it's not quite possible while we sort them)?
        const [biggestClamp, restClamps] = extractTheBiggestClamp(memo.requested);
        memo.requested = restClamps;
        const optimizedClamp = substractClamps(biggestClamp, memo.loadingClamp);
        if (optimizedClamp) {
          return loadRealData(optimizedClamp).finally(() => {
            if (memo.requested.length) {
              memo.timeoutHandler = setTimeout(loadNextData, 0);
            }
          });
        }
      }
    }

    return memo.loadingDefer?.promise || Promise.resolve();
  }, [memo]);

  /** Put the range clamp to the loading queue and start loading if there no active load */
  const loadData = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      memo.requested.push({ startIndex, stopIndex });
      return loadNextData();
    },
    [memo],
  );

  /** Fully reload all the data */
  const reloadData = React.useCallback(() => {
    setRecordsData(undefined);
    loadData(0, memo.batchSize - 1);
  }, [memo, loadData]);

  /** Load checked records data */
  const loadCheckedRecords = React.useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          await __debugDelayFunc();
          const checkedRecords = await getCheckedRecordsData();
          setCheckedRecords(checkedRecords);
          // prettier-ignore
          setTimeout(() => toast.info('Loaded checked records data.', defaultToastOptions), 0);
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
          await __debugDelayFunc();
          const serverSessionData = await getServerSessionData();
          const { filter } = serverSessionData;
          setFilterText(filter || '');
          // prettier-ignore
          setTimeout(() => toast.info('Loaded filter data.', defaultToastOptions), 0);
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
          await __debugDelayFunc();
          const apiConfigData = await getAPIConfigData();
          // eslint-disable-next-line no-console
          console.info('[Home] Loaded API config', apiConfigData);
          // TODO: Check scheme migration versions and versionInfo?
          setApiConfigData(apiConfigData);
          // prettier-ignore
          setTimeout(() => toast.info('Loaded API config.', defaultToastOptions), 0);
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

  /** Toggle record state handler */
  const toggleRecord = React.useCallback((recordId: number, checked: boolean) => {
    // Update local data...
    setCheckedRecords((checkedRecords) => {
      if (checkedRecords) {
        const isIncluded = checkedRecords?.includes(recordId);
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
        await __debugDelayFunc();
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
        await __debugDelayFunc();
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

  /** Save the filter data to the server */
  const saveFilter = React.useCallback(
    (filterText: string) => {
      // Set local data
      setFilterText(filterText);
      // Send data to the server & reload data
      startNonBlockingTransition(async () => {
        try {
          await __debugDelayFunc();
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

  /** Inital effect */
  React.useEffect(() => {
    // NOTE: Launching async loaders in sync way, instead of Promise.all
    loadAPIConfig();
    loadCheckedRecords();
    loadFilter();
    loadData(0, memo.batchSize - 1);
    /* // DEBUG: Test postponed loads
     * if (isDev) {
     *   // Overlapping initial
     *   loadData(memo.batchSize, memo.batchSize * 2 - 1);
     *   loadData(memo.batchSize * 2, memo.batchSize * 3 - 1);
     *   // // Range with a gap
     *   // loadData(memo.batchSize * 2, memo.batchSize * 3 - 1);
     *   // // Overlapping
     *   // loadData(memo.batchSize * 2 + 20, memo.batchSize * 3 + 100 - 1);
     * }
     */
  }, [memo, reloadData]);

  return (
    <div
      ref={nodeRef}
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
              batchSize={batchSize}
            />
          </SortableWrapper>
        )}
      </HomeListLayout>
      <HomeFooter />
    </div>
  );
}
