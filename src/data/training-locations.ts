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
