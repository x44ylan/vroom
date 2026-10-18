import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Mirror each slider's value into --fill so the glass track can show progress.
const syncRangeFill = el => {
  const min = Number(el.min || 0), max = Number(el.max || 100);
  el.style.setProperty('--fill', `${((Number(el.value) - min) / (max - min || 1)) * 100}%`);
};
document.addEventListener('input', e => { if (e.target.matches?.('input[type=range]')) syncRangeFill(e.target); });
new MutationObserver(() => document.querySelectorAll('input[type=range]').forEach(syncRangeFill)).observe(document.documentElement, { childList: true, subtree: true });
import '@fontsource-variable/inter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
