import React from 'react';

import reactLogo from '@/assets/react.svg';

import viteLogo from '/vite.svg';

import '@/App.css';

import { getConfig } from '@/api/methods/getConfig';

function App() {
  const [count, setCount] = React.useState(1);
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    getConfig()
      .then((data) => {
        const dataStr = JSON.stringify(data, null, 2);
        console.log('[App:Effect] fetch: result', {
          data,
        });
        setResult(dataStr);
        return data;
      })
      .catch((error) => {
        console.error('[App:Effect] fetch: caught error', {
          error,
        });
        debugger;
        setResult(String(error));
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div style={{ textAlign: 'left' }}>
        <pre>round: 7</pre>
        <pre>result: {result}</pre>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
