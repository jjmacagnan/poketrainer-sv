import { describe, it, expect } from "vitest";
import { calculateEVGain, clampEVs } from "@/lib/ev-calculator";
import { MAX_EV_PER_STAT, MAX_EV_TOTAL } from "@/lib/constants";

describe("calculateEVGain", () => {
  it("returns base yield with no modifiers", () => {
    const result = calculateEVGain(
      [{ stat: "Atk", amount: 2 }],
      { powerItem: null, machoBrace: false }
    );
    expect(result).toEqual([{ stat: "Atk", amount: 2 }]);
  });

  it("adds +8 when power item matches the yield stat", () => {
    const result = calculateEVGain(
      [{ stat: "SpA", amount: 1 }],
      { powerItem: "SpA", machoBrace: false }
    );
    expect(result).toEqual([{ stat: "SpA", amount: 9 }]);
  });

  it("injects power item stat when yield does not include it", () => {
    const result = calculateEVGain(
      [{ stat: "Spe", amount: 2 }],
      { powerItem: "Atk", machoBrace: false }
    );
    expect(result).toContainEqual({ stat: "Atk", amount: 8 });
    expect(result).toContainEqual({ stat: "Spe", amount: 2 });
  });

  it("doubles yield with Macho Brace (no power item)", () => {
    const result = calculateEVGain(
      [{ stat: "HP", amount: 3 }],
      { powerItem: null, machoBrace: true }
    );
    expect(result).toEqual([{ stat: "HP", amount: 6 }]);
  });

  it("Macho Brace does NOT double when power item is active", () => {
    // Power item takes precedence — Macho Brace is ignored
    const result = calculateEVGain(
      [{ stat: "Def", amount: 1 }],
      { powerItem: "Def", machoBrace: true }
    );
    expect(result).toEqual([{ stat: "Def", amount: 9 }]);
  });

  it("handles multi-stat yields", () => {
    const result = calculateEVGain(
      [{ stat: "Atk", amount: 1 }, { stat: "Spe", amount: 1 }],
      { powerItem: null, machoBrace: false }
    );
    expect(result).toHaveLength(2);
  });
});

describe("clampEVs", () => {
  const empty = { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 };

  it("adds EVs normally within limits", () => {
    const result = clampEVs(empty, "HP", 100);
    expect(result.HP).toBe(100);
  });

  it("caps at MAX_EV_PER_STAT (252)", () => {
    const result = clampEVs(empty, "Atk", 300);
    expect(result.Atk).toBe(MAX_EV_PER_STAT);
  });

  it("does not exceed MAX_EV_TOTAL (510)", () => {
    const near = { HP: 252, Atk: 252, Def: 0, SpA: 0, SpD: 0, Spe: 0 };
    const result = clampEVs(near, "Def", 100);
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(MAX_EV_TOTAL);
    expect(result.Def).toBe(6); // only 6 remaining from 510
  });

  it("does not go below 0", () => {
    const result = clampEVs(empty, "SpD", -50);
    expect(result.SpD).toBe(0);
  });

  it("decreasing EVs works correctly", () => {
    const full = { HP: 252, Atk: 100, Def: 0, SpA: 0, SpD: 0, Spe: 0 };
    const result = clampEVs(full, "Atk", -50);
    expect(result.Atk).toBe(50);
  });
});
