import React from 'react';

import reactLogo from '@/assets/react.svg';

import viteLogo from '/vite.svg';

import './Test.css';

import { isDev, versionInfo } from '@/config/env';
import { getAPIConfigData } from '@/api/methods/getAPIConfigData';
import { cn } from '@/lib';

export function Test() {
  const [count, setCount] = React.useState(0);
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    getAPIConfigData()
      .then((data) => {
        const dataStr = JSON.stringify(data, null, 2);
        /* console.log('[Test:Effect] fetch: result', {
         *   data,
         * });
         */
        setResult(dataStr);
        return data;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('[Test:Effect] fetch: caught error', {
          error,
        });
        setResult(String(error));
      });
  }, []);

  return (
    <div className="relative flex flex-col gap-4 overflow-auto p-4">
      <div className="flex items-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-bold text-5xl">Vite + React</h1>

      <h2 className="text-bold text-2xl">Test:</h2>
      <div className="relative flex flex-col">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="shadow-xs inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Options
              <svg
                className="-mr-1 size-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className={cn(
              isDev && '__Menu', // DEBUG
              'focus:outline-hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md',
              'bg-(--primaryColor) text-white shadow-lg ring-1 ring-black/5',
              // 'bg-white shadow-lg ring-1 ring-black/5',
              // 'hidden',
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <a
                href="#"
                className="block px-4 py-2"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
              >
                Account settings
              </a>
              <a
                href="#"
                className="block px-4 py-2"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-1"
              >
                Support
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-2"
              >
                License
              </a>
              <form method="POST" action="#" role="none">
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-3"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-bold text-2xl">API request result:</h2>
      <div className="relative flex flex-col gap-4 p-4 text-xs opacity-50">
        <pre>client test: 9</pre>
        <pre>versionInfo: {versionInfo}</pre>
        <pre>result: {result}</pre>
      </div>
      <div className="card">
        <button className="btn btn-blue" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}
