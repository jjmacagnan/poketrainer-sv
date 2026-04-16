"use client";

import { GithubLink, LegalPageTemplate, type LegalMeta, type LegalSection } from "@/components/legal/LegalPageTemplate";
import { type Locale } from "@/i18n";

const meta: LegalMeta = {
  pt: { title: "Aviso Legal", updated: "Última atualização: abril de 2025" },
  en: { title: "Legal Notice", updated: "Last updated: April 2025" },
};

function getSections(locale: Locale): LegalSection[] {
  if (locale === "en") {
    return [
      {
        title: "Fan Project",
        body: (
          <p className="leading-relaxed">
            PokéTrainer SV is an independent project created by fans for fans. It has no
            affiliation, sponsorship, approval, or endorsement from{" "}
            <strong className="text-white">Nintendo</strong>,{" "}
            <strong className="text-white">Game Freak</strong>, or{" "}
            <strong className="text-white">The Pokémon Company</strong>.
          </p>
        ),
      },
      {
        title: "Intellectual Property",
        body: (
          <p className="leading-relaxed">
            Pokémon, Pokémon Scarlet, Pokémon Violet, and all related names, characters, mechanics,
            and elements are intellectual property of Nintendo / Creatures Inc. / Game Freak. The
            use of these elements on this site is informational and educational in nature,
            non-profit, and supported by <em>fair use</em> principles. No original game content is
            reproduced or distributed here.
          </p>
        ),
      },
      {
        title: "No Warranty",
        body: (
          <p className="leading-relaxed">
            The information available on this site — including Pokémon data, sandwich recipes, raid
            builds, and stat calculations — is provided &quot;as is&quot;, without guarantee of
            completeness or accuracy. We do our best to keep data up to date, but errors may occur,
            especially after game updates. Use the information as a reference and confirm anything
            critical from official sources.
          </p>
        ),
      },
      {
        title: "Service Availability",
        body: (
          <p className="leading-relaxed">
            We do not guarantee uninterrupted availability of the site. Maintenance, updates, or
            infrastructure issues may cause temporary outages without prior notice.
          </p>
        ),
      },
      {
        title: "Content Removal (DMCA)",
        body: (
          <>
            <p className="mb-3 leading-relaxed">
              If you are a rights holder and believe that any content on this site infringes your
              copyright, please contact us via <GithubLink /> providing:
            </p>
            <ul className="ml-4 flex list-disc flex-col gap-1.5 text-sm">
              <li>Identification of the protected work allegedly infringed</li>
              <li>Exact location of the content on the site</li>
              <li>Your contact information</li>
              <li>A good-faith statement that the use is not authorized by the rights holder</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              We will review all notifications seriously and act promptly to resolve legitimate
              disputes.
            </p>
          </>
        ),
      },
      {
        title: "External Links",
        body: (
          <p className="leading-relaxed">
            This site may contain links to external resources (PokéAPI, Serebii, Smogon, etc.). We
            are not responsible for the content, availability, or privacy policies of those
            third-party sites.
          </p>
        ),
      },
    ];
  }

  return [
    {
      title: "Projeto de Fãs / Fan Project",
      body: (
        <p className="leading-relaxed">
          O PokéTrainer SV é um projeto independente criado por fãs para fãs. Não possui qualquer
          afiliação, patrocínio, aprovação ou endosso da{" "}
          <strong className="text-white">Nintendo</strong>,{" "}
          <strong className="text-white">Game Freak</strong> ou{" "}
          <strong className="text-white">The Pokémon Company</strong>.
        </p>
      ),
    },
    {
      title: "Propriedade Intelectual",
      body: (
        <p className="leading-relaxed">
          Pokémon, Pokémon Scarlet, Pokémon Violet e todos os nomes, personagens, mecânicas e
          elementos relacionados são propriedade intelectual da Nintendo / Creatures Inc. / Game
          Freak. O uso desses elementos neste site tem caráter informativo e educacional, sem fins
          lucrativos, amparado pelos princípios de uso justo (<em>fair use</em>). Nenhum conteúdo
          original dos jogos é reproduzido ou distribuído aqui.
        </p>
      ),
    },
    {
      title: "Isenção de Garantia",
      body: (
        <p className="leading-relaxed">
          As informações disponibilizadas neste site — incluindo dados de Pokémon, receitas de
          sanduíche, builds de raid e cálculos de stats — são fornecidas &quot;no estado em que se
          encontram&quot;, sem garantia de completude ou exatidão. Fazemos nosso melhor para manter
          os dados atualizados, mas erros podem ocorrer, especialmente após atualizações dos jogos.
          Use as informações como referência e confirme o que for crítico em fontes oficiais.
        </p>
      ),
    },
    {
      title: "Disponibilidade do Serviço",
      body: (
        <p className="leading-relaxed">
          Não garantimos disponibilidade ininterrupta do site. Manutenções, atualizações ou
          problemas de infraestrutura podem causar interrupções temporárias sem aviso prévio.
        </p>
      ),
    },
    {
      title: "Remoção de Conteúdo (DMCA)",
      body: (
        <>
          <p className="mb-3 leading-relaxed">
            Se você é titular de direitos e acredita que algum conteúdo deste site infringe seus
            direitos autorais, entre em contato via <GithubLink /> informando:
          </p>
          <ul className="ml-4 flex list-disc flex-col gap-1.5 text-sm">
            <li>Identificação do conteúdo protegido que teria sido infringido</li>
            <li>Localização exata do conteúdo no site</li>
            <li>Suas informações de contato</li>
            <li>Declaração de boa-fé de que o uso não é autorizado pelo titular</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Analisaremos toda notificação com seriedade e agiremos prontamente para resolver
            eventuais disputas legítimas.
          </p>
        </>
      ),
    },
    {
      title: "Links Externos",
      body: (
        <p className="leading-relaxed">
          Este site pode conter links para recursos externos (PokéAPI, Serebii, Smogon etc.). Não
          nos responsabilizamos pelo conteúdo, disponibilidade ou políticas de privacidade desses
          sites de terceiros.
        </p>
      ),
    },
  ];
}

export default function AvisoLegalPage() {
  return <LegalPageTemplate meta={meta} getSections={getSections} />;
}
