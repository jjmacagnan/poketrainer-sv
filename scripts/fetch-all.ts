/**
 * Master script — runs all PokéAPI fetchers in sequence.
 * Usage: npx tsx scripts/fetch-all.ts
 *
 * Generates:
 *   src/data/generated/pokemon.json
 *   src/data/generated/natures.json
 *   src/data/generated/moves.json
 */

import { execSync } from "child_process";
import path from "path";

const scripts = ["fetch-pokemon.ts", "fetch-natures.ts", "fetch-moves.ts"];

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
