import React from 'react';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import '@/App.css';

const vercelUrl = import.meta.env.VERCEL_URL;
const viteVercelUrl = import.meta.env.VITE_VERCEL_URL;
const defaultDevRootHost = 'http://localhost:51732'; // Vite default local dev server url
const defaultDevApiHost = 'http://localhost:3000'; // Vite default local dev server url
const rootHost = vercelUrl || viteVercelUrl || defaultDevRootHost;
const apiHost = vercelUrl || viteVercelUrl || defaultDevApiHost;
const apiUrl = apiHost + '/api';
const testApiUrl = apiUrl + '/test/';

function App() {
  const [count, setCount] = React.useState(1);
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    const url = testApiUrl;
    const method = 'GET';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'X-CSRFToken': csrftoken || '',
      // Credentials: 'include',
      // Cookie: csrftoken && `csrftoken=${csrftoken}`,
      // 'X-Session-Token': sessionId, // X-Session-Token
      // 'Accept-Language': 'ru', // django_language=ru; content-language: ru;
    };
    console.log('[App:Effect] fetch: start', {
      vercelUrl,
      viteVercelUrl,
      defaultDevRootHost,
      rootHost,
      url,
      // method,
      // headers,
    });
    fetch(url, {
      method,
      headers,
      // credentials: 'include',
      // body: requestData ? JSON.stringify(requestData) : null,
    })
      .then(async (res) => {
        const { ok, status, statusText } = res;
        // TODO: Check is it json?
        let data: (unknown & { detail?: string }) | undefined = undefined;
        let dataStr: string = '';
        try {
          dataStr = await res.text();
          data = JSON.parse(dataStr);
        } catch (
          _e // eslint-disable-line @typescript-eslint/no-unused-vars
        ) {
          // NOOP
          // TODO: To generate an error?
        }
        if (!ok || status !== 200) {
          const errMsg = ['Error:' + ' ' + status, data?.detail || statusText]
            .filter(Boolean)
            .join(': ');
          // eslint-disable-next-line no-console
          console.error('[App:Effect] fetch: not ok error', errMsg, {
            ok,
            data,
            statusText,
            status,
            res,
            url,
            // requestData,
            // method,
            // headers,
          });
          debugger; // eslint-disable-line no-debugger
          throw new Error(errMsg);
        }
        console.log('[App:Effect] fetch: result', {
          res,
          data,
          dataStr,
        });
        setResult(dataStr);
        return data;
      })
      .catch((error) => {
        console.error('[App:Effect] fetch: caught error', {
          error,
          url,
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
        <pre>vercelUrl: {vercelUrl}</pre>
        <pre>viteVercelUrl: {viteVercelUrl}</pre>
        <pre>defaultDevRootHost: {defaultDevRootHost}</pre>
        <pre>defaultDevApiHost: {defaultDevApiHost}</pre>
        <pre>rootHost: {rootHost}</pre>
        <pre>paiHost: {apiHost}</pre>
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
