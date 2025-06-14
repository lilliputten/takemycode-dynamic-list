import { Copyright, Github } from 'lucide-react';

import { isDev, versionInfo } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';
import { getRemSize } from '@/lib';

const remSize = getRemSize();

export function HomeFooter() {
  return (
    <footer
      className={cn(
        isDev && '__HomeFooter', // DEBUG
        'bg-(--primaryColor)/20',
        'px-4 py-2',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__HomeFooter_Wrapper', // DEBUG
          'text-sm',
          'opacity-50',
          'flex flex-wrap justify-between gap-x-4 gap-y-1',
          'truncate',
        )}
      >
        <span
          className={cn(
            isDev && '__HomeFooter_Copy', // DEBUG
            'truncate',
          )}
        >
          {versionInfo}
        </span>
        <span
          className={cn(
            isDev && '__HomeFooter_Info', // DEBUG
            'flex flex-wrap items-center gap-x-4 gap-y-1',
            'truncate',
          )}
        >
          <a
            href="https://lilliputten.com/"
            target="_blank"
            rel="noreferrer"
            className={cn(
              isDev && '__HomeFooter_Link', // DEBUG
              'flex items-center gap-1',
              'transition-all hover:underline hover:opacity-80',
              'truncate',
            )}
          >
            <Copyright size={remSize} />
            lilliputten.com
          </a>
          <a
            href="https://github.com/lilliputten/takemycode-dynamic-list/"
            target="_blank"
            rel="noreferrer"
            className={cn(
              isDev && '__HomeFooter_Link', // DEBUG
              'flex items-center gap-1',
              'transition-all hover:underline hover:opacity-80',
              'truncate',
            )}
          >
            <Github size={remSize} />
            GitHub repository
          </a>
        </span>
      </MaxWidthWrapper>
    </footer>
  );
}
