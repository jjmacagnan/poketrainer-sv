import { describe, it, expect } from "vitest";
import { calculateStat, getNatureModifier } from "@/lib/stat-calculator";

// Reference values computed from the Gen 9 formula:
// HP    = floor((2×Base + IV + floor(EV/4)) × Level/100) + Level + 10
// Other = floor((floor((2×Base + IV + floor(EV/4)) × Level/100) + 5) × NatureMod)

describe("calculateStat — HP", () => {
  it("calculates HP with full investment (base 100, 31 IV, 252 EV, L100)", () => {
    // floor((200+31+63)*1) + 110 = 294 + 110 = 404
    expect(calculateStat({ stat: "HP", base: 100, iv: 31, ev: 252, level: 100, natureModifier: 1.0 })).toBe(404);
  });

  it("calculates HP with no investment (base 100, 31 IV, 0 EV, L100)", () => {
    // floor((200+31+0)*1) + 110 = 231 + 110 = 341
    expect(calculateStat({ stat: "HP", base: 100, iv: 31, ev: 0, level: 100, natureModifier: 1.0 })).toBe(341);
  });

  it("returns 1 for Shedinja (base HP = 1)", () => {
    expect(calculateStat({ stat: "HP", base: 1, iv: 31, ev: 252, level: 100, natureModifier: 1.0 })).toBe(1);
  });

  it("ignores natureModifier for HP", () => {
    const neutral = calculateStat({ stat: "HP", base: 80, iv: 31, ev: 0, level: 100, natureModifier: 1.0 });
    const boosted = calculateStat({ stat: "HP", base: 80, iv: 31, ev: 0, level: 100, natureModifier: 1.1 });
    expect(neutral).toBe(boosted);
  });
});

describe("calculateStat — non-HP", () => {
  it("calculates Attack with full investment, neutral nature (base 100, 31 IV, 252 EV, L100)", () => {
    // floor((floor((200+31+63)*1)+5)*1.0) = floor(299) = 299
    expect(calculateStat({ stat: "Atk", base: 100, iv: 31, ev: 252, level: 100, natureModifier: 1.0 })).toBe(299);
  });

  it("applies +10% nature boost correctly", () => {
    // floor(299 * 1.1) = floor(328.9) = 328
    expect(calculateStat({ stat: "Atk", base: 100, iv: 31, ev: 252, level: 100, natureModifier: 1.1 })).toBe(328);
  });

  it("applies -10% nature penalty correctly", () => {
    // floor(299 * 0.9) = floor(269.1) = 269
    expect(calculateStat({ stat: "Atk", base: 100, iv: 31, ev: 252, level: 100, natureModifier: 0.9 })).toBe(269);
  });

  it("calculates Speed with no investment (base 80, 31 IV, 0 EV, L100)", () => {
    // floor((floor((160+31+0)*1)+5)*1.0) = floor(196) = 196
    expect(calculateStat({ stat: "Spe", base: 80, iv: 31, ev: 0, level: 100, natureModifier: 1.0 })).toBe(196);
  });

  it("handles EV floor division correctly (EV=4 gives +1, EV=3 gives +0)", () => {
    const with4 = calculateStat({ stat: "Def", base: 100, iv: 31, ev: 4, level: 100, natureModifier: 1.0 });
    const with3 = calculateStat({ stat: "Def", base: 100, iv: 31, ev: 3, level: 100, natureModifier: 1.0 });
    expect(with4).toBe(with3 + 1);
  });

  it("calculates correctly at level 50", () => {
    // floor((floor((200+31+63)*50/100)+5)*1.0) = floor((floor(147)+5)*1.0) = floor(152) = 152
    expect(calculateStat({ stat: "Atk", base: 100, iv: 31, ev: 252, level: 50, natureModifier: 1.0 })).toBe(152);
  });
});

describe("getNatureModifier", () => {
  it("returns 1.1 for the boosted stat", () => {
    expect(getNatureModifier("Atk", "Atk", "SpA")).toBe(1.1);
  });

  it("returns 0.9 for the reduced stat", () => {
    expect(getNatureModifier("SpA", "Atk", "SpA")).toBe(0.9);
  });

  it("returns 1.0 for an unaffected stat", () => {
    expect(getNatureModifier("Spe", "Atk", "SpA")).toBe(1.0);
  });

  it("returns 1.0 for neutral nature (both null)", () => {
    expect(getNatureModifier("Atk", null, null)).toBe(1.0);
  });
});
