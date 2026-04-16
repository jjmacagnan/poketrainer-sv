"use client";

import { GithubLink, LegalPageTemplate, type LegalMeta, type LegalSection } from "@/components/legal/LegalPageTemplate";
import { type Locale } from "@/i18n";

const meta: LegalMeta = {
  pt: { title: "Termos de Uso", updated: "Última atualização: abril de 2025" },
  en: { title: "Terms of Use", updated: "Last updated: April 2025" },
};

function getSections(locale: Locale): LegalSection[] {
  if (locale === "en") {
    return [
      {
        title: "1. Free Service",
        body: (
          <p className="leading-relaxed">
            PokéTrainer SV is a free set of tools for Pokémon Scarlet &amp; Violet players. Access
            is open and requires no account. We reserve the right to change, suspend, or discontinue
            any feature at any time without prior notice.
          </p>
        ),
      },
      {
        title: "2. Acceptable Use",
        body: (
          <p className="leading-relaxed">
            By using this site, you agree not to attempt to overload, circumvent, or exploit any
            part of the platform through automation, bots, or bulk requests. Use must be personal
            and non-commercial. Activities that harm service availability for other users may result
            in access being blocked.
          </p>
        ),
      },
      {
        title: "3. Data Storage",
        body: (
          <p className="leading-relaxed">
            No user account is created. Preferences and progress (such as EV training data) are
            stored exclusively in your device&apos;s <em>localStorage</em>. This data is never sent
            to any external server and is your responsibility. Clearing your browser&apos;s storage
            permanently deletes this data.
          </p>
        ),
      },
      {
        title: "4. Accuracy of Information",
        body: (
          <p className="leading-relaxed">
            The tools and data provided are based on verified community sources (PokéAPI, Serebii,
            Bulbapedia, and Smogon). Despite careful curation, we do not guarantee absolute
            accuracy of any information. Use data as a reference and confirm critical details from
            official sources.
          </p>
        ),
      },
      {
        title: "5. Limitation of Liability",
        body: (
          <p className="leading-relaxed">
            The service is provided &quot;as is&quot;, without warranties of any kind. We are not
            responsible for any data loss, in-game decisions based on the tools, or any other
            direct or indirect damage arising from use of this site.
          </p>
        ),
      },
      {
        title: "6. Changes to Terms",
        body: (
          <p className="leading-relaxed">
            These terms may be updated at any time. The revision date at the top of the page
            indicates the current version. Continued use of the site after changes implies
            acceptance of the new terms.
          </p>
        ),
      },
      {
        title: "7. Contact",
        body: (
          <p className="leading-relaxed">
            Questions or requests related to these terms may be submitted via <GithubLink />.
          </p>
        ),
      },
    ];
  }

  return [
    {
      title: "1. Serviço Gratuito",
      body: (
        <p className="leading-relaxed">
          O PokéTrainer SV é um conjunto de ferramentas gratuitas voltadas a jogadores de Pokémon
          Scarlet &amp; Violet. O acesso é livre e não requer criação de conta. Reservamo-nos o
          direito de alterar, suspender ou encerrar qualquer funcionalidade a qualquer momento,
          sem aviso prévio.
        </p>
      ),
    },
    {
      title: "2. Uso Aceitável",
      body: (
        <p className="leading-relaxed">
          Ao utilizar este site, você concorda em não tentar sobrecarregar, contornar ou explorar
          qualquer parte da plataforma por meio de automação, bots ou requisições em massa. O uso
          deve ser pessoal e não comercial. Atividades que prejudiquem a disponibilidade do serviço
          para outros usuários poderão resultar no bloqueio de acesso.
        </p>
      ),
    },
    {
      title: "3. Armazenamento de Dados",
      body: (
        <p className="leading-relaxed">
          Nenhuma conta de usuário é criada. Preferências e progressos (como EVs em treinamento)
          são armazenados exclusivamente no <em>localStorage</em> do seu próprio dispositivo.
          Esses dados não são enviados a nenhum servidor externo e são de sua responsabilidade.
          A limpeza do armazenamento do navegador apaga esses dados permanentemente.
        </p>
      ),
    },
    {
      title: "4. Precisão das Informações",
      body: (
        <p className="leading-relaxed">
          As ferramentas e dados disponibilizados são baseados em fontes comunitárias verificadas
          (PokéAPI, Serebii, Bulbapedia e Smogon). Apesar do cuidado na curadoria, não garantimos
          a exatidão absoluta de nenhuma informação. Utilize os dados como referência e confirme
          detalhes críticos em fontes oficiais.
        </p>
      ),
    },
    {
      title: "5. Limitação de Responsabilidade",
      body: (
        <p className="leading-relaxed">
          O serviço é fornecido &quot;no estado em que se encontra&quot;, sem garantias de qualquer
          natureza. Não nos responsabilizamos por eventuais perdas de dados, decisões de jogo
          baseadas nas ferramentas ou qualquer outro dano direto ou indireto decorrente do uso
          deste site.
        </p>
      ),
    },
    {
      title: "6. Alterações nos Termos",
      body: (
        <p className="leading-relaxed">
          Estes termos podem ser atualizados a qualquer momento. A data de revisão no topo da
          página indica a versão vigente. O uso continuado do site após alterações implica
          aceitação dos novos termos.
        </p>
      ),
    },
    {
      title: "7. Contato",
      body: (
        <p className="leading-relaxed">
          Dúvidas ou solicitações relacionadas a estes termos podem ser enviadas via <GithubLink />.
        </p>
      ),
    },
  ];
}

export default function TermosPage() {
  return <LegalPageTemplate meta={meta} getSections={getSections} />;
}
