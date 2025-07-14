import React from 'react';
import { Check, EllipsisVertical, RefreshCcw, ThumbsUp, X } from 'lucide-react';

import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

interface THomeHeaderProps {
  actualFilter: string;
  hasChecked: boolean;
  hasData: boolean;
  isNonBlockingPending: boolean;
  isPending: boolean;
  isReordered: boolean;
  reloadData: () => void;
  resetChecked: () => void;
  resetOrder: () => void;
  saveFilter: (filterText: string) => void;
}

export function HomeHeader(props: THomeHeaderProps) {
  const {
    actualFilter,
    hasChecked,
    hasData,
    isNonBlockingPending,
    isPending,
    isReordered,
    reloadData,
    resetChecked,
    resetOrder,
    saveFilter,
  } = props;

  const [isMenuOpen, toggleMenu] = React.useState(false);

  const [filterText, setFilterText] = React.useState(actualFilter);
  const [isFilterChanged, setFilterChanged] = React.useState(false);

  React.useEffect(() => {
    setFilterText(actualFilter);
  }, [actualFilter]);

  const isBusy = !hasData || isPending;
  const isOperating = isBusy || isNonBlockingPending;

  const indicatorIcon = (
    <>
      <div
        className={cn(
          isDev && '__HomeHeader_IndicatorIcon', // DEBUG
          'btn btn-icon inactive flex',
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
    </>
  );

  const filterInput = (
    <>
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
    </>
  );

  const closeMenuAndDo = (func: () => void) => () => {
    toggleMenu(false);
    func();
  };

  React.useEffect(() => {
    if (isMenuOpen) {
      const closeMenu = () => toggleMenu(false);
      const detectEsc = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          closeMenu();
        }
      };
      document.addEventListener('mouseup', closeMenu, true);
      document.addEventListener('keydown', detectEsc);
      return () => {
        document.removeEventListener('mouseup', closeMenu);
        document.removeEventListener('keydown', detectEsc);
      };
    }
  }, [isMenuOpen, toggleMenu]);

  const createActionButons = (inMenu: boolean) => {
    const inInline = !inMenu;
    return [
      inInline && (
        <button
          key="__HomeHeader_ApplyFilterButton"
          className={cn(
            isDev && '__HomeHeader_ApplyFilterButton', // DEBUG
            'btn btn-primary btn-plain btn-sm-text flex',
            (isBusy || !isFilterChanged) && 'disabled',
          )}
          onClick={closeMenuAndDo(() => {
            saveFilter(filterText);
            setFilterChanged(false);
          })}
          title="Apply filter"
        >
          <Check />
          <span>Apply filter</span>
        </button>
      ),
      inInline && (
        <button
          key="__HomeHeader_ResetFilterButton"
          className={cn(
            isDev && '__HomeHeader_ResetFilterButton', // DEBUG
            'btn btn-primary btn-plain btn-sm-text flex',
            (isBusy || !actualFilter) && 'disabled',
          )}
          onClick={closeMenuAndDo(() => {
            setFilterText('');
            saveFilter('');
            setFilterChanged(false);
          })}
          title="Reset filter"
        >
          <X />
          <span>Reset filter</span>
        </button>
      ),
      inMenu && (
        <button
          key="__HomeHeader_ResetOrderButton"
          className={cn(
            isDev && '__HomeHeader_ResetOrderButton', // DEBUG
            'btn btn-primary btn-plain btn-text flex',
            (isBusy || !isReordered) && 'disabled',
          )}
          onClick={closeMenuAndDo(resetOrder)}
          title="Reset order"
        >
          <X />
          <span>Reset order</span>
        </button>
      ),
      inMenu && (
        <button
          key="__HomeHeader_ResetCheckedButton"
          className={cn(
            isDev && '__HomeHeader_ResetCheckedButton', // DEBUG
            'btn btn-primary btn-plain btn-text flex',
            (isBusy || !hasChecked) && 'disabled',
          )}
          onClick={closeMenuAndDo(resetChecked)}
          title="Reset checked records"
        >
          <X />
          <span>Reset checked records</span>
        </button>
      ),
      <button
        key="__HomeHeader_ReloadDataButton"
        className={cn(
          isDev && '__HomeHeader_ReloadDataButton', // DEBUG
          'btn btn-primary btn-plain btn-text flex',
          inInline && 'max-md:hidden',
          inMenu && 'md:hidden',
          isBusy && 'disabled',
        )}
        onClick={closeMenuAndDo(reloadData)}
        title="Reload data"
      >
        <RefreshCcw />
        <span>Reload data</span>
      </button>,
    ].filter(Boolean);
  };
  const inlineActionButons = createActionButons(false);
  const menuActionButons = createActionButons(true);

  const dropdownMenu = (
    <div
      className={cn(
        isDev && '__Menu', // DEBUG
        'focus:outline-hidden absolute right-0 z-10 mt-12 w-64 origin-top-right rounded-md',
        'flex flex-col gap-2 p-2',
        'bg-(--primaryColor)/80 shadow-lg ring-1 ring-black/5',
        !isMenuOpen && 'hidden',
      )}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      {menuActionButons}
    </div>
  );

  const menuButton = (
    <>
      <div
        className={cn(
          isDev && '__HomeHeader_MenuButton', // DEBUG
          'absolute right-0',
          'btn-base flex',
          'text-white',
          isMenuOpen && 'bg-(--primaryColor)/30',
          'hover:bg-(--primaryColor)/50',
          'cursor-pointer',
        )}
        title={isMenuOpen ? 'Hide menu' : 'Show menu'}
        onClick={() => toggleMenu(!isMenuOpen)}
      >
        <EllipsisVertical />
      </div>
    </>
  );

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
          'flex flex-wrap items-stretch gap-2 pr-10',
          'relative',
        )}
      >
        {indicatorIcon}
        {filterInput}
        {inlineActionButons}
        {menuButton}
        {dropdownMenu}
      </MaxWidthWrapper>
    </header>
  );
}
