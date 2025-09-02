import { useEffect, useRef, useState } from "react";

export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const handler = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, [value, delay]);

  return debouncedValue;
}