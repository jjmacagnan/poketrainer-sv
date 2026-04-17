# Contributing to PokéTrainer SV

> [🇧🇷 Versão em Português](CONTRIBUTING.md)

Thank you for your interest in contributing! This is a community-maintained project and all help is welcome — from data corrections to new features.

**Always open an issue before submitting a PR** so we can align on the solution first.

---

## Prerequisites

- Node.js 18+
- npm
- GitHub account with a fork of the repository

```bash
git clone https://github.com/<your-username>/poketrainer-sv.git
cd poketrainer-sv
npm install
npm run dev
```

---

## Types of Contribution

### 🐛 Bug Fix
1. Open an issue describing the current vs. expected behavior
2. Include reproduction steps and a screenshot if possible
3. Wait for confirmation before submitting the PR

### ✨ New Feature or Module
1. Open an issue with a detailed proposal
2. Wait for discussion and maintainer approval
3. Only then implement and open the PR

### 📦 Data (Pokémon, recipes, raids, moves)
1. Open an issue with the proposed correction or addition
2. **Cite the source** of the data: PokéAPI, Serebii, Bulbapedia, or in-game verification
3. Data without a cited source will not be accepted

### 🌐 Translations
1. Open an issue indicating the language and scope of the translation
2. Follow the existing file patterns in `src/i18n/`

### 💅 UI/UX
1. Open an issue with a description and, if possible, a mockup or visual reference
2. Respect the design system defined in `CLAUDE.md` (dark mode only, Tailwind, Outfit font)

---

## Workflow

```
fork → branch → commits → PR → review → merge
```

1. Fork the repository
2. Create a branch from `develop` (not from `main`)
3. Implement your contribution
4. Open the PR targeting `develop`

---

## Branch Naming

| Prefix | Use |
|--------|-----|
| `feat/` | New functionality |
| `fix/` | Bug fix |
| `data/` | Data addition or correction |
| `i18n/` | Translations |
| `docs/` | Documentation |
| `refactor/` | Refactor without behavior change |

Examples: `feat/raid-boss-filter`, `data/add-dlc-pokemon`, `fix/ev-tracker-reset`

---

## Conventional Commits

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>
```

**Valid types:** `feat`, `fix`, `data`, `i18n`, `docs`, `refactor`, `style`, `test`, `chore`

**Examples:**
```
feat(raid): add boss selector with tera type filter
fix(ev-tracker): reset button not clearing localStorage
data(ev): add Kitakami DLC pokemon yields
i18n(sandwich): add english translations for recipe cards
docs: update contributing guidelines
```

---

## PR Checklist

Before submitting, confirm:

- [ ] `npm run lint` passes without errors
- [ ] No use of `any` in TypeScript
- [ ] New data includes a cited source in the PR description
- [ ] Components follow the design system (dark mode, Tailwind, no CSS modules)
- [ ] Branch targets `develop`, not `main`

---

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By contributing, you agree to abide by its terms.

---

Questions? Open an issue or reach out via [GitHub Discussions](https://github.com/jjmacagnan/poketrainer-sv/discussions).
