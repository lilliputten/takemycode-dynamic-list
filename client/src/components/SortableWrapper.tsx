import { TRecord } from '@shared-types/TRecord';
import { TRecordsData } from '@shared-types/TRecordsData';

import React from 'react';
import {
  Active,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

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
  // toggleRecord: (recordId: number, checked: boolean) => void;
  handleMoveRecord: (moveId: number, overId: number) => void;
}

export function SortableWrapper(props: TProps) {
  const {
    // All the params (TODO: Use context?)
    children,
    // isPending,
    recordsData,
    checkedRecords,
    // toggleRecord,
    handleMoveRecord,
  } = props;

  const { records } = recordsData;

  // Dnd-kit
  const [active, setActive] = React.useState<Active | null>(null);
  const activeRecord = React.useMemo(
    () => records.find((item) => item.id === active?.id),
    [active, records],
  );
  const sensors = useSensors(
    // Sortable sensors list (only for mouse pointer so far)
    useSensor(PointerSensor),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over: overRecord } = event;
    const moveId: number = Number(active.id);
    const overId = Number(overRecord?.id);
    if (moveId && overId && moveId !== overId) {
      console.log('[SortableWrapper:onDragEnd]', {
        moveId,
        overId,
      });
      handleMoveRecord(moveId, overId);
    }
    setActive(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActive(active)}
      onDragCancel={() => setActive(null)}
      onDragEnd={onDragEnd}
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
