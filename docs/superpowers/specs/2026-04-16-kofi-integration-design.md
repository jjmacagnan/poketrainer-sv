# Ko-fi Integration Design

**Date:** 2026-04-16  
**Status:** Approved

## Goal

Add a Ko-fi donation link to the site — footer social links and a subtle CTA on the home page — without external scripts or new dependencies.

## Ko-fi URL

`https://ko.fi/jjmacagnan`

## Changes

### 1. Footer (`src/components/ui/Footer.tsx`)

Add a 4th social link in the Brand column, below the Discord link. Follows the exact same pattern as existing social links:

- Container: `flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors`
- Hover: `hover:border-yellow-500/30 hover:text-yellow-400`
- Icon: Ko-fi cup SVG inline (no external dependency)
- Label: `Ko-fi`
- Link: `https://ko.fi/jjmacagnan`, `target="_blank" rel="noopener noreferrer"`

### 2. Home page (`src/app/page.tsx`)

Add a single line of text at the bottom of `<main>`, before closing tag:

- Style: `text-sm text-gray-500 text-center py-6`
- Content: i18n key `kofi.cta` (PT/EN)
- The Ko-fi link within the text: `text-yellow-400 hover:text-yellow-300 underline`

### 3. i18n (`src/i18n/pt.json` and `src/i18n/en.json`)

Add one key to each file:

```json
"kofi": {
  "cta": "☕ Se as ferramentas te ajudam, considere apoiar no Ko-fi →"
}
```

```json
"kofi": {
  "cta": "☕ If these tools help you, consider supporting on Ko-fi →"
}
```

## Out of scope

- No Ko-fi widget embed (avoids third-party script)
- No floating button
- No new component file (inline is sufficient for this scope)
- No Patreon or recurring payment integration
