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
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void> | void; // InfiniteLoader.loadMoreItems;
  checkedRecords: number[];
  toggleRecord: (recordId: number, checked: boolean) => void;
}

const remsPerItem = 2.5;

export function RecordsList(props: TProps) {
  const {
    // All the params (TODO: Use context?)
    // isPending,
    recordsData,
    loadMoreItems,
    checkedRecords,
    toggleRecord,
  } = props;

  const elementRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
    itemHeight: getRemSize() * remsPerItem,
  });

  const {
    // All the data
    records,
    availCount,
    // start,
    // totalCount,
  } = recordsData;

  React.useEffect(() => {
    if (!elementRef.current) {
      return;
    }
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
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  const rowRenderer = ({ index, style /* , data */ }: ListChildComponentProps) => {
    const record = records[index];
    if (!record) {
      // console.warn('[RecordsList:rowRenderer] No record for index', index);
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
      ref={elementRef}
      className={cn(
        isDev && '__RecordsList', // DEBUG
        'w-full flex-1',
        'transition-all',
        // isPending && 'pointer-events-none opacity-20',
      )}
    >
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
        itemCount={availCount}
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
