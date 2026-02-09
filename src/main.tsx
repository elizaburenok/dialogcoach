import React from 'react';
import ReactDOM from 'react-dom/client';
import './font-family/fonts.css';
import './tokens/css-variables.css';
import { App } from './App';

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7243/ingest/0fd66834-7408-4585-badd-cfcda61391b4', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    runId: 'pre-fix',
    hypothesisId: 'H1',
    location: 'src/main.tsx:12',
    message: 'main entry and root lookup',
    data: { rootExists: !!rootElement },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/0fd66834-7408-4585-badd-cfcda61391b4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runId: 'pre-fix',
      hypothesisId: 'H2',
      location: 'src/main.tsx:24',
      message: 'root element missing, aborting React render',
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/0fd66834-7408-4585-badd-cfcda61391b4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'src/main.tsx:42',
        message: 'React root render succeeded',
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/0fd66834-7408-4585-badd-cfcda61391b4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'src/main.tsx:53',
        message: 'React root render threw',
        data: { errorMessage: error instanceof Error ? error.message : String(error) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }
}
