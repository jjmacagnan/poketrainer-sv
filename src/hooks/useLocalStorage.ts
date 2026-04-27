"use client";

import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always start with initialValue to match server render, then hydrate from localStorage.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item) as T;
        queueMicrotask(() => setStoredValue(parsed));
      }
    } catch {
      // localStorage unavailable or JSON parse error
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // storage full or unavailable
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
