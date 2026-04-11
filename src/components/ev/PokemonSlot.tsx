"use client";

import { useState } from "react";
import { STAT_NAMES, STAT_LABELS, MAX_EV_PER_STAT, MAX_EV_TOTAL } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { clampEVs, VITAMIN_AMOUNT } from "@/lib/ev-calculator";
import { useI18n } from "@/i18n";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { PokemonType } from "@/data/types";

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959",
  Atk: "#F5AC78",
  Def: "#FAE078",
  SpA: "#9DB7F5",
  SpD: "#A7DB8D",
  Spe: "#FA92B2",
};

const POWER_ITEMS: { stat: StatName; name: string }[] = [
  { stat: "HP", name: "Power Weight" },
  { stat: "Atk", name: "Power Bracer" },
  { stat: "Def", name: "Power Belt" },
  { stat: "SpA", name: "Power Lens" },
  { stat: "SpD", name: "Power Band" },
  { stat: "Spe", name: "Power Anklet" },
];

export interface PokemonSlotData {
  id: string;
  name: string;
  sprite: string;
  types: string[];
  evs: Record<StatName, number>;
  pokerus: boolean;
  powerItem: StatName | null;
  machoBrace: boolean;
}

export function createEmptySlot(index: number): PokemonSlotData {
  return {
    id: `slot-${index}`,
    name: "",
    sprite: "",
    types: [],
    evs: { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
    pokerus: false,
    powerItem: null,
    machoBrace: false,
  };
}

interface PokemonSlotProps {
  data: PokemonSlotData;
  onChange: (data: PokemonSlotData) => void;
  onSelectPokemon: () => void;
  templateOptions: { label: string; evs: Record<StatName, number> }[];
}

export function PokemonSlot({
  data,
  onChange,
  onSelectPokemon,
  templateOptions,
}: PokemonSlotProps) {
  const { t } = useI18n();
  const [showModifiers, setShowModifiers] = useState(false);

  const totalEVs = Object.values(data.evs).reduce((a, b) => a + b, 0);
  const remaining = MAX_EV_TOTAL - totalEVs;

  const updateEV = (stat: StatName, delta: number) => {
    const newEvs = clampEVs(data.evs, stat, delta);
    onChange({ ...data, evs: newEvs });
  };

  const resetEVs = () => {
    onChange({
      ...data,
      evs: { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
    });
  };

  const applyTemplate = (template: Record<StatName, number>) => {
    onChange({ ...data, evs: template });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button
          onClick={onSelectPokemon}
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-white/20"
        >
          {data.sprite ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.sprite}
              alt={data.name}
              width={40}
              height={40}
              className="pixelated"
            />
          ) : (
            <span className="text-lg text-gray-500">+</span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          {data.name ? (
            <>
              <div className="truncate text-sm font-bold text-gray-100">
                {data.name}
              </div>
              <div className="mt-0.5 flex gap-1">
                {data.types.map((t) => (
                  <TypeBadge key={t} type={t as PokemonType} small />
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={onSelectPokemon}
              className="text-sm font-semibold text-gray-400 hover:text-white"
            >
              {t("pokemonSlot.selectPokemon")}
            </button>
          )}
        </div>

        {/* Total / Remaining */}
        <div className="text-right">
          <div className="text-xs font-semibold text-gray-400">
            {totalEVs}/{MAX_EV_TOTAL}
          </div>
          <div
            className={`text-xs font-bold ${
              remaining === 0 ? "text-emerald-400" : "text-gray-500"
            }`}
          >
            {t("pokemonSlot.remaining", { count: remaining })}
          </div>
        </div>
      </div>

      {/* Total EV Bar */}
      <div className="px-4 pt-3">
        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
            style={{
              width: `${(totalEVs / MAX_EV_TOTAL) * 100}%`,
              background:
                totalEVs >= MAX_EV_TOTAL
                  ? "#10B981"
                  : "linear-gradient(90deg, #8B5CF6, #6D28D9)",
            }}
          />
        </div>
      </div>

      {/* Stat Bars + Controls */}
      <div className="space-y-1.5 px-4 py-3">
        {STAT_NAMES.map((stat) => {
          const value = data.evs[stat];
          const fill = (value / MAX_EV_PER_STAT) * 100;
          return (
            <div key={stat} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-400">
                {stat}
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold text-gray-200">
                {value}
              </span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                  style={{
                    width: `${fill}%`,
                    background:
                      value >= MAX_EV_PER_STAT
                        ? "#10B981"
                        : STAT_COLORS[stat],
                  }}
                />
              </div>
              <div className="flex shrink-0 gap-0.5">
                <button
                  onClick={() => updateEV(stat, -1)}
                  className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  -1
                </button>
                <button
                  onClick={() => updateEV(stat, 1)}
                  className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  +1
                </button>
                <button
                  onClick={() => updateEV(stat, VITAMIN_AMOUNT)}
                  className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 transition-colors hover:bg-violet-500/25"
                  title={t("pokemonSlot.vitaminTitle")}
                >
                  +10
                </button>
                <button
                  onClick={() => updateEV(stat, -VITAMIN_AMOUNT)}
                  className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="-10"
                >
                  -10
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modifiers + Actions */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Modifiers */}
          <button
            onClick={() => setShowModifiers(!showModifiers)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-400 transition-colors hover:text-white"
          >
            {t("pokemonSlot.modifiers")} {showModifiers ? "▲" : "▼"}
          </button>

          {/* Template Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                const tpl = templateOptions[parseInt(e.target.value)];
                if (tpl) applyTemplate(tpl.evs);
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-400"
          >
            <option value="">{t("pokemonSlot.templatesDrop")}</option>
            {templateOptions.map((tpl, i) => (
              <option key={i} value={i}>
                {tpl.label}
              </option>
            ))}
          </select>

          <button
            onClick={resetEVs}
            className="ml-auto rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
          >
            {t("common.reset")}
          </button>
        </div>

        {/* Modifier Toggles */}
        {showModifiers && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => onChange({ ...data, pokerus: !data.pokerus })}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                data.pokerus
                  ? "border-pink-400/50 bg-pink-500/20 text-pink-300"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              {t("pokemonSlot.pokerus")} {data.pokerus ? "(2×)" : ""}
            </button>

            <button
              onClick={() =>
                onChange({
                  ...data,
                  machoBrace: !data.machoBrace,
                  powerItem: data.machoBrace ? data.powerItem : null,
                })
              }
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                data.machoBrace
                  ? "border-yellow-400/50 bg-yellow-500/20 text-yellow-300"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              {t("pokemonSlot.machoBrace")} {data.machoBrace ? "(2×)" : ""}
            </button>

            <select
              value={data.powerItem || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  powerItem: (e.target.value as StatName) || null,
                  machoBrace: e.target.value ? false : data.machoBrace,
                })
              }
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-400"
            >
              <option value="">{t("pokemonSlot.powerItemDrop")}</option>
              {POWER_ITEMS.map((pi) => (
                <option key={pi.stat} value={pi.stat}>
                  {pi.name} (+8 {pi.stat})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
