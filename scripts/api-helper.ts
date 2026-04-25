import fs from "fs";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 1500; // ~13 req/s, well under rate limit

const cache = new Map<string, unknown>();

export async function fetchApi<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${POKEAPI_BASE}${path}`;

  if (cache.has(url)) return cache.get(url) as T;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(url, data);
  return data;
}

export async function fetchBatch<T, R>(
  items: T[],
  fetcher: (item: T) => Promise<R>,
  label: string
): Promise<R[]> {
  const results: R[] = [];
  const total = items.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(fetcher));
    results.push(...batchResults);

    const done = Math.min(i + BATCH_SIZE, total);
    process.stdout.write(`\r  ${label}: ${done}/${total}`);

    if (i + BATCH_SIZE < total) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  process.stdout.write("\n");
  return results;
}

export function writeJsonFile(path: string, data: unknown) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ Written: ${path}`);
}
