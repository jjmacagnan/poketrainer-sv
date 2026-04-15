/**
 * Master script — runs all PokéAPI fetchers in sequence.
 * Usage: npx tsx scripts/fetch-all.ts
 *
 * Generates:
 *   src/data/generated/pokemon.json
 *   src/data/generated/natures.json
 *   src/data/generated/moves.json
 *   src/data/generated/abilities.json
 *   src/data/generated/items.json
 *   src/data/generated/types.json
 *   src/data/generated/berries.json
 *   src/data/generated/berry-flavors.json
 *   src/data/generated/evolution-chains.json
 *   src/data/generated/move-meta.json
 *   src/data/generated/version-groups.json
 */

import { execSync } from "child_process";
import path from "path";

const scripts = [
  "fetch-pokemon.ts",
  "fetch-natures.ts",
  "fetch-moves.ts",
  "fetch-abilities.ts",
  "fetch-items.ts",
  "fetch-types.ts",
  "fetch-berries.ts",
  "fetch-berry-flavors.ts",
  "fetch-evolution-chains.ts",
  "fetch-move-meta.ts",
  "fetch-version-groups.ts",
];

async function main() {
  console.log("🚀 PokéTrainer SV — Fetching all data from PokéAPI\n");
  console.log("=".repeat(50));

  const start = Date.now();

  for (const script of scripts) {
    console.log(`\n▶ Running ${script}...\n`);
    const scriptPath = path.join(__dirname, script);
    execSync(`npx tsx "${scriptPath}"`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(50));
  console.log(`\n🎉 All data fetched in ${elapsed}s`);
  console.log("   Files generated in src/data/generated/");
}

main().catch(console.error);
