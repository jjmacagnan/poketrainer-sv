import type { GuideContent } from "./types";

export const sandwichShinyContent: GuideContent = {
  pt: {
    title: "Guia de Sanduíche Shiny Pokémon Scarlet e Violet — Receitas com Sparkling Power",
    description:
      "Aprenda a fazer os melhores sanduíches para aumentar a chance de encontrar Pokémon Shiny em SV. Receitas com Herba Mystica e Sparkling Power Lv. 3 por tipo.",
    intro:
      "Os sanduíches são uma das mecânicas mais poderosas de Pokémon Scarlet e Violet para quem quer aumentar as chances de encontrar Pokémon Shiny. Com a combinação certa de ingredientes e Herba Mystica, você ativa o Meal Power Sparkling, que eleva a taxa de Shiny para o tipo escolhido.\n\nNeste guia você vai encontrar as receitas mais eficientes verificadas pela comunidade, dicas de onde farmar Herba Mystica e como usar o Sandwich Builder para montar sua estratégia de Shiny Hunt.",
    sections: [
      {
        id: "como-funciona",
        heading: "Como funciona o Sparkling Power",
        body: "O Meal Power Sparkling aumenta a taxa de encontros com Pokémon Shiny quando ativado no Nível 3. Para atingir o Lv. 3, a receita precisa de 2x Herba Mystica do mesmo tipo. Cada receita funciona por 30 minutos após comer o sanduíche.",
        items: [
          { name: "Sparkling Lv. 1", detail: "Pequeno aumento de taxa Shiny" },
          { name: "Sparkling Lv. 2", detail: "Aumento moderado" },
          { name: "Sparkling Lv. 3", detail: "Máxima taxa Shiny — o que queremos", note: "Requer 2x Herba Mystica" },
        ],
      },
      {
        id: "receitas-basicas",
        heading: "Receita base para qualquer tipo",
        body: "A fórmula universal é: 1 ingrediente principal + 2x Herba Mystica do mesmo sabor. O ingrediente principal determina o tipo de Pokémon afetado pelo Sparkling Power.",
        items: [
          { name: "Tomate", detail: "Fire-type Sparkling Lv. 3" },
          { name: "Pepino", detail: "Grass-type Sparkling Lv. 3" },
          { name: "Pão de hambúrguer", detail: "Normal-type Sparkling Lv. 3" },
          { name: "Alface", detail: "Bug-type Sparkling Lv. 3" },
          { name: "Queijo", detail: "Electric-type Sparkling Lv. 3" },
        ],
      },
      {
        id: "herba-mystica",
        heading: "Como farmar Herba Mystica",
        body: "Herba Mystica é o ingrediente raro que torna possível o Sparkling Lv. 3. A forma mais eficiente de obter é completando Tera Raids de 5★ e 6★. Cada tipo de Herba Mystica tem raids específicas que a dropam com mais frequência.",
        items: [
          { name: "Sweet Herba Mystica", detail: "Raids de Cetitan, Glalie — tipo Ice" },
          { name: "Salty Herba Mystica", detail: "Raids de Orthworm, Palafin — tipo Steel/Water" },
          { name: "Spicy Herba Mystica", detail: "Raids de Scovillain, Tinkaton" },
          { name: "Bitter Herba Mystica", detail: "Raids de Bronzong, Corviknight" },
          { name: "Sour Herba Mystica", detail: "Raids de Basculegion, Gyarados" },
        ],
      },
      {
        id: "dicas",
        heading: "Dicas para Shiny Hunt eficiente",
        body: "Além do sanduíche, outras técnicas aumentam a probabilidade de Shiny: o Shiny Charm (completar Pokédex regional), fazer picnics repetidos na mesma área e usar o Outbreak Mass para concentrar spawns de um tipo específico.",
        items: [
          { name: "Shiny Charm", detail: "Dobra as chances base — prioritize conseguir" },
          { name: "Mass Outbreak", detail: "Concentra spawns de 1 espécie — combine com sanduíche" },
          { name: "30 minutos", detail: "Duração do sanduíche — planeje seu hunt" },
        ],
      },
    ],
    faq: [
      {
        question: "Preciso de 2x Herba Mystica do mesmo tipo?",
        answer: "Sim. Para atingir Sparkling Power Lv. 3 você precisa de 2 Herba Mystica do mesmo sabor (ex: 2x Sweet Herba). Misturar sabores diferentes não atinge Lv. 3.",
      },
      {
        question: "Quanto tempo dura o efeito do sanduíche?",
        answer: "30 minutos após comer. O timer fica visível no menu de Picnic. Planeje sua hunt para esse janela.",
      },
      {
        question: "Qual é o melhor Herba para Shiny Hunt geral?",
        answer: "Depende do tipo de Pokémon que você quer. Cada tipo precisa de um ingrediente e Herba específicos. Use o Sandwich Builder do PokéTrainer SV para encontrar a receita certa.",
      },
      {
        question: "Posso usar o sanduíche durante Mass Outbreak?",
        answer: "Sim, e é a combinação mais eficiente. Ative o Mass Outbreak de um Pokémon e coma o sanduíche com Sparkling do tipo correspondente para maximizar as chances.",
      },
    ],
    cta: {
      label: "Abrir Sandwich Builder — Modo Shiny Hunt",
      href: "/sandwich-builder?tab=shiny",
    },
    relatedLinks: [
      { label: "Melhores Spots de EV Training em SV", href: "/melhores-spots-ev-sv" },
      { label: "Melhores Builds para Tera Raid", href: "/melhores-builds-tera-raid" },
    ],
  },
  en: {
    title: "Shiny Pokémon Sandwich Guide for Scarlet & Violet — Sparkling Power Recipes",
    description:
      "Learn the best sandwich recipes to boost Shiny Pokémon encounter rates in SV. Herba Mystica combinations for Sparkling Power Lv. 3 by type.",
    intro:
      "Sandwiches are one of the most powerful mechanics in Pokémon Scarlet and Violet for Shiny hunting. With the right ingredient and Herba Mystica combination, you can activate Sparkling Meal Power, which significantly boosts the Shiny encounter rate for a chosen type.\n\nThis guide covers the most efficient community-verified recipes, where to farm Herba Mystica, and how to use the Sandwich Builder tool to plan your Shiny hunt strategy.",
    sections: [
      {
        id: "how-it-works",
        heading: "How Sparkling Power works",
        body: "Sparkling Meal Power boosts the Shiny encounter rate when activated at Level 3. To reach Lv. 3, your recipe needs 2x Herba Mystica of the same flavor. The effect lasts 30 minutes after eating.",
        items: [
          { name: "Sparkling Lv. 1", detail: "Small Shiny rate boost" },
          { name: "Sparkling Lv. 2", detail: "Moderate boost" },
          { name: "Sparkling Lv. 3", detail: "Maximum Shiny rate — what you want", note: "Requires 2x Herba Mystica" },
        ],
      },
      {
        id: "basic-recipes",
        heading: "Base recipe for any type",
        body: "The universal formula is: 1 main ingredient + 2x Herba Mystica of the same flavor. The main ingredient determines which Pokémon type gets the Sparkling Power boost.",
        items: [
          { name: "Tomato", detail: "Fire-type Sparkling Lv. 3" },
          { name: "Cucumber", detail: "Grass-type Sparkling Lv. 3" },
          { name: "Hamburger bun", detail: "Normal-type Sparkling Lv. 3" },
          { name: "Lettuce", detail: "Bug-type Sparkling Lv. 3" },
          { name: "Cheese", detail: "Electric-type Sparkling Lv. 3" },
        ],
      },
      {
        id: "herba-mystica",
        heading: "How to farm Herba Mystica",
        body: "Herba Mystica is the rare ingredient that enables Sparkling Lv. 3. The most reliable source is completing 5★ and 6★ Tera Raids. Each Herba flavor drops from specific raid types more frequently.",
        items: [
          { name: "Sweet Herba Mystica", detail: "Cetitan, Glalie raids (Ice-type)" },
          { name: "Salty Herba Mystica", detail: "Orthworm, Palafin raids (Steel/Water)" },
          { name: "Spicy Herba Mystica", detail: "Scovillain, Tinkaton raids" },
          { name: "Bitter Herba Mystica", detail: "Bronzong, Corviknight raids" },
          { name: "Sour Herba Mystica", detail: "Basculegion, Gyarados raids" },
        ],
      },
      {
        id: "tips",
        heading: "Tips for efficient Shiny hunting",
        body: "Beyond sandwiches, other techniques boost Shiny odds: the Shiny Charm (complete the regional Pokédex), repeated picnics in the same area, and using Mass Outbreaks to concentrate spawns of a specific species.",
        items: [
          { name: "Shiny Charm", detail: "Doubles base odds — get this first" },
          { name: "Mass Outbreak", detail: "Concentrates 1 species — stack with sandwich" },
          { name: "30 minutes", detail: "Sandwich duration — plan your hunt window" },
        ],
      },
    ],
    faq: [
      {
        question: "Do I need 2x Herba Mystica of the same flavor?",
        answer: "Yes. To reach Sparkling Power Lv. 3 you need 2 Herba Mystica of the same flavor (e.g. 2x Sweet Herba). Mixing flavors won't reach Lv. 3.",
      },
      {
        question: "How long does the sandwich effect last?",
        answer: "30 minutes after eating. The timer is visible in the Picnic menu. Plan your hunt around this window.",
      },
      {
        question: "Which is the best Herba for general Shiny hunting?",
        answer: "It depends on the Pokémon type you're hunting. Each type needs a specific ingredient + Herba combination. Use the PokéTrainer SV Sandwich Builder to find the right recipe.",
      },
      {
        question: "Can I use a sandwich during a Mass Outbreak?",
        answer: "Yes, and it's the most efficient combination. Trigger a Mass Outbreak and eat a sandwich with the matching type's Sparkling Power to maximize your odds.",
      },
    ],
    cta: {
      label: "Open Sandwich Builder — Shiny Hunt Mode",
      href: "/sandwich-builder?tab=shiny",
    },
    relatedLinks: [
      { label: "Best EV Training Spots in SV", href: "/best-ev-training-spots-sv" },
      { label: "Best Tera Raid Builds", href: "/best-tera-raid-builds" },
    ],
  },
};
