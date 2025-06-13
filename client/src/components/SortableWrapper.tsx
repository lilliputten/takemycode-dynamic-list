import { TRecord } from '@shared-types/TRecord';
import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import {
  Active,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import { Record } from './Record';
import { SortableOverlay } from './SortableOverlay';

export interface TMovedRecordParams {
  moveRecord: TRecord;
  overRecord: TRecord;
}

interface TProps extends React.PropsWithChildren {
  isPending: boolean;
  recordsData: TRecordsData;
  checkedRecords: number[];
  changeRecordsOrder: (moveId: number, overId: number) => void;
}

export function SortableWrapper(props: TProps) {
  const {
    children,
    recordsData,
    checkedRecords,
    changeRecordsOrder,
    // isPending,
  } = props;

  const { records } = recordsData;

  // Dnd-kit
  const [active, setActive] = React.useState<Active | null>(null);
  const activeRecord = React.useMemo(
    () => records.find((item) => item && item.id === active?.id),
    [active, records],
  );
  const sensors = useSensors(
    // Sortable sensors list (only for mouse pointer and touch devices so far)
    useSensor(MouseSensor),
    useSensor(TouchSensor),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over: overRecord } = event;
    const moveId: number = Number(active.id);
    const overId = Number(overRecord?.id);
    if (moveId && overId && moveId !== overId) {
      changeRecordsOrder(moveId, overId);
    }
    setActive(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        console.log('onDragStart');
        setActive(active);
      }}
      onDragCancel={() => {
        console.log('onDragCancel');
        setActive(null);
      }}
      onDragEnd={(ev) => {
        console.log('onDragEnd');
        onDragEnd(ev);
      }}
    >
      <SortableContext items={records}>
        {/* Records list */}
        {children}
      </SortableContext>
      <SortableOverlay>
        {activeRecord && <Record record={activeRecord} checkedRecords={checkedRecords} isOverlay />}
      </SortableOverlay>
    </DndContext>
  );
}
