import { useEffect, useRef, useState } from "react";

interface FetchOptions extends RequestInit {
  revalidateInterval?: number; // ms
}

interface CacheEntry<T> {
  data?: T;
  error?: unknown;
  timestamp: number;
  promise?: Promise<T>;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function useOptimizedFetch<T = unknown>(
  url: string | null,
  options?: FetchOptions
): { data: T | undefined; error: unknown; isLoading: boolean; mutate: () => void } {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!url);
  const [forceUpdate, setForceUpdate] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const revalidateInterval = options?.revalidateInterval ?? 0;

  // Helper to fetch and update cache
  const fetchData = async (signal?: AbortSignal) => {
    if (!url) return;
    try {
      setIsLoading(true);
      const res = await fetch(url, { ...options, signal });
      if (!res.ok) throw new Error(res.statusText);
      const json = (await res.json()) as T;
      cache.set(url, { data: json, error: undefined, timestamp: Date.now() });
      setData(json);
      setError(undefined);
    } catch (err) {
      if ((err as { name?: string }).name !== "AbortError") {
        setError(err);
        cache.set(url, { data: undefined, error: err, timestamp: Date.now() });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Stale-while-revalidate logic
  useEffect(() => {
    if (!url) return;
    const cacheEntry = cache.get(url);
    const now = Date.now();
    const isStale =
      !cacheEntry || (revalidateInterval > 0 && now - cacheEntry.timestamp > revalidateInterval);
    if (cacheEntry && cacheEntry.data !== undefined) {
      setData(cacheEntry.data as T);
      setError(cacheEntry.error);
      setIsLoading(isStale);
    }
    if (isStale) {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      fetchData(controller.signal);
    }
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, forceUpdate]);

  // Optional polling for revalidation
  useEffect(() => {
    if (!url || !revalidateInterval) return;
    const interval = setInterval(() => {
      setForceUpdate((c) => c + 1);
    }, revalidateInterval);
    return () => clearInterval(interval);
  }, [url, revalidateInterval]);

  // Manual mutate
  const mutate = () => setForceUpdate((c) => c + 1);

  return { data, error, isLoading, mutate };
}