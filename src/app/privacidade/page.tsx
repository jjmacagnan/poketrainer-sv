"use client";

import { useI18n, type Locale } from "@/i18n";

const GITHUB_ISSUES = "https://github.com/jjmacagnan/poketrainer-sv/issues";

function GithubLink() {
  return (
    <a
      href={GITHUB_ISSUES}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline hover:text-blue-300"
    >
      GitHub Issues
    </a>
  );
}

type Section = { title: string; body: React.ReactNode };

function getSections(locale: Locale): Section[] {
  if (locale === "en") {
    return [
      {
        title: "1. Data Collected",
        body: (
          <p className="leading-relaxed">
            PokéTrainer SV does not require registration and does not collect personally
            identifiable information. We use{" "}
            <strong className="text-white">Vercel Analytics</strong> to collect anonymous usage
            metrics — such as pages visited, country of origin, and device type — in order to
            improve the site experience. No data is linked to individual identities.
          </p>
        ),
      },
      {
        title: "2. Local Storage",
        body: (
          <p className="leading-relaxed">
            Some tools (such as the EV Tracker) use the browser&apos;s <em>localStorage</em> to
            save your progress locally. This data stays on your device and is never transmitted to
            external servers. You can delete it at any time by clearing the site data in your
            browser settings.
          </p>
        ),
      },
      {
        title: "3. Cookies",
        body: (
          <p className="leading-relaxed">
            We use only strictly necessary technical cookies for site functionality (such as
            language preference). We do not use tracking cookies for advertising or remarketing
            purposes.
          </p>
        ),
      },
      {
        title: "4. Third-Party Services",
        body: (
          <>
            <p className="mb-2 leading-relaxed">
              The site uses the following external services, each with its own privacy policy:
            </p>
            <ul className="ml-4 flex list-disc flex-col gap-1.5 text-sm">
              <li>
                <strong className="text-white">Vercel</strong> — hosting and anonymous analytics
              </li>
              <li>
                <strong className="text-white">PokéAPI / GitHub</strong> — Pokémon sprites and data
                loaded from public servers
              </li>
              <li>
                <strong className="text-white">Google Fonts</strong> — loading the Outfit typeface
              </li>
            </ul>
            <p className="mt-3 leading-relaxed">
              We do not sell, rent, or share your data with any third party for commercial purposes.
            </p>
          </>
        ),
      },
      {
        title: "5. Minors",
        body: (
          <p className="leading-relaxed">
            This site is intended for a general audience. We do not intentionally collect data from
            children under 13. Since no registration is required, no personal data is collected from
            any user.
          </p>
        ),
      },
      {
        title: "6. Changes to this Policy",
        body: (
          <p className="leading-relaxed">
            This policy may be updated periodically. We recommend revisiting it occasionally. The
            date at the top indicates the version in effect.
          </p>
        ),
      },
      {
        title: "7. Contact",
        body: (
          <p className="leading-relaxed">
            For privacy-related questions, please contact us via <GithubLink />.
          </p>
        ),
      },
    ];
  }

  return [
    {
      title: "1. Dados Coletados",
      body: (
        <p className="leading-relaxed">
          O PokéTrainer SV não exige cadastro nem coleta informações pessoais identificáveis.
          Utilizamos o{" "}
          <strong className="text-white">Vercel Analytics</strong> para coletar métricas anônimas
          de uso — como páginas visitadas, país de origem e tipo de dispositivo — com o objetivo de
          melhorar a experiência do site. Nenhum dado é vinculado a identidades individuais.
        </p>
      ),
    },
    {
      title: "2. Armazenamento Local",
      body: (
        <p className="leading-relaxed">
          Algumas ferramentas (como o EV Tracker) utilizam o <em>localStorage</em> do navegador
          para salvar seu progresso localmente. Esses dados permanecem no seu dispositivo e nunca
          são transmitidos a servidores externos. Você pode apagá-los a qualquer momento limpando
          os dados do site no seu navegador.
        </p>
      ),
    },
    {
      title: "3. Cookies",
      body: (
        <p className="leading-relaxed">
          Utilizamos apenas cookies técnicos estritamente necessários para o funcionamento do site
          (como preferência de idioma). Não utilizamos cookies de rastreamento para fins
          publicitários ou de remarketing.
        </p>
      ),
    },
    {
      title: "4. Serviços de Terceiros",
      body: (
        <>
          <p className="mb-2 leading-relaxed">
            O site faz uso dos seguintes serviços externos, cada qual com sua própria política de
            privacidade:
          </p>
          <ul className="ml-4 flex list-disc flex-col gap-1.5 text-sm">
            <li>
              <strong className="text-white">Vercel</strong> — hospedagem e analytics anônimo
            </li>
            <li>
              <strong className="text-white">PokéAPI / GitHub</strong> — sprites e dados de Pokémon
              carregados de servidores públicos
            </li>
            <li>
              <strong className="text-white">Google Fonts</strong> — carregamento da fonte Outfit
            </li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Não vendemos, alugamos nem compartilhamos seus dados com nenhum terceiro para fins
            comerciais.
          </p>
        </>
      ),
    },
    {
      title: "5. Menores de Idade",
      body: (
        <p className="leading-relaxed">
          Este site é destinado ao público geral. Não coletamos intencionalmente dados de crianças
          menores de 13 anos. Por não exigirmos cadastro, nenhum dado pessoal é coletado de nenhum
          usuário.
        </p>
      ),
    },
    {
      title: "6. Alterações nesta Política",
      body: (
        <p className="leading-relaxed">
          Esta política pode ser atualizada periodicamente. Recomendamos revisitá-la
          ocasionalmente. A data no topo indica a versão em vigor.
        </p>
      ),
    },
    {
      title: "7. Contato",
      body: (
        <p className="leading-relaxed">
          Para questões relacionadas à privacidade, entre em contato via <GithubLink />.
        </p>
      ),
    },
  ];
}

const meta = {
  pt: { title: "Política de Privacidade", updated: "Última atualização: abril de 2025" },
  en: { title: "Privacy Policy", updated: "Last updated: April 2025" },
};

export default function PrivacidadePage() {
  const { locale } = useI18n();
  const { title, updated } = meta[locale];
  const sections = getSections(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-black text-white">{title}</h1>
      <p className="mb-10 text-sm text-gray-500">{updated}</p>
      <div className="flex flex-col gap-8 text-gray-300">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 text-lg font-bold text-white">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
}
