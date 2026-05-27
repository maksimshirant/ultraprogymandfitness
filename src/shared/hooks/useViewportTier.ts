import * as React from 'react';

export type ViewportTier = 'mobile' | 'tablet' | 'desktop';

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

function getViewportTier(width: number): ViewportTier {
  if (width < TABLET_BREAKPOINT) {
    return 'mobile';
  }

  if (width < DESKTOP_BREAKPOINT) {
    return 'tablet';
  }

  return 'desktop';
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('resize', callback);
  window.addEventListener('orientationchange', callback);

  return () => {
    window.removeEventListener('resize', callback);
    window.removeEventListener('orientationchange', callback);
  };
}

function getSnapshot() {
  return getViewportTier(window.innerWidth);
}

function getServerSnapshot() {
  return 'mobile' as const;
}

export function useViewportTier() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
