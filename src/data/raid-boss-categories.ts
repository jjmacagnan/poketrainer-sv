// Attack category data sourced from:
// https://amiibodoctor.com/2026/03/01/every-6-star-tera-raid-physical-special-or-both/
// Covers all 123 Pokémon available as 6★ raid bosses (Paldea + Kitakami + Indigo Disk)

export type BossAttackCategory = "physical" | "special" | "both";

// Moves that directly reduce physical damage taken or boost physical bulk.
export const PHYSICAL_DEFENSIVE_COUNTER_MOVES = new Set([
  "Iron Defense", "Bulk Up", "Reflect", "Chilling Water",
  "Breaking Swipe", "Cotton Guard", "Stockpile", "Defense Curl",
  "Will O Wisp",
]);

// Moves that directly reduce special damage taken or boost special bulk.
export const SPECIAL_DEFENSIVE_COUNTER_MOVES = new Set([
  "Calm Mind", "Amnesia", "Light Screen", "Eerie Impulse", "Snarl",
]);

// Offensive setup is useful, but should not be scored as defensive mitigation.
export const RAID_DAMAGE_SETUP_MOVES = new Set([
  "Swords Dance", "Bulk Up", "Belly Drum", "Dragon Dance",
  "Calm Mind", "Nasty Plot", "Tail Glow", "Metal Sound",
  "Screech", "Acid Spray", "Fake Tears", "Leer",
]);

// Lookup: Pokémon name (lowercase) → attack category
export const BOSS_ATTACK_CATEGORY: Record<string, BossAttackCategory> = {
  // ── Paldea — Physical ──────────────────────────────────────────────────────
  "annihilape":   "physical",
  "avalugg":      "physical",
  "baxcalibur":   "physical",
  "bombirdier":   "physical",
  "breloom":      "physical",
  "ceruledge":    "physical",
  "cetitan":      "physical",
  "clodsire":     "physical",
  "corviknight":  "physical",
  "dachsbun":     "physical",
  "dondozo":      "physical",
  "dragonite":    "physical",
  "gallade":      "physical",
  "garganacl":    "physical",
  "grafaiai":     "physical",
  "haxorus":      "physical",
  "heracross":    "physical",
  "hippowdon":    "physical",
  "kingambit":    "physical",
  "klawf":        "physical",
  "lycanroc":     "physical",
  "mabosstiff":   "physical",
  "mimikyu":      "physical",
  "orthworm":     "physical",
  "pawmot":       "physical",
  "scizor":       "physical",
  "staraptor":    "physical",
  "tauros":       "physical",
  "tinkaton":     "physical",
  "tyranitar":    "physical",

  // ── Paldea — Special ───────────────────────────────────────────────────────
  "armarouge":    "special",
  "blissey":      "special",
  "dragalge":     "special",
  "dragapult":    "special",
  "espeon":       "special",
  "frosmoth":     "special",
  "gardevoir":    "special",
  "gengar":       "special",
  "glimmora":     "special",
  "goodra":       "special",
  "kilowattrel":  "special",
  "magnezone":    "special",
  "pelipper":     "special",
  "slowking":     "special",
  "toedscruel":   "special",
  "volcarona":    "special",

  // ── Paldea — Both ─────────────────────────────────────────────────────────
  "clawitzer":    "both",
  "cyclizar":     "both",
  "farigiraf":    "both",
  "flareon":      "both",
  "garchomp":     "both",
  "gyarados":     "both",
  "hydreigon":    "both",
  "jolteon":      "both",
  "leafeon":      "both",
  "pincurchin":   "both",
  "revavroom":    "both",
  "salamence":    "both",
  "torkoal":      "both",
  "toxapex":      "both",
  "umbreon":      "both",
  "vaporeon":     "both",

  // ── Kitakami — Physical ───────────────────────────────────────────────────
  "ambipom":      "physical",
  "basculegion":  "physical",
  "conkeldurr":   "physical",
  "crawdaunt":    "physical",
  "gliscor":      "physical",
  "golem":        "physical",
  "leavanny":     "physical",
  "morpeko":      "physical",
  "quagsire":     "physical",
  "snorlax":      "physical",
  "trevenant":    "physical",

  // ── Kitakami — Special ────────────────────────────────────────────────────
  "clefable":     "special",
  "ninetales":    "special",
  "politoed":     "special",
  "sinistcha":    "special",

  // ── Kitakami — Both ───────────────────────────────────────────────────────
  "chandelure":   "both",
  "dusknoir":     "both",
  "kommo-o":      "both",
  "ludicolo":     "both",
  "mamoswine":    "both",
  "mandibuzz":    "both",
  "mienshao":     "both",
  "milotic":      "both",
  "poliwrath":    "both",
  "shiftry":      "both",
  "yanmega":      "both",

  // ── Indigo Disk — Physical ────────────────────────────────────────────────
  "excadrill":          "physical",
  "flygon":             "physical",
  "golurk":             "physical",
  "malamar":            "physical",
  "metagross":          "physical",
  "overqwil":           "physical",
  "rhyperior":          "physical",
  "sandslash":          "physical",  // Alolan form
  "skarmory":           "physical",

  // ── Indigo Disk — Special ─────────────────────────────────────────────────
  "alcremie":           "special",
  "kingdra":            "special",
  "magmortar":          "special",
  "porygon-z":          "special",
  "porygon2":           "special",
  "galarian slowking":  "special",
  "whimsicott":         "special",

  // ── Indigo Disk — Both ────────────────────────────────────────────────────
  "dugtrio":            "both",  // Alolan form
  "duraludon":          "both",
  "electivire":         "both",
  "exeggutor":          "both",
  "kleavor":            "both",
  "lapras":             "both",
  "muk":                "both",  // Alolan form
  "reuniclus":          "both",
  "galarian slowbro":   "both",
};

export function getBossAttackCategory(pokemonName: string): BossAttackCategory | null {
  return BOSS_ATTACK_CATEGORY[pokemonName.toLowerCase()] ?? null;
}
