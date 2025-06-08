import React from 'react';

import reactLogo from '@/assets/react.svg';

import viteLogo from '/vite.svg';

import './Test.css';

import { versionInfo } from '@/config/env';
import { getConfig } from '@/api/methods/getConfig';

export function Test() {
  const [count, setCount] = React.useState(0);
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    getConfig()
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
    <>
      <div className="flex items-center justify-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div style={{ textAlign: 'left' }}>
        <pre>client test: 9</pre>
        <pre>versionInfo: {versionInfo}</pre>
        <pre>result: {result}</pre>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/Test.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}
