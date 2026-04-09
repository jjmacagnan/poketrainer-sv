import Link from "next/link";

const TOOLS = [
  {
    href: "/sandwich-builder",
    emoji: "🥪",
    title: "Sandwich Builder",
    desc: "Receitas para Shiny Hunt com Sparkling Power Lv.3 e Encounter Power",
    gradient: "from-yellow-500/20 to-orange-500/20",
    border: "hover:border-yellow-500/40",
    ready: true,
  },
  {
    href: "/ev-pokedex",
    emoji: "📖",
    title: "EV Yield Pokédex",
    desc: "Lista pesquisável de todos os Pokémon com EV yields e localizações",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/40",
    ready: false,
  },
  {
    href: "/ev-tracker",
    emoji: "📊",
    title: "EV Training Tracker",
    desc: "Rastreie o progresso de EV training do seu time com Pokérus e Power Items",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/40",
    ready: false,
  },
  {
    href: "/raid-builder",
    emoji: "⚔️",
    title: "Tera Raid Build Maker",
    desc: "Monte e compartilhe builds otimizadas para Tera Raids 5★/6★/7★",
    gradient: "from-purple-500/20 to-violet-500/20",
    border: "hover:border-purple-500/40",
    ready: false,
  },
  {
    href: "/nature-calc",
    emoji: "🧮",
    title: "Nature Calculator",
    desc: "Calculadora de natures, stats e sugestão de Mints por role",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "hover:border-pink-500/40",
    ready: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1
          className="mb-3 text-4xl font-black tracking-tight sm:text-5xl"
          style={{
            background: "linear-gradient(135deg, #FFD700, #FF6B6B, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PokéTrainer SV
        </h1>
        <p className="text-lg text-gray-400">
          Ferramentas práticas para Pokémon Scarlet & Violet
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative rounded-2xl border border-white/10 bg-gradient-to-br ${tool.gradient} p-6 transition-all duration-200 hover:-translate-y-1 ${tool.border} ${
              !tool.ready ? "opacity-60" : ""
            }`}
          >
            <div className="mb-3 text-4xl">{tool.emoji}</div>
            <h2 className="mb-1 text-lg font-bold text-gray-100">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-400">{tool.desc}</p>
            {!tool.ready && (
              <span className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Em breve
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
