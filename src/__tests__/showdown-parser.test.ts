import { describe, it, expect } from "vitest";
import { parseShowdown, exportShowdown } from "@/lib/showdown-parser";
import type { ShowdownSet } from "@/lib/showdown-parser";

const GARCHOMP_TEXT = `Garchomp @ Choice Band
Ability: Rough Skin
Tera Type: Dragon
EVs: 252 Atk / 252 Spe / 4 HP
Jolly Nature
- Earthquake
- Outrage
- Stone Edge
- Swords Dance`;

describe("parseShowdown", () => {
  it("parses name and item", () => {
    const set = parseShowdown(GARCHOMP_TEXT)!;
    expect(set.name).toBe("Garchomp");
    expect(set.item).toBe("Choice Band");
  });

  it("parses ability", () => {
    expect(parseShowdown(GARCHOMP_TEXT)!.ability).toBe("Rough Skin");
  });

  it("parses Tera Type", () => {
    expect(parseShowdown(GARCHOMP_TEXT)!.teraType).toBe("Dragon");
  });

  it("parses nature", () => {
    expect(parseShowdown(GARCHOMP_TEXT)!.nature).toBe("Jolly");
  });

  it("parses EVs correctly", () => {
    const evs = parseShowdown(GARCHOMP_TEXT)!.evs;
    expect(evs.Atk).toBe(252);
    expect(evs.Spe).toBe(252);
    expect(evs.HP).toBe(4);
    expect(evs.Def).toBe(0);
  });

  it("defaults IVs to 31", () => {
    const ivs = parseShowdown(GARCHOMP_TEXT)!.ivs;
    expect(ivs.HP).toBe(31);
    expect(ivs.Atk).toBe(31);
  });

  it("parses custom IVs", () => {
    const text = `Porygon2 @ Eviolite
Ability: Trace
IVs: 0 Atk
Sassy Nature
- Recover`;
    const ivs = parseShowdown(text)!.ivs;
    expect(ivs.Atk).toBe(0);
    expect(ivs.HP).toBe(31);
  });

  it("parses moves in order", () => {
    const moves = parseShowdown(GARCHOMP_TEXT)!.moves;
    expect(moves).toEqual(["Earthquake", "Outrage", "Stone Edge", "Swords Dance"]);
  });

  it("defaults level to 100", () => {
    expect(parseShowdown(GARCHOMP_TEXT)!.level).toBe(100);
  });

  it("parses explicit level", () => {
    const text = `Pikachu @ Light Ball\nAbility: Static\nLevel: 50\nTimid Nature\n- Thunderbolt`;
    expect(parseShowdown(text)!.level).toBe(50);
  });

  it("returns null for empty input", () => {
    expect(parseShowdown("")).toBeNull();
    expect(parseShowdown("   ")).toBeNull();
  });

  it("parses set with no item", () => {
    const text = `Alakazam\nAbility: Magic Guard\nTimid Nature\n- Psychic`;
    const set = parseShowdown(text)!;
    expect(set.name).toBe("Alakazam");
    expect(set.item).toBe("");
  });
});

describe("exportShowdown", () => {
  const base: ShowdownSet = {
    name: "Garchomp",
    item: "Choice Band",
    ability: "Rough Skin",
    teraType: "Dragon",
    nature: "Jolly",
    evs: { HP: 4, Atk: 252, Def: 0, SpA: 0, SpD: 0, Spe: 252 },
    ivs: { HP: 31, Atk: 31, Def: 31, SpA: 31, SpD: 31, Spe: 31 },
    moves: ["Earthquake", "Outrage", "Stone Edge", "Swords Dance"],
    level: 100,
  };

  it("exports name and item on first line", () => {
    const lines = exportShowdown(base).split("\n");
    expect(lines[0]).toBe("Garchomp @ Choice Band");
  });

  it("exports EVs, skipping zero stats", () => {
    const output = exportShowdown(base);
    expect(output).toContain("EVs: 4 HP / 252 Atk / 252 Spe");
  });

  it("omits IVs line when all are 31", () => {
    expect(exportShowdown(base)).not.toContain("IVs:");
  });

  it("includes IVs line for non-31 values only", () => {
    const set = { ...base, ivs: { ...base.ivs, Atk: 0 } };
    const output = exportShowdown(set);
    expect(output).toContain("IVs: 0 Atk");
  });

  it("omits Level line when level is 100", () => {
    expect(exportShowdown(base)).not.toContain("Level:");
  });

  it("includes Level line when not 100", () => {
    const set = { ...base, level: 50 };
    expect(exportShowdown(set)).toContain("Level: 50");
  });

  it("exports moves with '- ' prefix", () => {
    const output = exportShowdown(base);
    expect(output).toContain("- Earthquake");
    expect(output).toContain("- Swords Dance");
  });

  it("round-trips parse → export → parse", () => {
    const parsed = parseShowdown(GARCHOMP_TEXT)!;
    const exported = exportShowdown(parsed);
    const reparsed = parseShowdown(exported)!;
    expect(reparsed.name).toBe(parsed.name);
    expect(reparsed.nature).toBe(parsed.nature);
    expect(reparsed.evs).toEqual(parsed.evs);
    expect(reparsed.moves).toEqual(parsed.moves);
  });
});
