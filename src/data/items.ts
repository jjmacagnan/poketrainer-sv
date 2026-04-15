export interface HeldItem {
  name: string;
  category: string;
  description: string;
}

export const HELD_ITEMS: HeldItem[] = [
  // Choice Items
  { name: "Choice Band", category: "Choice", description: "1.5× Attack, locked into one move" },
  { name: "Choice Specs", category: "Choice", description: "1.5× Sp. Atk, locked into one move" },
  { name: "Choice Scarf", category: "Choice", description: "1.5× Speed, locked into one move" },
  // Berries
  { name: "Sitrus Berry", category: "Berry", description: "Restores 25% HP when below 50%" },
  { name: "Lum Berry", category: "Berry", description: "Cures any status condition once" },
  // Offensive
  { name: "Life Orb", category: "Offensive", description: "1.3× damage, lose 10% HP per attack" },
  { name: "Expert Belt", category: "Offensive", description: "1.2× damage on super effective hits" },
  { name: "Metronome", category: "Offensive", description: "Boosts repeated moves up to 2×" },
  { name: "Shell Bell", category: "Offensive", description: "Heals 1/8 of damage dealt" },
  { name: "Muscle Band", category: "Offensive", description: "1.1× physical move damage" },
  { name: "Wise Glasses", category: "Offensive", description: "1.1× special move damage" },
  { name: "Scope Lens", category: "Offensive", description: "+1 critical hit ratio" },
  { name: "Razor Claw", category: "Offensive", description: "+1 critical hit ratio" },
  { name: "Throat Spray", category: "Offensive", description: "+1 Sp. Atk after using a sound move" },
  { name: "Punching Glove", category: "Offensive", description: "1.1× punching moves, no contact" },
  // Defensive
  { name: "Leftovers", category: "Defensive", description: "Restores 1/16 HP each turn" },
  { name: "Rocky Helmet", category: "Defensive", description: "Deals 1/6 HP to attacker on contact" },
  { name: "Assault Vest", category: "Defensive", description: "1.5× Sp. Def, can only use attacks" },
  { name: "Focus Sash", category: "Defensive", description: "Survives a KO hit with 1 HP (once)" },
  { name: "Eviolite", category: "Defensive", description: "1.5× Def and Sp. Def if not fully evolved" },
  { name: "Safety Goggles", category: "Defensive", description: "Immune to weather and powder moves" },
  // Utility
  { name: "Light Clay", category: "Utility", description: "Extends Light Screen/Reflect to 8 turns" },
  { name: "Wide Lens", category: "Utility", description: "1.1× accuracy" },
  { name: "Covert Cloak", category: "Utility", description: "Blocks secondary effects of moves" },
  { name: "Clear Amulet", category: "Utility", description: "Prevents stat lowering by opponents" },
  { name: "Mirror Herb", category: "Utility", description: "Copies opponent's stat boosts once" },
  // SV-specific
  { name: "Booster Energy", category: "SV", description: "Activates Protosynthesis/Quark Drive" },
  { name: "Ability Shield", category: "SV", description: "Prevents ability changes" },
  { name: "Loaded Dice", category: "SV", description: "Multi-hit moves hit 4-5 times" },
  // Type-boosting
  { name: "Charcoal", category: "Type Boost", description: "1.2× Fire moves" },
  { name: "Mystic Water", category: "Type Boost", description: "1.2× Water moves" },
  { name: "Magnet", category: "Type Boost", description: "1.2× Electric moves" },
  { name: "Miracle Seed", category: "Type Boost", description: "1.2× Grass moves" },
  { name: "Never-Melt Ice", category: "Type Boost", description: "1.2× Ice moves" },
  { name: "Black Belt", category: "Type Boost", description: "1.2× Fighting moves" },
  { name: "Poison Barb", category: "Type Boost", description: "1.2× Poison moves" },
  { name: "Soft Sand", category: "Type Boost", description: "1.2× Ground moves" },
  { name: "Sharp Beak", category: "Type Boost", description: "1.2× Flying moves" },
  { name: "Twisted Spoon", category: "Type Boost", description: "1.2× Psychic moves" },
  { name: "Silver Powder", category: "Type Boost", description: "1.2× Bug moves" },
  { name: "Hard Stone", category: "Type Boost", description: "1.2× Rock moves" },
  { name: "Spell Tag", category: "Type Boost", description: "1.2× Ghost moves" },
  { name: "Dragon Fang", category: "Type Boost", description: "1.2× Dragon moves" },
  { name: "Black Glasses", category: "Type Boost", description: "1.2× Dark moves" },
  { name: "Metal Coat", category: "Type Boost", description: "1.2× Steel moves" },
  { name: "Silk Scarf", category: "Type Boost", description: "1.2× Normal moves" },
  { name: "Fairy Feather", category: "Type Boost", description: "1.2× Fairy moves" },
  // EV Training (Power Items)
  { name: "Macho Brace", category: "EV Training", description: "Doubles EV gain from battles" },
  { name: "Power Weight", category: "EV Training", description: "+8 HP EVs per battle" },
  { name: "Power Bracer", category: "EV Training", description: "+8 Attack EVs per battle" },
  { name: "Power Belt", category: "EV Training", description: "+8 Defense EVs per battle" },
  { name: "Power Lens", category: "EV Training", description: "+8 Sp. Atk EVs per battle" },
  { name: "Power Band", category: "EV Training", description: "+8 Sp. Def EVs per battle" },
  { name: "Power Anklet", category: "EV Training", description: "+8 Speed EVs per battle" },
  // EV Berries
  { name: "Pomeg Berry", category: "EV Berry", description: "Reduces HP EVs by 10, increases friendship" },
  { name: "Kelpsy Berry", category: "EV Berry", description: "Reduces Attack EVs by 10, increases friendship" },
  { name: "Qualot Berry", category: "EV Berry", description: "Reduces Defense EVs by 10, increases friendship" },
  { name: "Hondew Berry", category: "EV Berry", description: "Reduces Sp. Atk EVs by 10, increases friendship" },
  { name: "Grepa Berry", category: "EV Berry", description: "Reduces Sp. Def EVs by 10, increases friendship" },
  { name: "Tamato Berry", category: "EV Berry", description: "Reduces Speed EVs by 10, increases friendship" },
  // Vitamins
  { name: "HP Up", category: "Vitamin", description: "Increases HP EVs by 10" },
  { name: "Protein", category: "Vitamin", description: "Increases Attack EVs by 10" },
  { name: "Iron", category: "Vitamin", description: "Increases Defense EVs by 10" },
  { name: "Calcium", category: "Vitamin", description: "Increases Sp. Atk EVs by 10" },
  { name: "Zinc", category: "Vitamin", description: "Increases Sp. Def EVs by 10" },
  { name: "Carbos", category: "Vitamin", description: "Increases Speed EVs by 10" },
];

export const ITEM_CATEGORIES = [...new Set(HELD_ITEMS.map((i) => i.category))];
