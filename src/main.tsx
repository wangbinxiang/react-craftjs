import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/app.css';

// Vite mounts the example from a single browser entry instead of Next's page router.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
