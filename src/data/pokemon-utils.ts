import pokemonData from "@/data/generated/pokemon.json";

/**
 * All Pokémon that can appear in the wild and be EV-trained against.
 * Excludes `pokedex: "raid-extra"` entries (legendaries / alternate forms
 * that only appear as Tera Raid bosses and cannot be defeated in the field).
 */
export const wildPokemonData = (pokemonData as { pokedex: string }[]).filter(
  (p) => p.pokedex !== "raid-extra"
);
