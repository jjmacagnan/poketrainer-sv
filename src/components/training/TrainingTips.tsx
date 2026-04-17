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
          <p className="text-gray-400 text-sm">{t("trainingTips.powerItemsTitle")}</p>
        </section>

        <section
          id="berries"
          ref={(el) => { sectionRefs.current["berries"] = el; }}
        >
          <p className="text-gray-400 text-sm">{t("trainingTips.berriesTitle")}</p>
        </section>

        <section
          id="tera-type"
          ref={(el) => { sectionRefs.current["tera-type"] = el; }}
        >
          <p className="text-gray-400 text-sm">{t("trainingTips.teraTypeTitle")}</p>
        </section>
      </div>
    </div>
  );
}
