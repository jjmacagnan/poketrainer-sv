import type { PokemonType } from "./types";

export interface RaidBoss {
  name: string;
  stars: 5 | 6 | 7;
  teraType: PokemonType;
  nationalDex: number;
  notes?: string;
}

// Notable Tera Raid bosses in Scarlet & Violet
export const RAID_BOSSES: RaidBoss[] = [
  // 7-Star Event Raids
  { name: "Charizard", stars: 7, teraType: "Dragon", nationalDex: 6, notes: "Unrivaled Mark" },
  { name: "Cinderace", stars: 7, teraType: "Fighting", nationalDex: 815, notes: "Unrivaled Mark" },
  { name: "Greninja", stars: 7, teraType: "Poison", nationalDex: 658, notes: "Unrivaled Mark" },
  { name: "Decidueye", stars: 7, teraType: "Fighting", nationalDex: 724, notes: "Unrivaled Mark" },
  { name: "Typhlosion", stars: 7, teraType: "Ghost", nationalDex: 157, notes: "Unrivaled Mark" },
  { name: "Samurott", stars: 7, teraType: "Bug", nationalDex: 503, notes: "Unrivaled Mark" },
  { name: "Blaziken", stars: 7, teraType: "Fighting", nationalDex: 257, notes: "Unrivaled Mark" },
  { name: "Empoleon", stars: 7, teraType: "Ice", nationalDex: 395, notes: "Unrivaled Mark" },
  { name: "Inteleon", stars: 7, teraType: "Ice", nationalDex: 818, notes: "Unrivaled Mark" },
  { name: "Rillaboom", stars: 7, teraType: "Normal", nationalDex: 812, notes: "Unrivaled Mark" },
  { name: "Swampert", stars: 7, teraType: "Poison", nationalDex: 260, notes: "Unrivaled Mark" },
  { name: "Sceptile", stars: 7, teraType: "Dragon", nationalDex: 254, notes: "Unrivaled Mark" },
  { name: "Meganium", stars: 7, teraType: "Fairy", nationalDex: 154, notes: "Unrivaled Mark" },
  { name: "Feraligatr", stars: 7, teraType: "Fighting", nationalDex: 160, notes: "Unrivaled Mark" },
  { name: "Infernape", stars: 7, teraType: "Electric", nationalDex: 392, notes: "Unrivaled Mark" },
  { name: "Torterra", stars: 7, teraType: "Rock", nationalDex: 389, notes: "Unrivaled Mark" },
  { name: "Serperior", stars: 7, teraType: "Water", nationalDex: 497, notes: "Unrivaled Mark" },
  { name: "Emboar", stars: 7, teraType: "Ground", nationalDex: 500, notes: "Unrivaled Mark" },
  { name: "Delphox", stars: 7, teraType: "Fairy", nationalDex: 655, notes: "Unrivaled Mark" },
  { name: "Chesnaught", stars: 7, teraType: "Rock", nationalDex: 652, notes: "Unrivaled Mark" },
  { name: "Primarina", stars: 7, teraType: "Steel", nationalDex: 730, notes: "Unrivaled Mark" },
  { name: "Pikachu", stars: 7, teraType: "Water", nationalDex: 25, notes: "Unrivaled Mark" },
  // 6-Star notable bosses
  { name: "Ditto", stars: 6, teraType: "Normal", nationalDex: 132, notes: "High IV farming" },
  { name: "Garchomp", stars: 6, teraType: "Dragon", nationalDex: 445 },
  { name: "Tyranitar", stars: 6, teraType: "Dark", nationalDex: 248 },
  { name: "Dragonite", stars: 6, teraType: "Dragon", nationalDex: 149 },
  { name: "Salamence", stars: 6, teraType: "Dragon", nationalDex: 373 },
  { name: "Gengar", stars: 6, teraType: "Ghost", nationalDex: 94 },
  { name: "Blissey", stars: 6, teraType: "Normal", nationalDex: 242 },
];
