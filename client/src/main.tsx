import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App';

const node = document.getElementById('root');

const VITE_NO_STRICT_MODE = import.meta.env.VITE_NO_STRICT_MODE;
const isDev = import.meta.env.DEV; // process.env.NODE_ENV === 'development';

console.log('[main]', {
  isDev,
  VITE_NO_STRICT_MODE,
});

let content = <App />;

if (isDev && !VITE_NO_STRICT_MODE) {
  content = (
    <React.StrictMode>
      {/* Wrap content in StrictMode if development mode */}
      {content}
    </React.StrictMode>
  );
}

createRoot(node!).render(content);
