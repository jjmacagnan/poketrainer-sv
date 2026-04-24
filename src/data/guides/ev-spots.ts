import type { GuideContent } from "./types";

export const evSpotsContent: GuideContent = {
  pt: {
    title: "Melhores Spots de EV Training em Pokémon Scarlet e Violet",
    description:
      "Guia completo dos melhores locais para treinar EVs em Pokémon SV. Spots por stat (HP, Atk, Def, SpA, SpD, Speed) com Pokémon, localização e dicas de eficiência.",
    intro:
      "EV Training em Pokémon Scarlet e Violet é muito mais rápido do que nas gerações anteriores graças ao sistema de batalha em campo aberto. Em vez de batalhas aleatórias, você pode ir direto ao Pokémon que dá o EV que precisa.\n\nNeste guia você encontra os melhores spots para cada stat, os Pokémon mais eficientes, e como usar Power Items e Pokérus para maximizar o ganho de EVs por batalha.",
    sections: [
      {
        id: "como-funciona",
        heading: "Como funcionam os EVs em SV",
        body: "Cada Pokémon derrotado dá 1-3 EVs em um stat específico. Com Power Item (+8 ao stat do item) e Pokérus (2x total), você pode ganhar até 22 EVs por batalha. O limite é 252 por stat e 510 total.",
        items: [
          { name: "Yield base", detail: "1-3 EVs dependendo do Pokémon" },
          { name: "Power Item", detail: "+8 ao stat do item (não stacks com Macho Brace)" },
          { name: "Pokérus", detail: "2x total (stacks com Power Item)" },
          { name: "Vitaminas", detail: "+10 EVs instantâneos (até 100 por stat)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Melhor Spot",
        body: "Para Speed EVs, o melhor spot é Tagtree Thicket (região leste), onde Flittle e Espathra spawnão em grande quantidade. Ambos dão 1 EV de Speed. Com Koraidon/Miraidon e o Let's Go mode, você pode fazer batalhas automáticas muito rapidamente.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — South Province Area Five" },
          { name: "Espathra", detail: "2 Speed EV — Area Zero / Tagtree Thicket" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (início do jogo)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Melhor Spot",
        body: "Para Attack EVs, Yungoos e Gumshoos na West Province Area Three são os mais fáceis de encontrar em quantidade. No pós-jogo, Tauros na mesma área é ainda mais eficiente.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — West Province Area Three" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Three (alto nível)" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Melhor Spot",
        body: "Gastly e Haunter em Alfornada Cavern ou nas ruínas são os melhores para Special Attack EVs. Alternativa: Flaaffy e Electabuzz na East Province.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — Alfornada Cavern" },
          { name: "Haunter", detail: "2 SpA EV — Alfornada Cavern / ruins" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Melhor Spot",
        body: "Dunsparce e Dundunsparce são os melhores para HP EVs no pós-jogo, abundantes em East Province Area Three. Alternativa acessível: Azurill/Marill na costa.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — East Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Costa sul" },
          { name: "Marill", detail: "2 HP EV — Próximo a corpos d'água" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Melhor Spot",
        body: "Nacli e Naclstack em West Province Area One e Asado Desert são os mais eficientes para Defense EVs, com yields de 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — West Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — East Province Area Three" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Melhor Spot",
        body: "Tentacool e Tentacruel no oceano são os clássicos para SpDef. No pós-jogo, Ditto em West Province Area Two também dá SpDef EVs.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — oceano (qualquer área costeira)" },
          { name: "Tentacruel", detail: "2 SpD EV — oceano profundo" },
          { name: "Ditto", detail: "1 SpD EV — West Province Area Two" },
        ],
      },
    ],
    faq: [
      {
        question: "Posso usar vitaminas para pular o EV farming?",
        answer: "Sim, mas só até 100 EVs por stat. Para chegar ao máximo (252), você ainda precisará derrotar Pokémon para os últimos 152 EVs. Vitaminas são caras — use com moderação.",
      },
      {
        question: "Let's Go mode conta para EVs?",
        answer: "Sim! Batalhas automáticas no Let's Go mode contam para EVs normalmente. É a forma mais rápida de EV training em SV.",
      },
      {
        question: "Power Item e Pokérus stackam?",
        answer: "Sim. Com Power Item (+8) e Pokérus (2x), a fórmula é: (yield base + 8) × 2. Para um Pokémon com 1 EV base, você ganha 18 EVs por batalha.",
      },
      {
        question: "Como reseto os EVs de um Pokémon?",
        answer: "Use Feathers (EV-lowering items) encontrados na praia ou bagas específicas. No pós-jogo, é mais prático treinar um novo Pokémon do que resetar.",
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
      "EV training in Pokémon Scarlet and Violet is much faster than in previous generations thanks to the open-world battle system. Instead of random encounters, you can walk directly to whichever Pokémon yields the stat you need.\n\nThis guide covers the best spots for each stat, the most efficient Pokémon to target, and how to use Power Items and Pokérus to maximize EVs gained per battle.",
    sections: [
      {
        id: "how-it-works",
        heading: "How EVs work in SV",
        body: "Each defeated Pokémon grants 1-3 EVs in a specific stat. With a Power Item (+8 to the item's stat) and Pokérus (2x total), you can gain up to 22 EVs per battle. The cap is 252 per stat and 510 total.",
        items: [
          { name: "Base yield", detail: "1-3 EVs depending on the Pokémon" },
          { name: "Power Item", detail: "+8 to the item's stat (doesn't stack with Macho Brace)" },
          { name: "Pokérus", detail: "2x total (stacks with Power Item)" },
          { name: "Vitamins", detail: "+10 EVs instantly (up to 100 per stat)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Best Spot",
        body: "For Speed EVs, Tagtree Thicket (eastern region) is the top spot where Flittle and Espathra spawn in large numbers. Both yield Speed EVs. With Let's Go mode, you can chain battles automatically at high speed.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — South Province Area Five" },
          { name: "Espathra", detail: "2 Speed EV — Area Zero / Tagtree Thicket" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (early game)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Best Spot",
        body: "For Attack EVs, Yungoos and Gumshoos in West Province Area Three are plentiful and easy to farm. In the post-game, Tauros in the same area is even more efficient.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — West Province Area Three" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Three (high level)" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Best Spot",
        body: "Gastly and Haunter in Alfornada Cavern or the ruins are the go-to for Special Attack EVs. Alternative: Flaaffy and Electabuzz in East Province.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — Alfornada Cavern" },
          { name: "Haunter", detail: "2 SpA EV — Alfornada Cavern / ruins" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Best Spot",
        body: "Dunsparce and Dundunsparce are the best HP EV sources in the post-game, found abundantly in East Province Area Three. Early-game alternative: Azurill/Marill along the coast.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — East Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Southern coast" },
          { name: "Marill", detail: "2 HP EV — Near bodies of water" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Best Spot",
        body: "Nacli and Naclstack in West Province Area One and Asado Desert are the most efficient for Defense EVs, with yields of 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — West Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — East Province Area Three" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Best Spot",
        body: "Tentacool and Tentacruel in the ocean are the classic SpDef spots. Post-game, Ditto in West Province Area Two also yields SpDef EVs.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — ocean (any coastal area)" },
          { name: "Tentacruel", detail: "2 SpD EV — deep ocean" },
          { name: "Ditto", detail: "1 SpD EV — West Province Area Two" },
        ],
      },
    ],
    faq: [
      {
        question: "Can I use vitamins to skip EV farming?",
        answer: "Yes, but only up to 100 EVs per stat. To reach the max (252), you still need to battle Pokémon for the remaining 152 EVs. Vitamins are expensive — use them strategically.",
      },
      {
        question: "Does Let's Go mode count for EVs?",
        answer: "Yes! Auto-battles in Let's Go mode count for EVs normally. It's the fastest EV training method in SV.",
      },
      {
        question: "Do Power Item and Pokérus stack?",
        answer: "Yes. With Power Item (+8) and Pokérus (2x), the formula is: (base yield + 8) × 2. For a Pokémon with 1 base EV yield, you gain 18 EVs per battle.",
      },
      {
        question: "How do I reset a Pokémon's EVs?",
        answer: "Use EV-lowering Feathers found on beaches, or specific berries. In the post-game, it's often faster to train a new Pokémon than to fully reset EVs.",
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
