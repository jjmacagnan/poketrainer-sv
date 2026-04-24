import type { GuideContent } from "./types";

export const teraRaidBuildsContent: GuideContent = {
  pt: {
    title: "Melhores Builds para Tera Raid em Pokémon Scarlet e Violet",
    description:
      "Guia das melhores builds para Tera Raids 5★, 6★ e 7★ em SV. Pokémon, moves, EVs e estratégias para todas as raids, incluindo raids de eventos especiais.",
    intro:
      "As Tera Raids de alto nível em Pokémon Scarlet e Violet exigem builds otimizadas para superar a dificuldade e os mecanismos especiais dos bosses. Uma build bem montada pode fazer a diferença entre falhar em raids 6★ e 7★ e completar rapidamente com qualquer time.\n\nNeste guia você encontra as builds mais eficientes para diferentes papéis (DPS, suporte, buff), com EVs, moves e estratégias explicadas. Use o Raid Builder do PokéTrainer SV para montar e compartilhar suas builds.",
    sections: [
      {
        id: "como-funcionam",
        heading: "Como funcionam as Tera Raids de alto nível",
        body: "Raids 5★, 6★ e 7★ têm mecânicas especiais: o boss tem escudo de Tera que reduz dano até ser quebrado, pode remover buffs do time, e às vezes reverte para nivel base quando recebe muito dano de uma vez. Estratégias de suporte e timing de dano são fundamentais.",
        items: [
          { name: "Escudo Tera", detail: "Reduz dano significativamente — quebre primeiro com moves focados" },
          { name: "Buff removal", detail: "Boss pode limpar Swords Dance, Nasty Plot, etc." },
          { name: "Timer", detail: "Limite de turnos — builds de burst DPS são preferíveis" },
          { name: "Cheers", detail: "Use Cheer (Yell) para curar HP, boost de Atk, ou boost de Def do time" },
        ],
      },
      {
        id: "iron-hands",
        heading: "Iron Hands — Build DPS Universal",
        body: "Iron Hands é o Pokémon mais versátil para Tera Raids graças ao Belly Drum + Drain Punch. Com Tera Electric e Thunder Punch, também funciona contra Water/Flying bosses. É a escolha segura para qualquer raid de 6★.",
        items: [
          { name: "Ability", detail: "Quark Drive" },
          { name: "Item", detail: "Punching Glove" },
          { name: "Tera Type", detail: "Electric ou Fighting" },
          { name: "Moves", detail: "Belly Drum / Drain Punch / Thunder Punch / Ice Punch" },
          { name: "EVs", detail: "252 HP / 252 Atk / 4 Def — Adamant" },
          { name: "Estratégia", detail: "Belly Drum no turno 1, Drain Punch para sustain" },
        ],
      },
      {
        id: "flutter-mane",
        heading: "Flutter Mane — Build DPS Especial",
        body: "Flutter Mane é o melhor Special Attacker para raids graças a Protosynthesis e ao enorme Special Attack base. Com Nasty Plot e Moonblast/Shadow Ball, capaz de one-shot bosses em raids 7★ com suporte adequado.",
        items: [
          { name: "Ability", detail: "Protosynthesis (Booster Energy)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Fairy ou Ghost" },
          { name: "Moves", detail: "Nasty Plot / Moonblast / Shadow Ball / Mystical Fire" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid ou Modest" },
          { name: "Estratégia", detail: "Nasty Plot +2 antes de atacar, Booster Energy ativa na entrada" },
        ],
      },
      {
        id: "miraidon",
        heading: "Miraidon — Build exclusiva de SV",
        body: "Miraidon com Tera Electric e Hadron Engine é devastador contra qualquer boss que não resiste Electric. Electric Terrain + Parabolic Charge para healing enquanto causa dano massivo.",
        items: [
          { name: "Ability", detail: "Hadron Engine (ativa Electric Terrain automaticamente)" },
          { name: "Item", detail: "Life Orb" },
          { name: "Tera Type", detail: "Electric" },
          { name: "Moves", detail: "Parabolic Charge / Electro Drift / Dragon Pulse / Calm Mind" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid" },
          { name: "Estratégia", detail: "Hadron Engine ativa automaticamente, basta atacar com Electro Drift" },
        ],
      },
      {
        id: "suporte",
        heading: "Builds de Suporte para Raids em Grupo",
        body: "Em raids multiplayer, um Pokémon de suporte que buffa o time inteiro é extremamente valioso. Grimmsnarl com Reflect/Light Screen, ou Blissey com Helping Hand e Heal Pulse são os mais populares.",
        items: [
          { name: "Grimmsnarl", detail: "Prankster + Reflect/Light Screen/Thunder Wave" },
          { name: "Blissey", detail: "Helping Hand + Heal Pulse + Soft Boiled" },
          { name: "Torkoal", detail: "Drought + Sunny Day para boostar Flutter Mane" },
        ],
      },
    ],
    faq: [
      {
        question: "Preciso ter Miraidon/Koraidon para Tera Raids difíceis?",
        answer: "Não. Iron Hands e Flutter Mane são as melhores opções para 6★ e muitos eventos 7★. Miraidon/Koraidon são excelentes mas não obrigatórios.",
      },
      {
        question: "Como funciona o Belly Drum em raid?",
        answer: "Belly Drum corta o HP para 50% e maximiza o Atk (+6 stages). Em raids, o Pokémon tem Drain Punch para recuperar HP enquanto ataca. A estratégia funciona melhor quando o boss não remove buffs.",
      },
      {
        question: "Posso usar qualquer Tera Type?",
        answer: "O Tera Type afeta quais moves ganham o bônus de STAB. Idealmente, use um Tera Type que corresponda ao seu move de ataque principal para maximizar dano.",
      },
      {
        question: "Raids online exigem builds específicas?",
        answer: "Raids públicas (online com desconhecidos) são mais tolerantes. Para raids de eventos 7★, especialmente nos primeiros dias, builds otimizadas como Iron Hands ou Flutter Mane fazem grande diferença.",
      },
    ],
    cta: {
      label: "Abrir Raid Builder — Monte sua Build",
      href: "/raid-builder",
    },
    relatedLinks: [
      { label: "Guia de Sanduíche Shiny", href: "/guia-sanduiche-shiny" },
      { label: "Melhores Spots de EV Training", href: "/melhores-spots-ev-sv" },
    ],
  },
  en: {
    title: "Best Tera Raid Builds for Pokémon Scarlet and Violet",
    description:
      "Guide to the best builds for 5★, 6★, and 7★ Tera Raids in SV. Pokémon, moves, EVs, and strategies for all raids including special event raids.",
    intro:
      "High-level Tera Raids in Pokémon Scarlet and Violet demand optimized builds to overcome tough bosses and their special mechanics. A well-built team can be the difference between repeatedly failing 6★ and 7★ raids and breezing through them.\n\nThis guide covers the most efficient builds for different roles (DPS, support, buff), including EVs, moves, and strategies. Use the PokéTrainer SV Raid Builder to assemble and share your builds.",
    sections: [
      {
        id: "how-raids-work",
        heading: "How high-level Tera Raids work",
        body: "5★, 6★, and 7★ raids have special mechanics: the boss has a Tera Shield that reduces damage until broken, can remove team buffs, and sometimes reverts stats when taking too much burst damage. Support timing and damage sequencing are critical.",
        items: [
          { name: "Tera Shield", detail: "Significantly reduces damage — break it first with focused moves" },
          { name: "Buff removal", detail: "Boss can clear Swords Dance, Nasty Plot, etc." },
          { name: "Turn timer", detail: "Limited turns — burst DPS builds are preferred" },
          { name: "Cheers", detail: "Yell to heal HP, boost team Atk, or boost team Def" },
        ],
      },
      {
        id: "iron-hands",
        heading: "Iron Hands — Universal DPS Build",
        body: "Iron Hands is the most versatile Tera Raid Pokémon thanks to Belly Drum + Drain Punch. With Tera Electric and Thunder Punch, it also handles Water/Flying bosses. It's the safe pick for any 6★ raid.",
        items: [
          { name: "Ability", detail: "Quark Drive" },
          { name: "Item", detail: "Punching Glove" },
          { name: "Tera Type", detail: "Electric or Fighting" },
          { name: "Moves", detail: "Belly Drum / Drain Punch / Thunder Punch / Ice Punch" },
          { name: "EVs", detail: "252 HP / 252 Atk / 4 Def — Adamant" },
          { name: "Strategy", detail: "Belly Drum turn 1, Drain Punch for sustain" },
        ],
      },
      {
        id: "flutter-mane",
        heading: "Flutter Mane — Special DPS Build",
        body: "Flutter Mane is the best Special Attacker for raids thanks to Protosynthesis and an enormous Special Attack base. With Nasty Plot and Moonblast/Shadow Ball, it can one-shot bosses in 7★ raids with proper support.",
        items: [
          { name: "Ability", detail: "Protosynthesis (Booster Energy)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Fairy or Ghost" },
          { name: "Moves", detail: "Nasty Plot / Moonblast / Shadow Ball / Mystical Fire" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid or Modest" },
          { name: "Strategy", detail: "Nasty Plot +2 before attacking, Booster Energy activates on entry" },
        ],
      },
      {
        id: "miraidon",
        heading: "Miraidon — SV-exclusive build",
        body: "Miraidon with Tera Electric and Hadron Engine is devastating against any boss that doesn't resist Electric. Electric Terrain + Parabolic Charge provides healing while dealing massive damage.",
        items: [
          { name: "Ability", detail: "Hadron Engine (activates Electric Terrain automatically)" },
          { name: "Item", detail: "Life Orb" },
          { name: "Tera Type", detail: "Electric" },
          { name: "Moves", detail: "Parabolic Charge / Electro Drift / Dragon Pulse / Calm Mind" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid" },
          { name: "Strategy", detail: "Hadron Engine activates automatically; just spam Electro Drift" },
        ],
      },
      {
        id: "support",
        heading: "Support Builds for Multiplayer Raids",
        body: "In multiplayer raids, a support Pokémon that buffs the entire team is extremely valuable. Grimmsnarl with Reflect/Light Screen, or Blissey with Helping Hand and Heal Pulse are the most popular choices.",
        items: [
          { name: "Grimmsnarl", detail: "Prankster + Reflect/Light Screen/Thunder Wave" },
          { name: "Blissey", detail: "Helping Hand + Heal Pulse + Soft Boiled" },
          { name: "Torkoal", detail: "Drought + Sunny Day to boost Flutter Mane" },
        ],
      },
    ],
    faq: [
      {
        question: "Do I need Miraidon or Koraidon for hard Tera Raids?",
        answer: "No. Iron Hands and Flutter Mane are the top picks for 6★ and many 7★ events. Miraidon/Koraidon are excellent but not required.",
      },
      {
        question: "How does Belly Drum work in a raid?",
        answer: "Belly Drum cuts HP to 50% and maximizes Atk (+6 stages). In raids, you use Drain Punch to recover HP while attacking. The strategy works best when the boss doesn't clear buffs.",
      },
      {
        question: "Can I use any Tera Type?",
        answer: "Tera Type affects which moves get the STAB bonus. Ideally, match your Tera Type to your primary attacking move to maximize damage.",
      },
      {
        question: "Do online raids require specific builds?",
        answer: "Public raids (online with strangers) are more forgiving. For 7★ event raids — especially in the first few days — optimized builds like Iron Hands or Flutter Mane make a big difference.",
      },
    ],
    cta: {
      label: "Open Raid Builder — Build Your Team",
      href: "/raid-builder",
    },
    relatedLinks: [
      { label: "Shiny Pokémon Sandwich Guide", href: "/shiny-sandwich-guide" },
      { label: "Best EV Training Spots in SV", href: "/best-ev-training-spots-sv" },
    ],
  },
};
