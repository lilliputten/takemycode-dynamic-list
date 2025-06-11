import { isDev } from '@/config/env';
import { cn } from '@/lib/utils';
import { MaxWidthWrapper } from '@/blocks/MaxWidthWrapper';

import viteLogo from '/vite.svg';

const logoSize = 48;

export function AppNavBar() {
  return (
    <nav
      className={cn(
        isDev && '__AppNav', // DEBUG
        'bg-(--primaryColor)',
        'px-4 py-2',
      )}
    >
      <MaxWidthWrapper
        className={cn(
          isDev && '__AppNav_Wrapper', // DEBUG
          'flex items-center justify-center gap-4',
        )}
      >
        <div
          className={cn(
            isDev && '__AppNav_LogoBox', // DEBUG
          )}
        >
          <img
            src={viteLogo}
            alt="Vite logo"
            width={logoSize}
            height={logoSize}
            className={cn(
              isDev && '__AppNav_Logo', // DEBUG
            )}
          />
        </div>
        <div
          className={cn(
            isDev && '__AppNav_Title', // DEBUG
            'truncate text-xl',
          )}
        >
          Dynamic List Demo App
        </div>
        {/* // UNUSED: Top-lvel menu
        <div
          className={cn(
            isDev && '__AppNav_MenuBox', // DEBUG
            'flex items-center justify-center gap-3',
          )}
        >
          <Link to="/" className="text-white">
            Home
          </Link>
          <Link to="/hello" className="text-white">
            Hello
          </Link>
          <Link to="/test" className="text-white">
            Test
          </Link>
        </div>
        */}
      </MaxWidthWrapper>
    </nav>
  );
}
