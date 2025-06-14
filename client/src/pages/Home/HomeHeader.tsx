import React from 'react';
import { Check, RefreshCcw, ThumbsUp, X } from 'lucide-react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

interface THomeHeaderProps {
  hasData: boolean;
  isNonBlockingPending: boolean;
  isPending: boolean;
  reloadData: () => void;
  resetOrder: () => void;
  saveFilter: (filterText: string) => void;
  actualFilter: string;
}

export function HomeHeader(props: THomeHeaderProps) {
  const {
    isNonBlockingPending,
    isPending,
    hasData,
    reloadData,
    resetOrder,
    saveFilter,
    actualFilter,
  } = props;

  const [filterText, setFilterText] = React.useState(actualFilter);
  const [isFilterChanged, setFilterChanged] = React.useState(false);

  React.useEffect(() => {
    setFilterText(actualFilter);
  }, [actualFilter]);

  const isBusy = !hasData || isPending;
  const isOperating = isBusy || isNonBlockingPending;

  return (
    <header
      className={cn(
        isDev && '__HomeHeader', // DEBUG
        'bg-(--primaryColor)/50',
        'px-4 py-2',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeHeader_Wrapper', // DEBUG
          'flex flex-wrap items-center gap-2',
        )}
      >
        <div
          className={cn(
            isDev && '__HomeHeader_FilterTextInput', // DEBUG
            'btn btn-icon inactive',
            'bg-(--primaryColor)/15 !rounded-full',
          )}
          title={isOperating ? 'Operating...' : 'All is Ok'}
        >
          {/* Show status indicator icon */}
          {isOperating ? (
            <RefreshCcw className="animate-spin" color="var(--primaryColor)" />
          ) : (
            <ThumbsUp color="var(--primaryColor)" />
          )}
        </div>
        <input
          id="filterText"
          type="text"
          className={cn(
            isDev && '__HomeHeader_FilterTextInput', // DEBUG
            'input input-text input-primary w-full min-w-[6em] flex-1',
            isBusy && 'disabled',
          )}
          placeholder="Filter records by id"
          value={filterText}
          onChange={(ev) => {
            setFilterText(ev.target.value);
            setFilterChanged(true);
          }}
        />
        <button
          className={cn(
            isDev && '__HomeHeader_ApplyFilterButton', // DEBUG
            'btn btn-primary btn-plain',
            (isBusy || !isFilterChanged) && 'disabled',
          )}
          onClick={() => {
            saveFilter(filterText);
            setFilterChanged(false);
          }}
        >
          <Check />
          Apply filter
        </button>
        <button
          className={cn(
            isDev && '__HomeHeader_ResetFilterButton', // DEBUG
            'btn btn-primary btn-plain',
            (isBusy || !actualFilter) && 'disabled',
          )}
          onClick={() => {
            setFilterText('');
            saveFilter('');
            setFilterChanged(false);
          }}
        >
          <X />
          Reset filter
        </button>
        <button
          className={cn(
            isDev && '__HomeHeader_ResetOrderButton', // DEBUG
            'btn btn-primary btn-plain',
            isBusy && 'disabled',
          )}
          onClick={resetOrder}
        >
          <X />
          Reset order
        </button>
        <button
          className={cn(
            isDev && '__HomeHeader_ReloadDataButton', // DEBUG
            'btn btn-primary btn-plain',
            isBusy && 'disabled',
          )}
          onClick={reloadData}
        >
          <RefreshCcw className={cn(isPending && 'animate-spin')} />
          Reload data
        </button>
      </MaxWidthWrapper>
    </header>
  );
}
