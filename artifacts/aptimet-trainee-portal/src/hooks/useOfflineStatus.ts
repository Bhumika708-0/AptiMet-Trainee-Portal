import { useState, useEffect } from 'react';

export type ConnectivityMode = 'online' | 'low-bandwidth' | 'offline';

export function useOfflineStatus() {
  const [mode, setMode] = useState<ConnectivityMode>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }
    return (localStorage.getItem('aptimet_net_mode') as ConnectivityMode) || 'online';
  });

  const [cachedItemsCount, setCachedItemsCount] = useState(12);

  useEffect(() => {
    const handleOnline = () => {
      const stored = localStorage.getItem('aptimet_net_mode') as ConnectivityMode;
      if (!stored || stored === 'online') {
        setMode('online');
      }
    };

    const handleOffline = () => {
      setMode('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register simple Service Worker cache if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW register attempt
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const changeMode = (newMode: ConnectivityMode) => {
    setMode(newMode);
    localStorage.setItem('aptimet_net_mode', newMode);
  };

  return {
    mode,
    isOffline: mode === 'offline',
    isLowBandwidth: mode === 'low-bandwidth',
    cachedItemsCount,
    setMode: changeMode,
  };
}
