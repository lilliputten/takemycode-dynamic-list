import React from 'react';
import { TRecord } from '@shared-types/TRecord';
import { TRecordsData } from '@shared-types/TRecordsData';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { isDev } from '@/config/env';
import { getRemSize } from '@/lib/getRemSize';
import { cn } from '@/lib/utils';

import { Record } from './Record';
import { RecordEmpty } from './RecordEmpty';

interface TProps {
  isPending: boolean;
  recordsData: TRecordsData;
}

const remsPerItem = 2;

export function RecordsList(props: TProps) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
    itemHeight: getRemSize() * remsPerItem,
  });

  const {
    // All the params (TODO: Use context?)
    isPending,
    recordsData,
  } = props;

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

  const rowRenderer = ({ index, style }: ListChildComponentProps) => {
    const record = recordsData.records[index];
    if (!record) {
      console.warn('[RecordsList:rowRenderer] No record for index', index);
      return <RecordEmpty style={style} index={index} />;
    }
    return <Record style={style} record={record} />;
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        isDev && '__RecordsList', // DEBUG
        'w-full flex-1',
        isPending && 'pointer-events-none opacity-50',
      )}
    >
      <List
        itemCount={recordsData.availCount || 0}
        itemSize={size.itemHeight}
        width={size.width}
        height={size.height}
      >
        {rowRenderer}
      </List>
    </div>
  );
}
