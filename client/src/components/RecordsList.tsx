import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { isDev } from '@/config/env';
import { getRemSize } from '@/lib/getRemSize';
import { cn } from '@/lib/utils';

import { Record } from './Record';
import { RecordEmpty } from './RecordEmpty';

interface TProps {
  isPending: boolean;
  recordsData: TRecordsData;
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>; // InfiniteLoader.loadMoreItems;
  checkedRecords: number[];
  toggleRecord: (recordId: number, checked: boolean) => void;
  batchSize: number;
}

// NOTE: The calculation of records range to load fails in
// `react-window/createListComponent.ts:_getRangeToRender` for too long
// scrolls. Eg, it breaks for items count=1000000 and remsPerItem=2.5.
const remsPerItem = 2;

export function RecordsList(props: TProps) {
  const {
    // isPending,
    recordsData,
    loadMoreItems,
    checkedRecords,
    toggleRecord,
    batchSize,
  } = props;

  const nodeRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
    itemHeight: getRemSize() * remsPerItem,
  });

  const {
    // All the data
    records,
    availCount,
    // totalCount,
  } = recordsData;

  React.useEffect(() => {
    if (nodeRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({
            // Update all dimensions
            width,
            height,
            itemHeight: getRemSize() * remsPerItem,
          });
        }
      });
      observer.observe(nodeRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const rowRenderer = ({ index, style }: ListChildComponentProps) => {
    const record = records[index];
    if (!record) {
      // Display empty row if no record has loaded
      return <RecordEmpty style={style} index={index} />;
    }
    return (
      <Record
        style={style}
        record={record}
        checkedRecords={checkedRecords}
        toggleRecord={toggleRecord}
      />
    );
  };

  const isItemLoaded = (index: number) => !!records[index];
  const itemKey = (index: number) => `item-${records[index]?.id || `empty-${index}`}`;

  return (
    <div
      ref={nodeRef}
      className={cn(
        isDev && '__RecordsList', // DEBUG
        'w-full flex-1',
        'transition-all',
        'relative overflow-hidden',
      )}
    >
      <InfiniteLoader
        // @see https://github.com/bvaughn/react-window-infinite-loader?tab=readme-ov-file#documentation
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
        itemCount={availCount}
        minimumBatchSize={batchSize}
        // threshold={batchSize}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemCount={availCount}
            itemSize={size.itemHeight}
            width={size.width}
            height={size.height}
            onItemsRendered={onItemsRendered}
            itemKey={itemKey}
            itemData={checkedRecords}
            ref={ref}
          >
            {rowRenderer}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
}
