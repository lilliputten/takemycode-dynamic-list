import React from 'react';

import reactLogo from '@/assets/react.svg';

import viteLogo from '/vite.svg';

import './Test.css';

import { versionInfo } from '@/config/env';
import { getAPIConfigData } from '@/api/methods/getAPIConfigData';

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
