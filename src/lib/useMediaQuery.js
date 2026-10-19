import { useSyncExternalStore } from 'react';

// Phones get their own layout: a bottom bar for moving between lessons and a bottom sheet for the lesson list.
export const MOBILE_QUERY = '(max-width: 767px)';

export function useMediaQuery(query) {
  return useSyncExternalStore(
    notify => {
      const list = window.matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
