# Contribuindo com o PokéTrainer SV

> [🇺🇸 English version](CONTRIBUTING.en.md)

Obrigado pelo interesse em contribuir! Este projeto é mantido pela comunidade e toda ajuda é bem-vinda — desde correções de dados até novas funcionalidades.

**Antes de abrir um PR, sempre abra uma issue primeiro** para alinharmos a solução.

---

## Pré-requisitos

- Node.js 18+
- npm
- Conta no GitHub com fork do repositório

```bash
git clone https://github.com/<seu-usuario>/poketrainer-sv.git
cd poketrainer-sv
npm install
npm run dev
```

---

## Tipos de Contribuição

### 🐛 Bug Fix
1. Abra uma issue descrevendo o comportamento atual vs. esperado
2. Inclua passos para reproduzir e, se possível, screenshot
3. Aguarde confirmação antes de submeter o PR

### ✨ Nova Feature ou Módulo
1. Abra uma issue com a proposta detalhada
2. Aguarde discussão e aprovação do mantenedor
3. Só então implemente e abra o PR

### 📦 Dados (Pokémon, receitas, raids, moves)
1. Abra uma issue com a correção ou adição proposta
2. **Cite a fonte** dos dados: PokéAPI, Serebii, Bulbapedia ou verificação in-game
3. Dados sem fonte não serão aceitos

### 🌐 Traduções
1. Abra uma issue indicando o idioma e o escopo da tradução
2. Siga o padrão de arquivos existentes em `src/i18n/`

### 💅 UI/UX
1. Abra uma issue com descrição e, se possível, mockup ou referência visual
2. Respeite o design system definido em `CLAUDE.md` (dark mode, Tailwind, fonte Outfit)

---

## Fluxo de Trabalho

```
fork → branch → commits → PR → review → merge
```

1. Faça fork do repositório
2. Crie uma branch a partir de `develop` (não de `main`)
3. Implemente sua contribuição
4. Abra o PR apontando para `develop`

---

## Convenções de Branch

| Prefixo | Uso |
|---------|-----|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `data/` | Adição ou correção de dados |
| `i18n/` | Traduções |
| `docs/` | Documentação |
| `refactor/` | Refatoração sem mudança de comportamento |

Exemplo: `feat/raid-boss-filter`, `data/add-dlc-pokemon`, `fix/ev-tracker-reset`

---

## Conventional Commits

Use o formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição curta em inglês>
```

**Tipos válidos:** `feat`, `fix`, `data`, `i18n`, `docs`, `refactor`, `style`, `test`, `chore`

**Exemplos:**
```
feat(raid): add boss selector with tera type filter
fix(ev-tracker): reset button not clearing localStorage
data(ev): add Kitakami DLC pokemon yields
i18n(sandwich): add english translations for recipe cards
docs: update contributing guidelines
```

---

## Checklist do PR

Antes de submeter, confirme:

- [ ] `npm run lint` passa sem erros
- [ ] Sem uso de `any` no TypeScript
- [ ] Dados novos incluem fonte citada no PR
- [ ] Componentes seguem o design system (dark mode, Tailwind, sem CSS modules)
- [ ] A branch aponta para `develop`, não para `main`

---

## Código de Conduta

Este projeto adota o [Contributor Covenant](CODE_OF_CONDUCT.md). Ao contribuir, você concorda em seguir suas diretrizes.

---

Dúvidas? Abra uma issue ou entre em contato via [GitHub Discussions](https://github.com/jjmacagnan/poketrainer-sv/discussions).
