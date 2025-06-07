import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App';

const node = document.getElementById('root');

createRoot(node!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
