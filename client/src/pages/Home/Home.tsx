import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';

import { HomeBody } from './HomeBody';
import { HomeFooter } from './HomeFooter';
import { HomeHeader } from './HomeHeader';

export function Home() {
  return (
    <div
      className={cn(
        isDev && '__Home', // DEBUG
        'flex flex-1 flex-col',
        'overflow-hidden',
      )}
    >
      <HomeHeader />
      <HomeBody />
      <HomeFooter />
    </div>
  );
}
