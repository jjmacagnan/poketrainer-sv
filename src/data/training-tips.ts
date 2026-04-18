import type { StatName } from "@/lib/constants";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items";

export interface PowerItem {
  name: string;
  stat: StatName;
  bonus: 8;
  where: string;
  sprite: string;
}

export interface EVBerry {
  name: string;
  stat: StatName;
  reduction: 10;
  sprite: string;
}

export const POWER_ITEMS_DATA: PowerItem[] = [
  { name: "Power Weight", stat: "HP",  bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-weight.png` },
  { name: "Power Bracer", stat: "Atk", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-bracer.png` },
  { name: "Power Belt",   stat: "Def", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-belt.png` },
  { name: "Power Lens",   stat: "SpA", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-lens.png` },
  { name: "Power Band",   stat: "SpD", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-band.png` },
  { name: "Power Anklet", stat: "Spe", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa", sprite: `${SPRITE_BASE}/power-anklet.png` },
];

export const EV_BERRIES_DATA: EVBerry[] = [
  { name: "Pomeg Berry",  stat: "HP",  reduction: 10, sprite: `${SPRITE_BASE}/pomeg-berry.png` },
  { name: "Kelpsy Berry", stat: "Atk", reduction: 10, sprite: `${SPRITE_BASE}/kelpsy-berry.png` },
  { name: "Qualot Berry", stat: "Def", reduction: 10, sprite: `${SPRITE_BASE}/qualot-berry.png` },
  { name: "Hondew Berry", stat: "SpA", reduction: 10, sprite: `${SPRITE_BASE}/hondew-berry.png` },
  { name: "Grepa Berry",  stat: "SpD", reduction: 10, sprite: `${SPRITE_BASE}/grepa-berry.png` },
  { name: "Tamato Berry", stat: "Spe", reduction: 10, sprite: `${SPRITE_BASE}/tamato-berry.png` },
];

export function calcBattles(
  baseYield: number,
  powerItem: boolean,
  machoBrace: boolean
): { evsPerBattle: number; battles252: number; battles152: number } {
  const powerBonus = powerItem ? 8 : 0;
  const machoMultiplier = machoBrace && !powerItem ? 2 : 1;
  const evsPerBattle = (baseYield + powerBonus) * machoMultiplier;
  if (evsPerBattle === 0) return { evsPerBattle: 0, battles252: 0, battles152: 0 };
  return {
    evsPerBattle,
    battles252: Math.ceil(252 / evsPerBattle),
    battles152: Math.ceil(152 / evsPerBattle),
  };
}
