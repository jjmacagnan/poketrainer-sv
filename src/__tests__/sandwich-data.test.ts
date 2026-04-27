import { describe, it, expect } from "vitest";
import {
  ALL_RECIPES,
  MASS_OUTBREAK_GUIDE,
  SHINY_GUIDE,
} from "@/data/sandwich-guide";

describe("ALL_RECIPES", () => {
  it("contains no duplicate base names", () => {
    const keys = ALL_RECIPES.map((r) => r.name.replace(/\s+#\d+$/, "").toLowerCase());
    const unique = new Set(keys);
    expect(unique.size).toBe(ALL_RECIPES.length);
  });

  it("includes shiny recipes for all 18 types", () => {
    const shinyTypes = new Set(SHINY_GUIDE.map((e) => e.type));
    expect(shinyTypes.size).toBe(18);
  });

  it("includes Mass Outbreak recipes", () => {
    const outbreakInSearch = ALL_RECIPES.filter((r) => r.name.startsWith("Mass Outbreak:"));
    expect(outbreakInSearch.length).toBe(MASS_OUTBREAK_GUIDE.length);
  });

  it("outbreak entries for each type in MASS_OUTBREAK_GUIDE appear in ALL_RECIPES", () => {
    for (const entry of MASS_OUTBREAK_GUIDE) {
      const found = ALL_RECIPES.find((r) => r.name === `Mass Outbreak: ${entry.type}`);
      expect(found, `Missing Mass Outbreak: ${entry.type}`).toBeDefined();
    }
  });

  it("all recipes have required fields", () => {
    for (const r of ALL_RECIPES) {
      expect(r.name, "missing name").toBeTruthy();
      expect(r.type, `missing type in ${r.name}`).toBeTruthy();
      expect(Array.isArray(r.powers), `powers not array in ${r.name}`).toBe(true);
      expect(r.powers.length, `no powers in ${r.name}`).toBeGreaterThan(0);
    }
  });
});
