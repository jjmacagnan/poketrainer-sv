"use client";

import { useState, useMemo } from "react";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";

const TYPE_ID: Record<string, number> = {
  Normal: 1, Fighting: 2, Flying: 3, Poison: 4, Ground: 5,
  Rock: 6, Bug: 7, Ghost: 8, Steel: 9, Fire: 10,
  Water: 11, Grass: 12, Electric: 13, Psychic: 14, Ice: 15,
  Dragon: 16, Dark: 17, Fairy: 18,
};
const SV_SYMBOL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small";

const typeFilterOptions = TYPES.map((tp) => ({
  value: tp,
  label: tp,
  color: TYPE_COLORS[tp],
  icon: `${SV_SYMBOL}/${TYPE_ID[tp]}.png`,
}));

import { ALL_RECIPES, MEAL_POWERS } from "@/data/sandwich-recipes";
import type { SandwichRecipe } from "@/data/sandwich-recipes";
import {
  SHINY_GUIDE,
  ENCOUNTER_GUIDE,
  RAID_GUIDE,
  BREEDING_RECIPES,
  UTILITY_RECIPES,
  MASS_OUTBREAK_GUIDE,
  VGC_ANY_HERBA_GUIDE,
} from "@/data/sandwich-guide";
import type { SandwichGuideEntry, UtilityRecipeGoal } from "@/data/sandwich-guide";
import { useI18n } from "@/i18n";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetail } from "./RecipeDetail";
import { ToolDisclaimer } from "@/components/shared/ToolDisclaimer";
import { FilterBar } from "@/components/shared/FilterBar";
import { PokemonSandwichSearch } from "./PokemonSandwichSearch";
import { GuideBanner } from "@/components/shared/GuideBanner";
import { PageHeader } from "@/components/shared/PageHeader";

type Tab = "shiny" | "outbreak" | "encounter" | "raid" | "breeding" | "utility" | "search";

const GUIDE_DATA: Record<Tab, SandwichGuideEntry[]> = {
  shiny: SHINY_GUIDE,
  outbreak: [],
  encounter: ENCOUNTER_GUIDE,
  raid: RAID_GUIDE,
  breeding: [],
  utility: [],
  search: [],
};

const HERBA_COLORS: Record<string, string> = {
  Salty: "#6CB4E4",
  Sweet: "#FF9CC2",
  Spicy: "#FF6B35",
  Sour: "#8AC926",
  Bitter: "#9B59B6",
};

function HerbaBadge({ herba }: { herba: string }) {
  return (
    <span
      className="rounded px-1.5 py-0.5 text-ui-base font-bold text-white"
      style={{ background: HERBA_COLORS[herba] ?? "#666" }}
    >
      {herba}
    </span>
  );
}

function TypeGuideCard({
  entry,
  isSelected,
  onToggle,
  onSelectRecipe,
}: {
  entry: SandwichGuideEntry;
  isSelected: boolean;
  onToggle: () => void;
  onSelectRecipe: (r: SandwichRecipe) => void;
}) {
  const { t } = useI18n();
  const primary = entry.recipes[0];
  const hasAlts = entry.recipes.length > 1;
  const typeColor = TYPE_COLORS[entry.type] ?? "#666";

  return (
    <div className="overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)]">
      {/* Card header — click to expand */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-white/5"
      >
        {/* Type badge */}
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-bold text-white"
          style={{ background: typeColor }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${SV_SYMBOL}/${TYPE_ID[entry.type]}.png`} alt="" aria-hidden style={{ height: 12, width: "auto", display: "block" }} />
          {entry.type}
        </span>

        {/* Primary recipe info */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-gray-100">
            {primary.name}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            {primary.herba.length > 0 ? (
              primary.herba.map((h, i) => <HerbaBadge key={i} herba={h} />)
            ) : (
              <span className="text-ui-base font-semibold text-teal-400">{t("sandwich.noHerba")}</span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-1.5">
          {hasAlts && (
            <span className="border border-[var(--pt-border-dim)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-[var(--pt-text-dim)]">
              {t("sandwich.altBadge", { count: entry.recipes.length - 1 })}
            </span>
          )}
          <span
            className={`text-[var(--pt-text-dim)] transition-transform ${isSelected ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Inline recipe picker */}
      {isSelected && (
        <div className="border-t border-[var(--pt-border-dim)] bg-black/20 p-2">
          <div className="mb-1.5 px-1 text-ui-base font-bold uppercase tracking-wider text-[var(--pt-text-dim)]">
            {t("sandwich.selectRecipe")}
          </div>
          <div className="grid gap-1.5">
            {entry.recipes.map((recipe, i) => (
              <button
                key={i}
                onClick={() => onSelectRecipe(recipe)}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {i === 0 && (
                        <span className="border border-[rgba(255,215,0,0.4)] px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-[var(--pt-gold)]">
                          {t("sandwich.bestBadge")}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-gray-100">
                        {recipe.name}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recipe.herba.map((h, j) => (
                        <HerbaBadge key={j} herba={h} />
                      ))}
                      {recipe.herba.length === 0 && (
                        <span className="text-ui-base text-teal-400">{t("sandwich.noHerbaMystica")}</span>
                      )}
                    </div>
                    <div className="mt-1 text-ui-base text-[var(--pt-text-dim)]">
                      {recipe.ingredients.join(", ")}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {recipe.powers.slice(0, 1).map((p, j) => (
                      <div key={j} className="text-ui-base font-semibold text-gray-300">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const UTILITY_GOAL_LABELS: Record<UtilityRecipeGoal, string> = {
  egg: "Egg",
  raid: "Raid",
  encounter: "Encounter",
  catching: "Catching",
  "item-drop": "Item Drop",
  shiny: "Shiny",
};

export function SandwichBuilder() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("shiny");
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<SandwichRecipe | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<SandwichGuideEntry | null>(null);
  const [searchPower, setSearchPower] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchMode, setSearchMode] = useState<"pokemon" | "power">("pokemon");

  const filteredGuide = useMemo(() => {
    const data = GUIDE_DATA[tab] ?? [];
    if (!selectedType) return data;
    return data.filter((e) => e.type === selectedType);
  }, [tab, selectedType]);

  const searchResults = useMemo(() => {
    if (!searchPower && !searchType) return [];
    return ALL_RECIPES.filter((r) => {
      const matchPower =
        !searchPower ||
        r.powers.some((p) => p.toLowerCase().includes(searchPower.toLowerCase()));
      const matchType = !searchType || r.type === searchType;
      return matchPower && matchType;
    });
  }, [searchPower, searchType]);

  const filteredOutbreakGuide = useMemo(() => {
    if (!selectedType) return MASS_OUTBREAK_GUIDE;
    return MASS_OUTBREAK_GUIDE.filter((recipe) => recipe.type === selectedType);
  }, [selectedType]);

  const filteredVgcAnyHerbaGuide = useMemo(() => {
    if (!selectedType) return VGC_ANY_HERBA_GUIDE;
    return VGC_ANY_HERBA_GUIDE.filter((recipe) => recipe.type === selectedType);
  }, [selectedType]);

  // Detail view
  if (selectedRecipe) {
    return (
      <div className="mx-auto max-w-xl px-4 py-6">
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
        />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; desc: string; color: string }[] = [
    { id: "shiny", label: t("sandwich.tabShiny"), desc: t("sandwich.tabShinyDesc"), color: "#FFD700" },
    { id: "outbreak", label: t("sandwich.tabOutbreak"), desc: t("sandwich.tabOutbreakDesc"), color: "#EC4899" },
    { id: "encounter", label: t("sandwich.tabEncounter"), desc: t("sandwich.tabEncounterDesc"), color: "#4ECDC4" },
    { id: "raid", label: t("sandwich.tabRaid"), desc: t("sandwich.tabRaidDesc"), color: "#E040FB" },
    { id: "breeding", label: t("sandwich.tabBreeding"), desc: t("sandwich.tabBreedingDesc"), color: "#F9A825" },
    { id: "utility", label: t("sandwich.tabUtility"), desc: t("sandwich.tabUtilityDesc"), color: "#60A5FA" },
    { id: "search", label: t("sandwich.tabSearch"), desc: t("sandwich.tabSearchDesc"), color: "#90CAF9" },
  ];

  const tabBanners: Record<Tab, { title: string; info: string; gradient: string; border: string; titleColor: string }> = {
    shiny: {
      title: t("sandwich.shinyTitle"),
      info: t("sandwich.shinyInfo"),
      gradient: "linear-gradient(135deg, rgba(255,215,0,0.07), rgba(255,107,107,0.07))",
      border: "1px solid rgba(255,215,0,0.2)",
      titleColor: "text-yellow-400",
    },
    outbreak: {
      title: t("sandwich.outbreakTitle"),
      info: t("sandwich.outbreakInfo"),
      gradient: "linear-gradient(135deg, rgba(236,72,153,0.07), rgba(255,215,0,0.06))",
      border: "1px solid rgba(236,72,153,0.2)",
      titleColor: "text-pink-400",
    },
    encounter: {
      title: t("sandwich.encounterTitle"),
      info: t("sandwich.encounterInfo"),
      gradient: "linear-gradient(135deg, rgba(78,205,196,0.07), rgba(44,140,133,0.07))",
      border: "1px solid rgba(78,205,196,0.2)",
      titleColor: "text-teal-400",
    },
    raid: {
      title: t("sandwich.raidTitle"),
      info: t("sandwich.raidInfo"),
      gradient: "linear-gradient(135deg, rgba(224,64,251,0.07), rgba(103,58,183,0.07))",
      border: "1px solid rgba(224,64,251,0.2)",
      titleColor: "text-purple-400",
    },
    breeding: {
      title: t("sandwich.breedingTitle"),
      info: t("sandwich.breedingInfo"),
      gradient: "linear-gradient(135deg, rgba(249,168,37,0.07), rgba(251,192,45,0.07))",
      border: "1px solid rgba(249,168,37,0.2)",
      titleColor: "text-yellow-500",
    },
    utility: {
      title: t("sandwich.utilityTitle"),
      info: t("sandwich.utilityInfo"),
      gradient: "linear-gradient(135deg, rgba(96,165,250,0.07), rgba(78,205,196,0.07))",
      border: "1px solid rgba(96,165,250,0.2)",
      titleColor: "text-sky-400",
    },
    search: { title: "", info: "", gradient: "", border: "", titleColor: "" },
  };

  const banner = tabBanners[tab];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="🥪"
        title={t("sandwich.title")}
        subtitle={t("sandwich.subtitle")}
        toolNumber="#001"
      />

      <GuideBanner
        ptHref="/guia-sanduiche-shiny"
        enHref="/shiny-sandwich-guide"
        label={t("common.guideSandwich")}
      />

      {/* Tabs */}
      <div className="mb-6 grid gap-1 rounded-none bg-[var(--pt-card)] p-1 sm:grid-cols-5">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => {
              setTab(tb.id);
              setSelectedType(null);
              setSelectedEntry(null);
            }}
            className={`rounded-none border-b-2 px-2 py-2.5 text-center text-sm font-bold transition-all ${
              tab === tb.id
                ? "bg-[rgba(255,215,0,0.06)] text-white"
                : "border-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
            }`}
            style={tab === tb.id ? { borderColor: tb.color } : undefined}
          >
            <div className="font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px]">{tb.label}</div>
            <div className="text-ui-base font-normal opacity-70">{tb.desc}</div>
          </button>
        ))}
      </div>

      {/* Type Filter — only for tabs that group by Pokémon type */}
      {tab !== "search" && tab !== "breeding" && tab !== "utility" && (
        <div className="mb-5">
          <FilterBar
            options={typeFilterOptions}
            selected={selectedType}
            onSelect={(value) => {
              setSelectedType(value as PokemonType | null);
              setSelectedEntry(null);
            }}
            allLabel={t("sandwich.allTypes")}
          />
        </div>
      )}

      {/* Search Tab */}
      {tab === "search" && (
        <div className="mb-5">
          {/* Mode toggle */}
          <div className="mb-4 grid gap-1 rounded-none bg-[var(--pt-card)] p-1 sm:grid-cols-2">
            <button
              onClick={() => setSearchMode("pokemon")}
              className={`rounded-none border-b-2 px-3 py-2.5 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] transition-all ${
                searchMode === "pokemon"
                  ? "border-b-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)] text-white"
                  : "border-b-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
              }`}
            >
              {t("sandwich.searchByPokemon")}
            </button>
            <button
              onClick={() => setSearchMode("power")}
              className={`rounded-none border-b-2 px-3 py-2.5 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] transition-all ${
                searchMode === "power"
                  ? "border-b-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)] text-white"
                  : "border-b-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
              }`}
            >
              {t("sandwich.searchByPower")}
            </button>
          </div>

          {searchMode === "pokemon" ? (
            <PokemonSandwichSearch onSelectRecipe={setSelectedRecipe} />
          ) : (
            <div>
              <div className="mb-4 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
                <div className="mb-3 text-sm font-bold text-gray-100">
                  {t("sandwich.reverseSearch")}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    value={searchPower}
                    onChange={(e) => setSearchPower(e.target.value)}
                    className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
                  >
                    <option value="">{t("sandwich.anyPower")}</option>
                    {MEAL_POWERS.map((p) => (
                      <option key={p} value={p}>
                        {p} {t("sandwich.power")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
                  >
                    <option value="">{t("sandwich.anyType")}</option>
                    {TYPES.map((tp) => (
                      <option key={tp} value={tp}>
                        {tp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid items-start gap-3 lg:grid-cols-2">
                  {searchResults.map((r, i) => (
                    <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
                  ))}
                </div>
              ) : searchPower || searchType ? (
                <div className="py-10 text-center text-[var(--pt-text-dim)]">
                  {t("sandwich.noRecipes")}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Breeding tab */}
      {tab === "breeding" && (
        <div>
          <div
            className="mb-4 p-3.5 text-sm text-[var(--pt-text-dim)]"
            style={{ background: banner.gradient, border: banner.border }}
          >
            <strong className={banner.titleColor}>{banner.title}</strong> —{" "}
            {banner.info}
          </div>

          {/* Egg Power level sections */}
          {([3, 2, 1] as const).map((level) => {
            const recipes = BREEDING_RECIPES.filter((r) =>
              r.powers[0].includes(`Lv.${level}`)
            );
            if (recipes.length === 0) return null;
            return (
              <div key={level} className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold ${
                      level === 3
                        ? "border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                        : level === 2
                          ? "border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.08)] text-[var(--pt-orange)]"
                          : "border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
                    }`}
                  >
                    {t("sandwich.eggPowerLevel", { level: String(level) })}
                    {level === 3 && ` ${t("sandwich.eggFastest")}`}
                    {level === 2 && ` ${t("sandwich.eggRecommended")}`}
                    {level === 1 && ` ${t("sandwich.eggBudget")}`}
                  </span>
                  {level === 3 && (
                    <span className="text-ui-base text-[var(--pt-text-dim)]">
                      {t("sandwich.requiresHerba")}
                    </span>
                  )}
                </div>
                <div className="grid items-start gap-3 lg:grid-cols-2">
                  {recipes.map((r, i) => (
                    <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mass Outbreak tab */}
      {tab === "outbreak" && (
        <div>
          <div
            className="mb-4 p-3.5 text-sm text-[var(--pt-text-dim)]"
            style={{ background: banner.gradient, border: banner.border }}
          >
            <strong className={banner.titleColor}>{banner.title}</strong> —{" "}
            {banner.info}
          </div>

          <div className="grid items-start gap-3 lg:grid-cols-2">
            {filteredOutbreakGuide.map((recipe) => (
              <button
                key={recipe.type}
                onClick={() =>
                  setSelectedRecipe({
                    name: `Mass Outbreak ${recipe.type}`,
                    type: recipe.type,
                    ingredients: recipe.ingredients,
                    condiments: recipe.condiments,
                    powers: recipe.powers,
                    herba: [],
                  })
                }
                className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3 text-left transition-colors hover:border-pink-500/40 hover:bg-pink-500/8"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-bold text-white"
                    style={{ background: TYPE_COLORS[recipe.type] }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${SV_SYMBOL}/${TYPE_ID[recipe.type]}.png`} alt="" aria-hidden style={{ height: 12, width: "auto", display: "block" }} />
                    {recipe.type}
                  </span>
                  <span className="text-sm font-bold text-gray-100">
                    Mass Outbreak
                  </span>
                </div>
                <p className="mb-2 text-xs text-[var(--pt-text-dim)]">{recipe.note}</p>
                <div className="mb-2">
                  <div className="mb-1 text-ui-base font-bold text-[var(--pt-gold)]">
                    {t("sandwich.ingredients")}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient} className="border border-[var(--pt-border-dim)] bg-black/20 px-1.5 py-0.5 text-ui-sm text-gray-200">
                        {ingredient}
                      </span>
                    ))}
                    {recipe.condiments.map((condiment) => (
                      <span key={condiment} className="border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-1.5 py-0.5 text-ui-sm text-[var(--pt-gold)]">
                        {condiment}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.powers.map((power) => (
                    <span key={power} className="border border-pink-500/30 bg-pink-500/10 px-1.5 py-0.5 text-ui-sm text-pink-300">
                      {power}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-2 mt-5 flex items-center gap-2">
            <span className="border border-[var(--pt-border-dim)] bg-black/20 px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs font-bold uppercase tracking-[2px] text-[var(--pt-text-dim)]">
              VGC
            </span>
            <h3 className="text-sm font-bold text-gray-100">{t("sandwich.vgcAnyHerbaTitle")}</h3>
          </div>
          <p className="mb-3 text-xs text-[var(--pt-text-dim)]">{t("sandwich.vgcAnyHerbaInfo")}</p>

          <div className="grid items-start gap-3 lg:grid-cols-2">
            {filteredVgcAnyHerbaGuide.map((recipe) => (
              <button
                key={recipe.type}
                onClick={() =>
                  setSelectedRecipe({
                    name: `VGC Any Herba ${recipe.type}`,
                    type: recipe.type,
                    ingredients: recipe.ingredients,
                    condiments: recipe.condiments,
                    powers: recipe.powers,
                    herba: [],
                  })
                }
                className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3 text-left transition-colors hover:border-yellow-500/40 hover:bg-yellow-500/8"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-bold text-white"
                    style={{ background: TYPE_COLORS[recipe.type] }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${SV_SYMBOL}/${TYPE_ID[recipe.type]}.png`} alt="" aria-hidden style={{ height: 12, width: "auto", display: "block" }} />
                    {recipe.type}
                  </span>
                  <span className="text-sm font-bold text-gray-100">
                    Any Herba
                  </span>
                </div>
                <p className="mb-2 text-xs text-[var(--pt-text-dim)]">{recipe.note}</p>
                <div className="mb-2">
                  <div className="mb-1 text-ui-base font-bold text-[var(--pt-gold)]">
                    {t("sandwich.ingredients")}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient} className="border border-[var(--pt-border-dim)] bg-black/20 px-1.5 py-0.5 text-ui-sm text-gray-200">
                        {ingredient}
                      </span>
                    ))}
                    {recipe.condiments.map((condiment) => (
                      <span key={condiment} className="border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-1.5 py-0.5 text-ui-sm text-[var(--pt-gold)]">
                        {condiment}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.powers.map((power) => (
                    <span key={power} className="border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-ui-sm text-yellow-300">
                      {power}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Utility picks tab */}
      {tab === "utility" && (
        <div>
          <div
            className="mb-4 p-3.5 text-sm text-[var(--pt-text-dim)]"
            style={{ background: banner.gradient, border: banner.border }}
          >
            <strong className={banner.titleColor}>{banner.title}</strong> —{" "}
            {banner.info}
          </div>

          <div className="grid items-start gap-3 lg:grid-cols-2">
            {UTILITY_RECIPES.map((recipe) => (
              <div key={recipe.name} className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3">
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full text-left"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-none border px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs font-bold uppercase tracking-[2px] text-white"
                      style={{
                        borderColor: TYPE_COLORS[recipe.type] + "99",
                        background: TYPE_COLORS[recipe.type] + "33",
                      }}
                    >
                      {UTILITY_GOAL_LABELS[recipe.goal]}
                    </span>
                    <span className="text-sm font-bold text-gray-100">{recipe.name}</span>
                  </div>
                  <p className="mb-2 text-xs text-[var(--pt-text-dim)]">{recipe.note}</p>
                  <div className="mb-2 text-ui-base text-gray-300">
                    {recipe.ingredients.concat(recipe.condiments).join(" · ")}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.powers.map((power) => (
                      <span key={power} className="border border-[var(--pt-border-dim)] bg-black/20 px-1.5 py-0.5 text-ui-sm text-[var(--pt-text-dim)]">
                        {power}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide tabs (shiny / encounter / raid) */}
      {tab !== "search" && tab !== "breeding" && tab !== "utility" && tab !== "outbreak" && (
        <div>
          {/* Info banner */}
          {banner.title && (
            <div
              className="mb-4 p-3.5 text-sm text-[var(--pt-text-dim)]"
              style={{ background: banner.gradient, border: banner.border }}
            >
              <strong className={banner.titleColor}>{banner.title}</strong> —{" "}
              {banner.info}
            </div>
          )}

          {/* Type entry cards */}
          <div className="grid items-start gap-3 lg:grid-cols-2">
            {filteredGuide.map((entry) => (
              <TypeGuideCard
                key={entry.type}
                entry={entry}
                isSelected={selectedEntry?.type === entry.type}
                onToggle={() =>
                  setSelectedEntry(
                    selectedEntry?.type === entry.type ? null : entry
                  )
                }
                onSelectRecipe={(r) => {
                  setSelectedEntry(null);
                  setSelectedRecipe(r);
                }}
              />
            ))}
          </div>

          {filteredGuide.length === 0 && (
            <div className="py-10 text-center text-[var(--pt-text-dim)]">
              {t("sandwich.noRecipes")}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <ToolDisclaimer
        toolName={t("sandwich.footer")}
        note={t("sandwich.footerNote")}
        sources={[
          { label: t("sandwich.footerSource"), url: "https://www.serebii.net/scarletviolet/sandwich.shtml" },
          { label: "VGC", url: "https://www.videogameschronicle.com/guide/shiny-sandwich-pokemon-scarlet-and-violet-all-shiny-sandwich-recipes/" },
        ]}
      />
    </div>
  );
}
