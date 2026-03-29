'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinenex_recently_viewed';
const MAX_ITEMS = 20;

interface RecentItem {
  id: number;
  title: string;
  posterPath: string | null;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const addRecentlyViewed = useCallback((movie: { id: number; title: string; posterPath: string | null }) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== movie.id);
      const updated = [{ ...movie, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return { recentlyViewed: items, addRecentlyViewed, clearRecentlyViewed };
}
