import { useEffect, useState } from 'react';

// Tracks which lessons a learner has opened. Stored as a set of topic ids in
// localStorage so progress survives refreshes and deep links. The landing
// curriculum, the nav list, and the hero meter all read from the same source.
const KEY = 'vroom:visited';
const EVENT = 'vroom:progress';

const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw : []);
  } catch { return new Set(); }
};

const write = set => {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* private mode */ }
  // Notify every hook instance in this tab; storage events only fire cross-tab.
  window.dispatchEvent(new Event(EVENT));
};

// Mark a lesson as visited once its content has been opened.
export function markVisited(id) {
  const set = read();
  if (set.has(id)) return;
  set.add(id);
  write(set);
}

export function clearProgress() {
  write(new Set());
}

// Live view of visited ids. Re-renders when progress changes in this tab or any
// other, so a reset or a newly opened lesson updates the UI immediately.
export function useProgress() {
  const [visited, setVisited] = useState(read);
  useEffect(() => {
    const sync = () => setVisited(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  return visited;
}
