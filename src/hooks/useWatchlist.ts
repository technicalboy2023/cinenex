'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinenex_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (stored) setWatchlist(JSON.parse(stored));
      } catch { /* ignore */ }
    };
    load();
    window.addEventListener('watchlist-update', load);
    // Also listen to storage events for cross-tab sync
    window.addEventListener('storage', (e) => {
      if(e.key === STORAGE_KEY) load();
    });
    return () => {
      window.removeEventListener('watchlist-update', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  const save = useCallback((items: number[]) => {
    setWatchlist(items);
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); 
      window.dispatchEvent(new Event('watchlist-update'));
    } catch { /* ignore */ }
  }, []);

  const addToWatchlist = useCallback((movieId: number) => {
    save([...new Set([...watchlist, movieId])]);
  }, [watchlist, save]);

  const removeFromWatchlist = useCallback((movieId: number) => {
    save(watchlist.filter(id => id !== movieId));
  }, [watchlist, save]);

  const isInWatchlist = useCallback((movieId: number) =>
    watchlist.includes(movieId)
  , [watchlist]);

  const toggleWatchlist = useCallback((movieId: number) => {
    if (isInWatchlist(movieId)) removeFromWatchlist(movieId);
    else addToWatchlist(movieId);
  }, [isInWatchlist, removeFromWatchlist, addToWatchlist]);

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist };
}
