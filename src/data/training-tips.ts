import type { StatName } from "@/lib/constants";

export interface PowerItem {
  name: string;
  stat: StatName;
  bonus: 8;
  where: string;
}

export interface EVBerry {
  name: string;
  stat: StatName;
  reduction: 10;
}

export const POWER_ITEMS_DATA: PowerItem[] = [
  { name: "Power Weight", stat: "HP",  bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Bracer", stat: "Atk", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Belt",   stat: "Def", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Lens",   stat: "SpA", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Band",   stat: "SpD", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Anklet", stat: "Spe", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
];

export const EV_BERRIES_DATA: EVBerry[] = [
  { name: "Pomeg Berry",  stat: "HP",  reduction: 10 },
  { name: "Kelpsy Berry", stat: "Atk", reduction: 10 },
  { name: "Qualot Berry", stat: "Def", reduction: 10 },
  { name: "Hondew Berry", stat: "SpA", reduction: 10 },
  { name: "Grepa Berry",  stat: "SpD", reduction: 10 },
  { name: "Tamato Berry", stat: "Spe", reduction: 10 },
];

export function calcBattles(
  baseYield: number,
  powerItem: boolean,
  pokerus: boolean,
  machoBrace: boolean
): { evsPerBattle: number; battles252: number; battles152: number } {
  const powerBonus = powerItem ? 8 : 0;
  const machoMultiplier = machoBrace && !powerItem ? 2 : 1;
  const pokerusMultiplier = pokerus ? 2 : 1;
  const totalMultiplier = machoMultiplier * pokerusMultiplier;
  const evsPerBattle = (baseYield + powerBonus) * totalMultiplier;
  return {
    evsPerBattle,
    battles252: Math.ceil(252 / evsPerBattle),
    battles152: Math.ceil(152 / evsPerBattle),
  };
}
