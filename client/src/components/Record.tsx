import { TRecord } from '@shared-types/TRecord';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

interface TProps {
  record: TRecord;
  style?: React.CSSProperties;
  checkedRecords: number[];
  toggleRecord?: (recordId: number, checked: boolean) => void;
  isOverlay?: boolean;
}

export function Record(props: TProps) {
  const {
    // All the props...
    record,
    style,
    checkedRecords,
    toggleRecord,
    isOverlay,
  } = props;
  const { id, text } = record;
  const checked = checkedRecords.includes(id);

  const {
    // Draggable...
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
    // setActivatorNodeRef,
  } = useSortable({ id });

  return (
    <div
      data-id={id}
      ref={setNodeRef}
      className={cn(
        isDev && '__Record', // DEBUG
        'flex flex-1 items-center gap-2',
        'p-2',
        'rounded-sm',
        'hover:bg-gray-500/10',
        isDragging && 'opacity-0',
        isOverlay && 'bg-gray-500/50',
      )}
      style={{
        ...style,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <input
        type="checkbox"
        id="checkbox-example"
        className={cn(
          isDev && '__Record_Checkbox', // DEBUG
          'size-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500',
        )}
        onChange={(ev) => toggleRecord?.(id, ev.target.checked)}
        checked={checked}
      />
      <span
        className={cn(
          isDev && '__Record_Text', // DEBUG
          'flex-1',
        )}
      >
        {text}
      </span>
      <span
        className={cn(
          isDev && '__DragHandle', // DEBUG
          'opacity-20',
          'transition-all',
          'hover:opacity-50',
        )}
        {...attributes}
        {...listeners}
        title="Drag record"
      >
        <GripVertical />
      </span>
    </div>
  );
}
