/**
 * Fetches all berry flavors from PokéAPI.
 * Used for Nature Calc — mapping natures to flavor preferences.
 * Outputs: src/data/generated/berry-flavors.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface FlavorResponse {
  id: number;
  name: string;
  berries: { potency: number; berry: { name: string } }[];
  contest_type: { name: string };
  names: { name: string; language: { name: string } }[];
}

interface OutputFlavor {
  id: number;
  name: string;
  contestType: string;
  localizedName: string;
  berries: { potency: number; berry: string }[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchFlavor(id: number): Promise<OutputFlavor> {
  const data = await fetchApi<FlavorResponse>(`/berry-flavor/${id}/`);

  const enName =
    data.names?.find((n) => n.language.name === "en")?.name || capitalize(data.name);

  return {
    id: data.id,
    name: data.name,
    contestType: capitalize(data.contest_type.name),
    localizedName: enName,
    berries: data.berries.map((b) => ({
      potency: b.potency,
      berry: b.berry.name,
    })),
  };
}

async function main() {
  console.log("🔄 Fetching berry flavors from PokéAPI...\n");

  // There are 5 flavors: spicy, dry, sweet, bitter, sour
  const ids = [1, 2, 3, 4, 5];

  const flavors = await fetchBatch(ids, fetchFlavor, "flavors");

  const outPath = path.join(
    __dirname,
    "../src/data/generated/berry-flavors.json"
  );
  writeJsonFile(outPath, flavors);

  console.log(`\n✅ ${flavors.length} berry flavors fetched`);
}

main().catch(console.error);
