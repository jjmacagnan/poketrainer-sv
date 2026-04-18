"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/shared/PageHeader";
import { STAT_LABELS } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { POWER_ITEMS_DATA, EV_BERRIES_DATA, calcBattles } from "@/data/training-tips";

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959",
  Atk: "#F5AC78",
  Def: "#FAE078",
  SpA: "#9DB7F5",
  SpD: "#A7DB8D",
  Spe: "#FA92B2",
};

const SECTIONS = [
  { id: "power-items", labelKey: "trainingTips.navPowerItems", color: "#34D399" },
  { id: "berries",     labelKey: "trainingTips.navBerries",    color: "#F87171" },
  { id: "tera-type",  labelKey: "trainingTips.navTeraType",   color: "#FFD700" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function TrainingTips() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<SectionId>("power-items");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [calcYield, setCalcYield] = useState(1);
  const [calcPowerItem, setCalcPowerItem] = useState(false);
  const [calcMacho, setCalcMacho] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const calcResult = calcBattles(calcYield, calcPowerItem, calcMacho);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        emoji="💡"
        title={t("trainingTips.title")}
        subtitle={t("trainingTips.subtitle")}
        gradient="linear-gradient(135deg, #34D399, #06B6D4)"
      />

      {/* Sticky anchor nav */}
      <div className="sticky top-[57px] z-40 mb-8 flex gap-2 rounded-xl border border-white/[0.08] bg-gray-950/90 p-2 backdrop-blur-md">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive ? `${s.color}22` : "transparent",
                color: isActive ? s.color : "#9CA3AF",
                border: isActive ? `1px solid ${s.color}44` : "1px solid transparent",
              }}
            >
              {t(s.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-14">
        <section
          id="power-items"
          ref={(el) => { sectionRefs.current["power-items"] = el; }}
        >
          <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.powerItemsTitle")}</h2>
          <p className="mb-6 text-sm text-gray-400">{t("trainingTips.powerItemsDesc")}</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
            {POWER_ITEMS_DATA.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.sprite} alt={item.name} width={32} height={32} className="[image-rendering:pixelated]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span
                    className="rounded-lg px-2 py-0.5 text-xs font-bold"
                    style={{ background: STAT_COLORS[item.stat] + "33", color: STAT_COLORS[item.stat] }}
                  >
                    {STAT_LABELS[item.stat]}
                  </span>
                  <span
                    className="ml-auto text-xs font-bold"
                    style={{ color: STAT_COLORS[item.stat] }}
                  >
                    +8 EVs
                  </span>
                </div>
                <p className="font-semibold text-white text-sm mb-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {t("trainingTips.powerItemsWhere")}: {item.where}
                </p>
              </div>
            ))}
          </div>

          {/* Battle Calculator */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <h3 className="mb-4 font-bold text-white">{t("trainingTips.calcTitle")}</h3>

            <div className="flex flex-col gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-400">{t("trainingTips.calcYield")}</label>
                <select
                  value={calcYield}
                  onChange={(e) => setCalcYield(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value={1}>1 EV</option>
                  <option value={2}>2 EVs</option>
                  <option value={3}>3 EVs</option>
                </select>
              </div>

              {[
                { key: "calcPowerItem", value: calcPowerItem, set: setCalcPowerItem, label: t("trainingTips.calcPowerItem") },
                ...(!calcPowerItem
                  ? [{ key: "calcMacho", value: calcMacho, set: setCalcMacho, label: t("trainingTips.calcMacho") }]
                  : []),
              ].map(({ key, value, set, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    set(!value);
                    if (key === "calcPowerItem" && !value) setCalcMacho(false);
                  }}
                  aria-pressed={value}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors"
                  style={{
                    borderColor: value ? "#34D399" : "rgba(255,255,255,0.08)",
                    background: value ? "#34D39911" : "transparent",
                    color: value ? "#34D399" : "#9CA3AF",
                  }}
                >
                  {label}
                  <span className="font-bold">{value ? "ON" : "OFF"}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              {[
                { label: t("trainingTips.calcEvsPerBattle"),    value: calcResult.evsPerBattle },
                { label: t("trainingTips.calcBattles252"),       value: `~${calcResult.battles252}` },
                { label: t("trainingTips.calcBattlesVitamins"),  value: `~${calcResult.battles152}` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="mt-1 text-[11px] text-gray-500 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="berries"
          ref={(el) => { sectionRefs.current["berries"] = el; }}
        >
          <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.berriesTitle")}</h2>
          <p className="mb-4 text-sm text-gray-400">{t("trainingTips.berriesDesc")}</p>

          <div className="overflow-hidden rounded-xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">{t("trainingTips.berriesName")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">{t("trainingTips.berriesStat")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">{t("trainingTips.berriesEffect")}</th>
                </tr>
              </thead>
              <tbody>
                {EV_BERRIES_DATA.map((berry, i) => (
                  <tr
                    key={berry.name}
                    className={i % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={berry.sprite} alt={berry.name} width={24} height={24} className="[image-rendering:pixelated]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        {berry.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded px-2 py-0.5 text-xs font-bold"
                        style={{
                          background: STAT_COLORS[berry.stat] + "33",
                          color: STAT_COLORS[berry.stat],
                        }}
                      >
                        {STAT_LABELS[berry.stat]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">−{berry.reduction} EVs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">{t("trainingTips.berriesWhere")}</p>
        </section>

        <section
          id="tera-type"
          ref={(el) => { sectionRefs.current["tera-type"] = el; }}
        >
          <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.teraTypeTitle")}</h2>
          <p className="mb-4 text-sm text-gray-400">{t("trainingTips.teraTypeLocation")}</p>

          <div className="rounded-xl border bg-white/[0.03] p-5" style={{ borderColor: "#FFD70033" }}>
            <div className="mb-5 flex flex-col gap-3">
              {[
                t("trainingTips.teraTypeStep1"),
                t("trainingTips.teraTypeStep2"),
                t("trainingTips.teraTypeStep3"),
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                    style={{ background: "#FFD70033", color: "#FFD700" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-300">{step}</span>
                </div>
              ))}
            </div>

            <div className="mb-4 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                {t("trainingTips.teraTypeReq")}
              </p>
              <ul className="flex flex-col gap-1">
                {[
                  t("trainingTips.teraTypeReqDefeated"),
                  t("trainingTips.teraTypeReqShards"),
                ].map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-gray-300">
                    <span style={{ color: "#FFD700" }}>✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray-500 italic">{t("trainingTips.teraTypeTip")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
