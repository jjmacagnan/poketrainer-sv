"use client";

import { useMemo } from "react";

/**
 * Fuzzy-ish search: matches if query is a substring of the name (case-insensitive),
 * or if all words in the query appear somewhere in the name.
 */
export function usePokemonSearch<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    const words = q.split(/\s+/);
    return items.filter((item) => {
      const name = item.name.toLowerCase();
      // Direct substring match
      if (name.includes(q)) return true;
      // All words match
      return words.every((w) => name.includes(w));
    });
  }, [items, query]);
}
