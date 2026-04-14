"use client";

import { useState, useMemo, useCallback } from "react";
import { wildPokemonData } from "@/data/pokemon-utils";
import { STAT_NAMES } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { PokemonSlot, createEmptySlot } from "./PokemonSlot";
import type { PokemonSlotData } from "./PokemonSlot";

interface Pokemon {
  nationalDex: number;
  name: string;
  types: string[];
  sprite: string;
  pokedex: string;
}

const allPokemon = wildPokemonData as unknown as Pokemon[];

const EV_TEMPLATES: { label: string; evs: Record<StatName, number> }[] = [
  {
    label: "Physical Sweeper (252 Atk / 252 Spe / 4 HP)",
    evs: { HP: 4, Atk: 252, Def: 0, SpA: 0, SpD: 0, Spe: 252 },
  },
  {
    label: "Special Sweeper (252 SpA / 252 Spe / 4 HP)",
    evs: { HP: 4, Atk: 0, Def: 0, SpA: 252, SpD: 0, Spe: 252 },
  },
  {
    label: "Physical Bulk (252 HP / 252 Def / 4 SpD)",
    evs: { HP: 252, Atk: 0, Def: 252, SpA: 0, SpD: 4, Spe: 0 },
  },
  {
    label: "Special Bulk (252 HP / 252 SpD / 4 Def)",
    evs: { HP: 252, Atk: 0, Def: 4, SpA: 0, SpD: 252, Spe: 0 },
  },
  {
    label: "Mixed Attacker (252 Atk / 252 SpA / 4 Spe)",
    evs: { HP: 0, Atk: 252, Def: 0, SpA: 252, SpD: 0, Spe: 4 },
  },
  {
    label: "Bulky Attacker (252 HP / 252 Atk / 4 Def)",
    evs: { HP: 252, Atk: 252, Def: 4, SpA: 0, SpD: 0, Spe: 0 },
  },
];

export function EVTracker() {
  const { t } = useI18n();
  const [slots, setSlots] = useLocalStorage<PokemonSlotData[]>(
    "sv-ev-tracker-slots",
    Array.from({ length: 6 }, (_, i) => createEmptySlot(i))
  );

  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);
  const [pokemonSearch, setPokemonSearch] = useState("");

  const filteredPokemon = useMemo(() => {
    if (!pokemonSearch.trim()) return allPokemon.slice(0, 50);
    const q = pokemonSearch.toLowerCase();
    return allPokemon
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [pokemonSearch]);

  const updateSlot = useCallback(
    (index: number, data: PokemonSlotData) => {
      setSlots((prev) => {
        const next = [...prev];
        next[index] = data;
        return next;
      });
    },
    [setSlots]
  );

  const selectPokemon = useCallback(
    (pokemon: Pokemon) => {
      if (selectingSlot === null) return;
      setSlots((prev) => {
        const next = [...prev];
        next[selectingSlot] = {
          ...next[selectingSlot],
          name: pokemon.name,
          sprite: pokemon.sprite,
          types: pokemon.types,
        };
        return next;
      });
      setSelectingSlot(null);
      setPokemonSearch("");
    },
    [selectingSlot, setSlots]
  );

  // Pokemon selector modal
  if (selectingSlot !== null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-100">
            {t("evTracker.selectPokemon", { slot: selectingSlot + 1 })}
          </h2>
          <button
            onClick={() => {
              setSelectingSlot(null);
              setPokemonSearch("");
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-gray-400 hover:text-white"
          >
            {t("common.back")}
          </button>
        </div>

        <div className="mb-4">
          <SearchInput
            value={pokemonSearch}
            onChange={setPokemonSearch}
            placeholder={t("evTracker.searchPokemon")}
          />
        </div>

        <div className="grid max-h-[60vh] gap-1.5 overflow-y-auto sm:grid-cols-2">
          {filteredPokemon.map((p) => (
            <button
              key={p.nationalDex}
              onClick={() => selectPokemon(p)}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/20 hover:bg-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.sprite}
                alt={p.name}
                width={36}
                height={36}
                className="pixelated"
                loading="lazy"
              />
              <div>
                <div className="text-sm font-semibold text-gray-100">
                  {p.name}
                </div>
                <div className="text-xs text-gray-500">
                  #{p.nationalDex} · {p.types.join(" / ")}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="📊"
        title={t("evTracker.title")}
        subtitle={t("evTracker.subtitle")}
        gradient="linear-gradient(135deg, #7AC74C, #4ECDC4, #6390F0)"
      />

      {/* Summary Bar */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-gray-100">
              {t("evTracker.teamCount", { count: slots.filter((s) => s.name).length })}
            </div>
            <div className="text-xs text-gray-400">
              {t("evTracker.autoSave")}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSlots(
                  Array.from({ length: 6 }, (_, i) => createEmptySlot(i))
                );
              }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              {t("evTracker.resetAll")}
            </button>
          </div>
        </div>
      </div>

      {/* Slots */}
      <div className="grid gap-4 lg:grid-cols-2">
        {slots.map((slot, i) => (
          <PokemonSlot
            key={slot.id}
            data={slot}
            onChange={(data) => updateSlot(i, data)}
            onSelectPokemon={() => setSelectingSlot(i)}
            templateOptions={EV_TEMPLATES}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-2 text-sm font-bold text-gray-300">
          {t("evTracker.quickRef")}
        </h3>
        <div className="grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
          <div>
            <strong className="text-gray-300">{t("evTracker.pokerus")}</strong>{" "}
            {t("evTracker.pokerusDesc")}
          </div>
          <div>
            <strong className="text-gray-300">{t("evTracker.machoBrace")}</strong>{" "}
            {t("evTracker.machoBraceDesc")}
          </div>
          <div>
            <strong className="text-gray-300">{t("evTracker.powerItem")}</strong>{" "}
            {t("evTracker.powerItemDesc")}
          </div>
          <div>
            <strong className="text-gray-300">{t("evTracker.vitamin")}</strong>{" "}
            {t("evTracker.vitaminDesc")}
          </div>
          <div>
            <strong className="text-gray-300">{t("evTracker.templates")}</strong>{" "}
            {t("evTracker.templatesDesc")}
          </div>
          <div>
            <strong className="text-gray-300">{t("evTracker.limits")}</strong>{" "}
            {t("evTracker.limitsDesc")}
          </div>
        </div>
      </div>
    </div>
  );
}
