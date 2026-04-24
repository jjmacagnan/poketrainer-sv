import type { GuideContent } from "./types";

export const evSpotsContent: GuideContent = {
  pt: {
    title: "Melhores Spots de EV Training em Pokémon Scarlet e Violet",
    description:
      "Guia completo dos melhores locais para treinar EVs em Pokémon SV. Spots por stat (HP, Atk, Def, SpA, SpD, Speed) com Pokémon, localização e dicas de eficiência.",
    intro:
      "EV Training em Pokémon Scarlet e Violet é muito mais rápido do que nas gerações anteriores graças ao sistema de batalha em campo aberto. Em vez de batalhas aleatórias, você pode ir direto ao Pokémon que dá o EV que precisa.\n\nNeste guia você encontra os melhores spots para cada stat, os Pokémon mais eficientes, e como usar Power Items para maximizar o ganho de EVs por batalha.",
    sections: [
      {
        id: "como-funciona",
        heading: "Como funcionam os EVs em SV",
        body: "Cada Pokémon derrotado dá 1-3 EVs em um stat específico. Com Power Item (+8 ao stat do item), você pode ganhar até 11 EVs por batalha. O Pokérus não existe em SV. O limite é 252 por stat e 510 total.",
        items: [
          { name: "Yield base", detail: "1-3 EVs dependendo do Pokémon" },
          { name: "Power Item", detail: "+8 ao stat do item (não stacks com Macho Brace)" },
          { name: "Vitaminas", detail: "+10 EVs instantâneos (sem limite em SV — usáveis até 252)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Melhor Spot",
        body: "Para Speed EVs, o melhor spot é Asado Desert, onde Flittle e Espathra spawnão em grande quantidade. Flittle dá 1 EV de Speed e Espathra dá 2.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — Asado Desert" },
          { name: "Espathra", detail: "2 Speed EV — Asado Desert" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (início do jogo)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Melhor Spot",
        body: "Para Attack EVs, Yungoos (South Province Area One) e Gumshoos (West Province Area Three) são os mais fáceis de encontrar em quantidade. No pós-jogo, Tauros na West Province Area Two é ainda mais eficiente.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — South Province Area One" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Two" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Melhor Spot",
        body: "Gastly e Haunter na South Province Area Three (à noite) são os melhores para Special Attack EVs. Alternativa: Flaaffy na East Province Area Two.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — South Province Area Three (à noite)" },
          { name: "Haunter", detail: "2 SpA EV — South Province Area Three (à noite)" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Melhor Spot",
        body: "Dunsparce e Dudunsparce são os melhores para HP EVs no pós-jogo, abundantes na South Province Area Three. Alternativa acessível: Azurill/Marill na costa. Ditto (West Province Area Two) também dá 1 HP EV.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — South Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Costa sul" },
          { name: "Marill", detail: "2 HP EV — Próximo a corpos d'água" },
          { name: "Ditto", detail: "1 HP EV — West Province Area Two" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Melhor Spot",
        body: "Nacli e Naclstack em East Province Area One e Asado Desert são os mais eficientes para Defense EVs, com yields de 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — East Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — South Province Area Five" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Melhor Spot",
        body: "Tentacool e Tentacruel no oceano são os clássicos para SpDef EVs. Fáceis de encontrar em qualquer área costeira.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — oceano (qualquer área costeira)" },
          { name: "Tentacruel", detail: "2 SpD EV — oceano profundo" },
        ],
      },
    ],
    faq: [
      {
        question: "Posso usar vitaminas para pular o EV farming?",
        answer: "Sim! Em Pokémon Scarlet & Violet, vitaminas não têm limite por stat — você pode usá-las até os 252 EVs completos. São a forma mais rápida de EV training se você tiver Pokédollars suficientes.",
      },
      {
        question: "Let's Go mode conta para EVs?",
        answer: "O comportamento do modo Let's Go (botão R) em relação a EVs pode variar conforme a versão do jogo. Para garantir o ganho de EVs, recomendamos entrar em batalhas normais.",
      },
      {
        question: "Como o Power Item funciona?",
        answer: "O Power Item adiciona +8 EVs do stat correspondente a cada batalha, independente do Pokémon derrotado. Para um Pokémon com 1 EV base, você ganha 9 EVs por batalha. Note que o Pokérus foi removido em SV e não existe nesta geração.",
      },
      {
        question: "Como reseto os EVs de um Pokémon?",
        answer: "Use as frutas redutoras de EV: Pomeg (HP), Kelpsy (Atk), Qualot (Def), Hondew (SpA), Grepa (SpD) e Tamato (Spe). Cada fruta reduz 10 EVs do stat correspondente.",
      },
    ],
    cta: {
      label: "Abrir EV Pokédex — Filtrar por Stat",
      href: "/ev-pokedex?stat=Spe",
    },
    relatedLinks: [
      { label: "Guia de Sanduíche Shiny", href: "/guia-sanduiche-shiny" },
      { label: "Melhores Builds para Tera Raid", href: "/melhores-builds-tera-raid" },
    ],
  },
  en: {
    title: "Best EV Training Spots in Pokémon Scarlet and Violet",
    description:
      "Complete guide to the best EV training locations in Pokémon SV. Spots by stat (HP, Atk, Def, SpA, SpD, Speed) with Pokémon, location, and efficiency tips.",
    intro:
      "EV training in Pokémon Scarlet and Violet is much faster than in previous generations thanks to the open-world battle system. Instead of random encounters, you can walk directly to whichever Pokémon yields the stat you need.\n\nThis guide covers the best spots for each stat, the most efficient Pokémon to target, and how to use Power Items to maximize EVs gained per battle.",
    sections: [
      {
        id: "how-it-works",
        heading: "How EVs work in SV",
        body: "Each defeated Pokémon grants 1-3 EVs in a specific stat. With a Power Item (+8 to the item's stat), you can gain up to 11 EVs per battle. Pokérus does not exist in SV. The cap is 252 per stat and 510 total.",
        items: [
          { name: "Base yield", detail: "1-3 EVs depending on the Pokémon" },
          { name: "Power Item", detail: "+8 to the item's stat (doesn't stack with Macho Brace)" },
          { name: "Vitamins", detail: "+10 EVs instantly (no cap in SV — usable up to 252)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Best Spot",
        body: "For Speed EVs, Asado Desert is the top spot where Flittle and Espathra spawn in large numbers. Flittle yields 1 Speed EV; Espathra yields 2.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — Asado Desert" },
          { name: "Espathra", detail: "2 Speed EV — Asado Desert" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (early game)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Best Spot",
        body: "For Attack EVs, Yungoos (South Province Area One) and Gumshoos (West Province Area Three) are plentiful and easy to farm. In the post-game, Tauros in West Province Area Two is even more efficient.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — South Province Area One" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Two" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Best Spot",
        body: "Gastly and Haunter in South Province Area Three (at night) are the go-to for Special Attack EVs. Alternative: Flaaffy in East Province Area Two.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — South Province Area Three (at night)" },
          { name: "Haunter", detail: "2 SpA EV — South Province Area Three (at night)" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Best Spot",
        body: "Dunsparce and Dudunsparce are the best HP EV sources in the post-game, found abundantly in South Province Area Three. Early-game alternative: Azurill/Marill along the coast. Ditto (West Province Area Two) also yields 1 HP EV.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — South Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Southern coast" },
          { name: "Marill", detail: "2 HP EV — Near bodies of water" },
          { name: "Ditto", detail: "1 HP EV — West Province Area Two" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Best Spot",
        body: "Nacli and Naclstack in East Province Area One and Asado Desert are the most efficient for Defense EVs, with yields of 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — East Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — South Province Area Five" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Best Spot",
        body: "Tentacool and Tentacruel in the ocean are the classic SpDef spots, easy to find along any coastline.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — ocean (any coastal area)" },
          { name: "Tentacruel", detail: "2 SpD EV — deep ocean" },
        ],
      },
    ],
    faq: [
      {
        question: "Can I use vitamins to skip EV farming?",
        answer: "Yes! In Pokémon Scarlet & Violet, vitamins have no per-stat cap — you can use them all the way to the full 252 EVs. They're the fastest EV training method if you have enough Pokédollars.",
      },
      {
        question: "Does Let's Go mode count for EVs?",
        answer: "Let's Go mode (R button) behavior regarding EVs may vary depending on your game version. To be safe, we recommend entering normal battles to guarantee EV gains.",
      },
      {
        question: "How does the Power Item work?",
        answer: "A Power Item adds +8 EVs of its corresponding stat per battle, regardless of which Pokémon you defeat. For a Pokémon with 1 base EV yield, you gain 9 EVs per battle. Note that Pokérus was removed in Gen 9 and does not exist in SV.",
      },
      {
        question: "How do I reset a Pokémon's EVs?",
        answer: "Use EV-reducing berries: Pomeg (HP), Kelpsy (Atk), Qualot (Def), Hondew (SpA), Grepa (SpD), and Tamato (Spe). Each berry removes 10 EVs from the corresponding stat.",
      },
    ],
    cta: {
      label: "Open EV Pokédex — Filter by Stat",
      href: "/ev-pokedex?stat=Spe",
    },
    relatedLinks: [
      { label: "Shiny Pokémon Sandwich Guide", href: "/shiny-sandwich-guide" },
      { label: "Best Tera Raid Builds", href: "/best-tera-raid-builds" },
    ],
  },
};
