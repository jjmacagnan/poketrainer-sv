import type { StatName } from "./constants";
import { STAT_NAMES } from "./constants";

export interface ShowdownSet {
  name: string;
  item: string;
  ability: string;
  teraType: string;
  nature: string;
  evs: Record<StatName, number>;
  ivs: Record<StatName, number>;
  moves: string[];
  level: number;
}

const STAT_SHOWDOWN_MAP: Record<string, StatName> = {
  HP: "HP",
  Atk: "Atk",
  Def: "Def",
  SpA: "SpA",
  SpD: "SpD",
  Spe: "Spe",
};

const SHOWDOWN_STAT_MAP: Record<StatName, string> = {
  HP: "HP",
  Atk: "Atk",
  Def: "Def",
  SpA: "SpA",
  SpD: "SpD",
  Spe: "Spe",
};

/**
 * Parse a Pokémon Showdown set string into structured data.
 *
 * Example input:
 *   Garchomp @ Choice Band
 *   Ability: Rough Skin
 *   Tera Type: Dragon
 *   EVs: 252 Atk / 252 Spe / 4 HP
 *   Jolly Nature
 *   - Earthquake
 *   - Outrage
 *   - Stone Edge
 *   - Swords Dance
 */
export function parseShowdown(text: string): ShowdownSet | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const emptyEvs = Object.fromEntries(
    STAT_NAMES.map((s) => [s, 0])
  ) as Record<StatName, number>;
  const fullIvs = Object.fromEntries(
    STAT_NAMES.map((s) => [s, 31])
  ) as Record<StatName, number>;

  const result: ShowdownSet = {
    name: "",
    item: "",
    ability: "",
    teraType: "",
    nature: "",
    evs: { ...emptyEvs },
    ivs: { ...fullIvs },
    moves: [],
    level: 100,
  };

  // First line: Name @ Item
  const firstLine = lines[0];
  const atSplit = firstLine.split(" @ ");
  result.name = atSplit[0].trim();
  if (atSplit[1]) result.item = atSplit[1].trim();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("Ability:")) {
      result.ability = line.replace("Ability:", "").trim();
    } else if (line.startsWith("Tera Type:")) {
      result.teraType = line.replace("Tera Type:", "").trim();
    } else if (line.startsWith("Level:")) {
      result.level = parseInt(line.replace("Level:", "").trim()) || 100;
    } else if (line.startsWith("EVs:")) {
      const evStr = line.replace("EVs:", "").trim();
      for (const part of evStr.split("/")) {
        const match = part.trim().match(/^(\d+)\s+(\w+)$/);
        if (match) {
          const stat = STAT_SHOWDOWN_MAP[match[2]];
          if (stat) result.evs[stat] = parseInt(match[1]);
        }
      }
    } else if (line.startsWith("IVs:")) {
      const ivStr = line.replace("IVs:", "").trim();
      for (const part of ivStr.split("/")) {
        const match = part.trim().match(/^(\d+)\s+(\w+)$/);
        if (match) {
          const stat = STAT_SHOWDOWN_MAP[match[2]];
          if (stat) result.ivs[stat] = parseInt(match[1]);
        }
      }
    } else if (line.endsWith("Nature")) {
      result.nature = line.replace("Nature", "").trim();
    } else if (line.startsWith("- ")) {
      result.moves.push(line.slice(2).trim());
    }
  }

  return result.name ? result : null;
}

/**
 * Export a build to Pokémon Showdown format.
 */
export function exportShowdown(set: ShowdownSet): string {
  const lines: string[] = [];

  // Name @ Item
  let firstLine = set.name;
  if (set.item) firstLine += ` @ ${set.item}`;
  lines.push(firstLine);

  if (set.ability) lines.push(`Ability: ${set.ability}`);
  if (set.teraType) lines.push(`Tera Type: ${set.teraType}`);
  if (set.level !== 100) lines.push(`Level: ${set.level}`);

  // EVs
  const evParts = STAT_NAMES.filter((s) => set.evs[s] > 0).map(
    (s) => `${set.evs[s]} ${SHOWDOWN_STAT_MAP[s]}`
  );
  if (evParts.length > 0) lines.push(`EVs: ${evParts.join(" / ")}`);

  // IVs (only non-31)
  const ivParts = STAT_NAMES.filter((s) => set.ivs[s] !== 31).map(
    (s) => `${set.ivs[s]} ${SHOWDOWN_STAT_MAP[s]}`
  );
  if (ivParts.length > 0) lines.push(`IVs: ${ivParts.join(" / ")}`);

  if (set.nature) lines.push(`${set.nature} Nature`);

  for (const move of set.moves) {
    lines.push(`- ${move}`);
  }

  return lines.join("\n");
}
