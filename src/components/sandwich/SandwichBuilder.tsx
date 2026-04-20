"use client";

import { useState, useMemo } from "react";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { ALL_RECIPES, MEAL_POWERS } from "@/data/sandwich-recipes";
import type { SandwichRecipe } from "@/data/sandwich-recipes";
import {
  SHINY_GUIDE,
  ENCOUNTER_GUIDE,
  RAID_GUIDE,
  BREEDING_RECIPES,
} from "@/data/sandwich-guide";
import type { SandwichGuideEntry } from "@/data/sandwich-guide";
import { useI18n } from "@/i18n";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetail } from "./RecipeDetail";
import { ToolDisclaimer } from "@/components/shared/ToolDisclaimer";

type Tab = "shiny" | "encounter" | "raid" | "breeding" | "search";

const GUIDE_DATA: Record<Tab, SandwichGuideEntry[]> = {
  shiny: SHINY_GUIDE,
  encounter: ENCOUNTER_GUIDE,
  raid: RAID_GUIDE,
  breeding: [],
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
      className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
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
          className="shrink-0 rounded-sm px-2.5 py-1 text-xs font-bold text-white"
          style={{ background: typeColor }}
        >
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
              <span className="text-[10px] font-semibold text-teal-400">{t("sandwich.noHerba")}</span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-1.5">
          {hasAlts && (
            <span className="border border-[var(--pt-border-dim)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-text-dim)]">
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
          <div className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--pt-text-dim)]">
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
                        <span className="border border-[rgba(255,215,0,0.4)] px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-gold)]">
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
                        <span className="text-[10px] text-teal-400">{t("sandwich.noHerbaMystica")}</span>
                      )}
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--pt-text-dim)]">
                      {recipe.ingredients.join(", ")}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {recipe.powers.slice(0, 1).map((p, j) => (
                      <div key={j} className="text-[10px] font-semibold text-gray-300">
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

export function SandwichBuilder() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("shiny");
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<SandwichRecipe | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<SandwichGuideEntry | null>(null);
  const [searchPower, setSearchPower] = useState("");
  const [searchType, setSearchType] = useState("");

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
    { id: "encounter", label: t("sandwich.tabEncounter"), desc: t("sandwich.tabEncounterDesc"), color: "#4ECDC4" },
    { id: "raid", label: t("sandwich.tabRaid"), desc: t("sandwich.tabRaidDesc"), color: "#E040FB" },
    { id: "breeding", label: t("sandwich.tabBreeding"), desc: t("sandwich.tabBreedingDesc"), color: "#F9A825" },
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
    search: { title: "", info: "", gradient: "", border: "", titleColor: "" },
  };

  const banner = tabBanners[tab];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-1 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[3px] text-[var(--pt-text-dim)]">#001</div>
        <div className="mb-2 text-5xl">🥪</div>
        <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-2xl uppercase tracking-[2px] text-[var(--pt-gold)]">
          {t("sandwich.title")}
        </h1>
        <p className="text-sm text-[var(--pt-text-dim)]">{t("sandwich.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-0 border border-[var(--pt-border-dim)]">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => {
              setTab(tb.id);
              setSelectedType(null);
              setSelectedEntry(null);
            }}
            className={`flex-1 px-2 py-2.5 text-center text-sm font-bold transition-all border-b-2 ${
              tab === tb.id
                ? "bg-[rgba(255,215,0,0.06)] text-white"
                : "border-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
            }`}
            style={tab === tb.id ? { borderColor: tb.color } : undefined}
          >
            <div className="font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[1px]">{tb.label}</div>
            <div className="text-[10px] font-normal opacity-70">{tb.desc}</div>
          </button>
        ))}
      </div>

      {/* Type Filter — only for tabs that group by Pokémon type */}
      {tab !== "search" && tab !== "breeding" && (
        <div className="mb-5 flex flex-wrap justify-center gap-1.5">
          <button
            onClick={() => { setSelectedType(null); setSelectedEntry(null); }}
            className={`border px-3 py-1 text-xs font-semibold transition-colors ${
              !selectedType
                ? "border-white/30 bg-white/15 text-white"
                : "border-[var(--pt-border-dim)] bg-[var(--pt-card)] text-[var(--pt-text-dim)]"
            }`}
          >
            {t("sandwich.allTypes")}
          </button>
          {TYPES.map((tp) => (
            <button
              key={tp}
              onClick={() => {
                setSelectedType(selectedType === tp ? null : tp);
                setSelectedEntry(null);
              }}
              className="border px-3 py-1 text-[11px] font-bold text-white transition-all"
              style={{
                background: selectedType === tp ? TYPE_COLORS[tp] : "rgba(255,255,255,0.05)",
                borderColor: selectedType === tp ? TYPE_COLORS[tp] : "var(--pt-border-dim)",
                opacity: selectedType === tp ? 1 : 0.6,
              }}
            >
              {tp}
            </button>
          ))}
        </div>
      )}

      {/* Search Tab */}
      {tab === "search" && (
        <div className="mb-5">
          <div className="mb-4 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 text-sm font-bold text-gray-100">
              {t("sandwich.reverseSearch")}
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={searchPower}
                onChange={(e) => setSearchPower(e.target.value)}
                className="min-w-[180px] flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
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
                className="min-w-[140px] flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
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
            <div className="grid gap-2.5">
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
                    <span className="text-[10px] text-[var(--pt-text-dim)]">
                      {t("sandwich.requiresHerba")}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  {recipes.map((r, i) => (
                    <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guide tabs (shiny / encounter / raid) */}
      {tab !== "search" && tab !== "breeding" && (
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
          <div className="grid gap-2.5">
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
        ]}
      />
    </div>
  );
}
