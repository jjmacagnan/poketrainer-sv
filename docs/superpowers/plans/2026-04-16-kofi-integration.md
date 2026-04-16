# Ko-fi Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Ko-fi donation link to the Footer social links and a subtle one-line CTA on the home page.

**Architecture:** Three surgical edits — add i18n keys to both locale files, add a social link `<a>` to the Footer Brand column, and add a single paragraph to the home page below the tool cards grid. No new files, no new components, no external scripts.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, custom i18n hook (`useI18n` + `t()`)

---

## File Map

| File | Change |
|------|--------|
| `src/i18n/pt.json` | Add `"kofi"` top-level key with `"cta"` string |
| `src/i18n/en.json` | Add `"kofi"` top-level key with `"cta"` string |
| `src/components/ui/Footer.tsx` | Add Ko-fi `<a>` after Discord link in Brand column |
| `src/app/page.tsx` | Add Ko-fi CTA paragraph after the tool cards grid |

---

### Task 1: Add i18n keys

**Files:**
- Modify: `src/i18n/pt.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Add Portuguese key**

In `src/i18n/pt.json`, add after the closing `}` of the `"footer"` block (after line 252), before `"feedback"`:

```json
  "kofi": {
    "cta": "☕ Se as ferramentas te ajudam, considere apoiar no Ko-fi →"
  },
```

The result around that area should look like:
```json
    "feedback": "Feedback"
  },
  "kofi": {
    "cta": "☕ Se as ferramentas te ajudam, considere apoiar no Ko-fi →"
  },
  "feedback": {
```

- [ ] **Step 2: Add English key**

In `src/i18n/en.json`, add the same block in the same position (after `"footer"` closes, before `"feedback"`):

```json
  "kofi": {
    "cta": "☕ If these tools help you, consider supporting on Ko-fi →"
  },
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/pt.json src/i18n/en.json
git commit -m "feat: add kofi i18n keys (pt/en)"
```

---

### Task 2: Add Ko-fi link to Footer

**Files:**
- Modify: `src/components/ui/Footer.tsx`

- [ ] **Step 1: Add KofiIcon SVG function**

In `src/components/ui/Footer.tsx`, after the `DiscordIcon` function (around line 56), add:

```tsx
function KofiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 9.298-.09 10.358c-.2 5.927 3.908 6.212 3.908 6.212h6.005c2.418 0 2.525-2.117 2.525-2.117h1.116c4.519 0 6.281-2.535 6.614-5.319.197-1.64-.043-2.941-.043-2.941s.614.009 1.212-.256c1.983-.857 2.609-3.142 2.59-2.142zm-6.354 5.089c-.459 1.889-1.944 2.668-4.125 2.668H9.879v-4.586h3.523c3.053 0 4.598 1.058 4.125 1.918zm.978-2.674c-.36.685-1.103 1.012-2.109 1.073V9.77c1.254.076 2.285.489 2.285 1.117 0 .073-.03.154-.088.236-.177.254-.089.24-.088.24z"/>
    </svg>
  );
}
```

- [ ] **Step 2: Add Ko-fi anchor after Discord link**

In the same file, find the Discord `<a>` block (ends around line 121). Add immediately after its closing `</a>`:

```tsx
<a
  href="https://ko.fi/jjmacagnan"
  target="_blank"
  rel="noopener noreferrer"
  className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-yellow-500/30 hover:text-yellow-400"
>
  <KofiIcon />
  Ko-fi
</a>
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev` and open `http://localhost:3000`. Scroll to the footer — confirm a Ko-fi link appears below Discord in the Brand column. Hover to confirm yellow tint. Click to confirm it opens `https://ko.fi/jjmacagnan` in a new tab.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Footer.tsx
git commit -m "feat: add Ko-fi social link to footer"
```

---

### Task 3: Add Ko-fi CTA to home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add CTA paragraph after the tool cards grid**

In `src/app/page.tsx`, find the closing `</div>` of the tool cards grid (the `grid gap-3 sm:grid-cols-2` div, around line 116). Add immediately after it, before the closing `</div>` of the outer wrapper:

```tsx
{/* Ko-fi CTA */}
<p className="mt-10 text-center text-sm text-gray-500">
  <a
    href="https://ko.fi/jjmacagnan"
    target="_blank"
    rel="noopener noreferrer"
    className="text-yellow-400 underline hover:text-yellow-300"
  >
    {t("kofi.cta")}
  </a>
</p>
```

- [ ] **Step 2: Verify in browser**

With the dev server still running, open `http://localhost:3000`. Confirm the CTA text appears below the tool cards. Switch locale to EN (top-right toggle) and confirm the English string appears. Click to confirm it opens Ko-fi in a new tab.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add Ko-fi CTA to home page"
```

---

## Done

All three tasks complete. The Ko-fi link is live in the footer and a subtle CTA appears on the home page for both PT and EN locales.
