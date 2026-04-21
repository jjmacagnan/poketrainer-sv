export interface TrainingLocation {
  pokemonName: string;
  location: {
    pt: string;
    en: string;
  };
  sandwich: {
    pt: string;
    en: string;
    effect: string;
  };
}

/**
 * Curated list of best farming spots for Pokémon Scarlet & Violet.
 * This complements the dynamic search in pokemon.json.
 */
export const TRAINING_LOCATIONS: Record<string, TrainingLocation> = {
  // HP
  "Clefairy": {
    pokemonName: "Clefairy",
    location: { pt: "Montanha Glaseado", en: "Glaseado Mountain" },
    sandwich: { pt: "Sanduíche de Marmelada", en: "Marmalade Sandwich", effect: "Encounter Power: Normal" },
  },
  "Clefable": {
    pokemonName: "Clefable",
    location: { pt: "Montanha Glaseado", en: "Glaseado Mountain" },
    sandwich: { pt: "Sanduíche de Marmelada", en: "Marmalade Sandwich", effect: "Encounter Power: Normal" },
  },
  "Dunsparce": {
    pokemonName: "Dunsparce",
    location: { pt: "Província do Sul (Área 3)", en: "South Province (Area Three)" },
    sandwich: { pt: "Sanduíche de Presunto", en: "Ham Sandwich", effect: "Encounter Power: Normal" },
  },
  "Snorlax": {
    pokemonName: "Snorlax",
    location: { pt: "Província do Norte (Área 2)", en: "North Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Presunto", en: "Ham Sandwich", effect: "Encounter Power: Normal" },
  },
  "Chansey": {
    pokemonName: "Chansey",
    location: {
      pt: "Província do Norte (Área 3) - Perto da base Team Star",
      en: "North Province (Area Three) - Near Team Star Base",
    },
    sandwich: {
      pt: "Sanduíche de Presunto (Ham Sandwich)",
      en: "Ham Sandwich",
      effect: "Encounter Power: Normal",
    },
  },
  "Azumarill": {
    pokemonName: "Azumarill",
    location: { pt: "Lago Casseroya", en: "Casseroya Lake" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Lechonk": {
    pokemonName: "Lechonk",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Presunto", en: "Ham Sandwich", effect: "Encounter Power: Normal" },
  },

  // Attack
  "Mankey": {
    pokemonName: "Mankey",
    location: { pt: "Província do Sul (Área 2)", en: "South Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Picles", en: "Pickle Sandwich", effect: "Encounter Power: Fighting" },
  },
  "Flamigo": {
    pokemonName: "Flamigo",
    location: { pt: "Província do Oeste (Área 1)", en: "West Province (Area One)" },
    sandwich: { pt: "Sanduíche de Arroz", en: "Rice Sandwich", effect: "Encounter Power: Flying" },
  },
  "Bagon": {
    pokemonName: "Bagon",
    location: { pt: "Poco Path", en: "Poco Path" },
    sandwich: { pt: "Sanduíche de Abacate", en: "Avocado Sandwich", effect: "Encounter Power: Dragon" },
  },
  "Murkrow": {
    pokemonName: "Murkrow",
    location: { pt: "Província do Sul (Área 3) - à noite", en: "South Province (Area Three) - at night" },
    sandwich: { pt: "Sanduíche de Arroz", en: "Rice Sandwich", effect: "Encounter Power: Dark" },
  },
  "Larvitar": {
    pokemonName: "Larvitar",
    location: { pt: "Província do Norte (Área 1)", en: "North Province (Area One)" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Rock" },
  },
  "Shinx": {
    pokemonName: "Shinx",
    location: { pt: "Província do Sul (Área 3)", en: "South Province (Area Three)" },
    sandwich: { pt: "Sanduíche de Pasta de Amendoim", en: "Peanut Butter Sandwich", effect: "Encounter Power: Electric" },
  },
  "Luxio": {
    pokemonName: "Luxio",
    location: { pt: "Província do Sul (Área 3)", en: "South Province (Area Three)" },
    sandwich: { pt: "Sanduíche de Pasta de Amendoim", en: "Peanut Butter Sandwich", effect: "Encounter Power: Electric" },
  },
  "Tauros": {
    pokemonName: "Tauros",
    location: { pt: "Província do Oeste (Área 2)", en: "West Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Picles", en: "Pickle Sandwich", effect: "Encounter Power: Fighting" },
  },
  "Yungoos": {
    pokemonName: "Yungoos",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Presunto", en: "Ham Sandwich", effect: "Encounter Power: Normal" },
  },

  // Defense
  "Klawf": {
    pokemonName: "Klawf",
    location: { pt: "Província do Sul (Área 3) - falésias", en: "South Province (Area Three) - cliffs" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Rock" },
  },
  "Orthworm": {
    pokemonName: "Orthworm",
    location: { pt: "Província do Sul (Área 5)", en: "South Province (Area Five)" },
    sandwich: { pt: "Sanduíche de Pasta de Amendoim", en: "Peanut Butter Sandwich", effect: "Encounter Power: Steel" },
  },
  "Rhyhorn": {
    pokemonName: "Rhyhorn",
    location: { pt: "Província do Leste (Área 2)", en: "East Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Rock" },
  },
  "Sandshrew": {
    pokemonName: "Sandshrew",
    location: { pt: "Deserto Asado", en: "Asado Desert" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Ground" },
  },
  "Tarountula": {
    pokemonName: "Tarountula",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Salada de Batata", en: "Potato Salad Sandwich", effect: "Encounter Power: Bug" },
  },
  "Nacli": {
    pokemonName: "Nacli",
    location: { pt: "Província do Leste (Área 1)", en: "East Province (Area One)" },
    sandwich: { pt: "Sanduíche de Salada de Batata", en: "Potato Salad Sandwich", effect: "Encounter Power: Rock" },
  },
  "Shellder": {
    pokemonName: "Shellder",
    location: { pt: "Mar de Paldea (Sul)", en: "South Paldean Sea" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },

  // Special Attack
  "Flittle": {
    pokemonName: "Flittle",
    location: { pt: "Deserto Asado", en: "Asado Desert" },
    sandwich: { pt: "Sanduíche de Geleia", en: "Jelly Sandwich", effect: "Encounter Power: Psychic" },
  },
  "Espathra": {
    pokemonName: "Espathra",
    location: { pt: "Deserto Asado", en: "Asado Desert" },
    sandwich: { pt: "Sanduíche de Geleia", en: "Jelly Sandwich", effect: "Encounter Power: Psychic" },
  },
  "Gastly": {
    pokemonName: "Gastly",
    location: { pt: "Província do Sul (Área 3) - à noite", en: "South Province (Area Three) - at night" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Ghost" },
  },
  "Haunter": {
    pokemonName: "Haunter",
    location: { pt: "Província do Sul (Área 3) - à noite", en: "South Province (Area Three) - at night" },
    sandwich: { pt: "Sanduíche de Chocolate", en: "Chocolate Sandwich", effect: "Encounter Power: Ghost" },
  },
  "Charcadet": {
    pokemonName: "Charcadet",
    location: { pt: "Província do Sul (Área 5)", en: "South Province (Area Five)" },
    sandwich: { pt: "Sanduíche de Ketchup", en: "Ketchup Sandwich", effect: "Encounter Power: Fire" },
  },
  "Natu": {
    pokemonName: "Natu",
    location: { pt: "Província do Leste (Área 2)", en: "East Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Geleia", en: "Jelly Sandwich", effect: "Encounter Power: Psychic" },
  },
  "Golduck": {
    pokemonName: "Golduck",
    location: { pt: "Lago Casseroya", en: "Casseroya Lake" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Girafarig": {
    pokemonName: "Girafarig",
    location: { pt: "Província do Oeste (Área 2)", en: "West Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Geleia", en: "Jelly Sandwich", effect: "Encounter Power: Psychic" },
  },
  "Psyduck": {
    pokemonName: "Psyduck",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },

  // Special Defense
  "Tentacool": {
    pokemonName: "Tentacool",
    location: { pt: "Mar de Paldea (Sul)", en: "South Paldean Sea" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Tentacruel": {
    pokemonName: "Tentacruel",
    location: { pt: "Mar de Paldea (Sul)", en: "South Paldean Sea" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Tinkatink": {
    pokemonName: "Tinkatink",
    location: { pt: "Província do Sul (Área 4)", en: "South Province (Area Four)" },
    sandwich: { pt: "Sanduíche de Marmelada", en: "Marmalade Sandwich", effect: "Encounter Power: Fairy" },
  },
  "Snom": {
    pokemonName: "Snom",
    location: { pt: "Montanha Glaseado", en: "Glaseado Mountain" },
    sandwich: { pt: "Sanduíche de Creme", en: "Cream Sandwich", effect: "Encounter Power: Ice" },
  },
  "Toedscool": {
    pokemonName: "Toedscool",
    location: { pt: "Lago Casseroya", en: "Casseroya Lake" },
    sandwich: { pt: "Sanduíche de Salada", en: "Salad Sandwich", effect: "Encounter Power: Grass" },
  },
  "Eevee": {
    pokemonName: "Eevee",
    location: { pt: "Província do Sul (Área 2)", en: "South Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Presunto", en: "Ham Sandwich", effect: "Encounter Power: Normal" },
  },
  "Spoink": {
    pokemonName: "Spoink",
    location: { pt: "Província do Sul (Área 3)", en: "South Province (Area Three)" },
    sandwich: { pt: "Sanduíche de Geleia", en: "Jelly Sandwich", effect: "Encounter Power: Psychic" },
  },
  "Flabébé": {
    pokemonName: "Flabébé",
    location: { pt: "Província do Sul (Área 4)", en: "South Province (Area Four)" },
    sandwich: { pt: "Sanduíche de Marmelada", en: "Marmalade Sandwich", effect: "Encounter Power: Fairy" },
  },
  "Goomy": {
    pokemonName: "Goomy",
    location: { pt: "Lago Casseroya (Áreas com lama)", en: "Casseroya Lake (Muddy areas)" },
    sandwich: { pt: "Sanduíche de Abacate", en: "Avocado Sandwich", effect: "Encounter Power: Dragon" },
  },

  // Speed
  "Nymble": {
    pokemonName: "Nymble",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Salada de Batata", en: "Potato Salad Sandwich", effect: "Encounter Power: Bug" },
  },
  "Lokix": {
    pokemonName: "Lokix",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Salada de Batata", en: "Potato Salad Sandwich", effect: "Encounter Power: Bug" },
  },
  "Fletchling": {
    pokemonName: "Fletchling",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Arroz", en: "Rice Sandwich", effect: "Encounter Power: Flying" },
  },
  "Pikachu": {
    pokemonName: "Pikachu",
    location: { pt: "Província do Sul (Área 2)", en: "South Province (Area Two)" },
    sandwich: { pt: "Sanduíche de Pasta de Amendoim", en: "Peanut Butter Sandwich", effect: "Encounter Power: Electric" },
  },
  "Pawmi": {
    pokemonName: "Pawmi",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Pasta de Amendoim", en: "Peanut Butter Sandwich", effect: "Encounter Power: Electric" },
  },
  "Magikarp": {
    pokemonName: "Magikarp",
    location: { pt: "Poco Path / Inlet Grotto", en: "Poco Path / Inlet Grotto" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Wingull": {
    pokemonName: "Wingull",
    location: { pt: "Poco Path / Inlet Grotto", en: "Poco Path / Inlet Grotto" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Buizel": {
    pokemonName: "Buizel",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Frutas", en: "Fruit Sandwich", effect: "Encounter Power: Water" },
  },
  "Rookidee": {
    pokemonName: "Rookidee",
    location: { pt: "Província do Sul (Área 1)", en: "South Province (Area One)" },
    sandwich: { pt: "Sanduíche de Arroz", en: "Rice Sandwich", effect: "Encounter Power: Flying" },
  },
};
