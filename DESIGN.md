# DESIGN.md — Portfolio Site

**Status:** Draft v0.6 — revised after goldfish round 2.
**Owner:** the site's author (referred to as "the author").

This document is the single source of truth for the project. It is written to be read with no other context.

---

## 1. Purpose

A personal portfolio site for **job hunting**. The primary audience is **employers and recruiters** who will skim it, typically in under a minute, often from a link in an application or LinkedIn message.

The site must answer, quickly:
1. Who is this and what role do they want?
2. What have they built, and what did they personally do?
3. How do I get their résumé and contact them?

**Rationale:** recruiters skim. Every design choice below favours fast comprehension over novelty. Anything essential (name, role, contact) is static text, never only inside an animation.

## 2. Scope

### In scope (v1)
- A single scrolling page with a fixed header linking to each section.
- Sections: Hero, Projects, GitHub Activity, Contact, Footer.
- A variable number of project cards, each expandable in place to show details.
- A GitHub contribution calendar for user `remyj4556`, refreshed daily.
- A résumé PDF, opened in a new browser tab.
- Privacy-friendly page-view analytics (Vercel Web Analytics).
- A themed static 404 page.
- Placeholder content everywhere except the GitHub username, domain, and repo URL; the author replaces it before launch (see §9).

### Out of scope (v1)
- Separate About section (the hero intro covers it), blog, multiple pages/routing, contact form, CMS, light theme, internationalisation, prerendering/SSR, sitemap, tests beyond typecheck/lint/build, custom analytics events (page views only).

**Rationale:** the author wants this done quickly and efficiently. A contact form needs a backend; plain links suffice.

## 3. Visual direction

**Theme:** "tech-y", loosely inspired by *The Matrix* — dark, terminal-flavoured, green accent. Inspiration, not imitation.

**Principle: restraint.** The look comes from a monospace typeface, a single accent colour, crisp 1px borders, and flat surfaces — not from effects.

### 3.1 Hard exclusions
These are explicitly rejected by the author and must not appear anywhere:
- **No glow.** No `text-shadow` or `box-shadow` used to create glow/neon effects, on text, buttons, borders, focus rings, or the matrix rain. No blur-based halos.
- **No gradients** on backgrounds or text. All surfaces are solid colours. (This includes "ambient" radial colour blobs behind content.)
- **No skills bubbles/pills that scroll, float, or marquee**, and no standalone "Skills" section. Tech tags on project cards are static and are not a skills section.

**Rationale:** the author considers these hallmarks of generic, AI-generated front-ends.

### 3.2 Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0e0a` | Page background (solid) |
| `--surface` | `#0f1a12` | Header bar, cards, browser-frame bar, mobile menu panel (solid) |
| `--border` | `#1f3326` | Decorative 1px borders: header bar, cards, frames (~1.5:1 on `--bg`; decorative only) |
| `--border-strong` | `#4a7058` | Borders that must read clearly: tech tags, menu button, card hover (≥3:1 on `--bg`) |
| `--text` | `#d4e4d8` | Primary text |
| `--text-muted` | `#8aa394` | Secondary text, nav links at rest |
| `--accent` | `#00ff41` | Typed phrase, hero label, cursor, link hover, focus rings, Résumé button, text selection |
| `--cal-0` … `--cal-4` | `#243a2c`, `#0b4d1c`, `#087a26`, `#00b82e`, `#00ff41` | Contribution calendar levels 0 (none) → 4 (most) |

- All text/background pairs must meet WCAG AA contrast (4.5:1 for body text).
- `--cal-0` is only faintly distinguishable from `--bg` (~1.6:1). That is accepted: empty days are decorative texture, and the legend and total carry the information.
- `:root` sets `color-scheme: dark` so native scrollbars and controls render dark.
- `::selection` uses `--accent` background with `--bg` text.

### 3.3 Typography
- **One typeface: JetBrains Mono**, weights **400 and 700 only**, Latin subset only, self-hosted as two `.woff2` files in `public/fonts/` with `@font-face` rules in the global stylesheet (`font-display: swap`). Both files are **preloaded** in `index.html` (`<link rel="preload" as="font" type="font/woff2" crossorigin>`) to minimise layout shift when the font swaps in.
  - Source: Fontsource's Latin-subset files — `https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2` and `…/latin-700-normal.woff2` — downloaded once and committed, with the font's OFL licence as `public/fonts/OFL.txt`.
  - The Latin subset lacks block-drawing and geometric-shape glyphs (e.g. `▌`, `■`), so **no UI element may rely on such characters**; the typed cursor and the calendar legend are drawn with CSS/SVG instead (§4.2.2, §4.4). `—`, `−`, `é`, and `©` are in the subset.
- Section headings styled as terminal prompts: `> projects`, `> activity`, `> contact`. The `>` is in `--accent` and wrapped in `aria-hidden="true"` so screen readers read only the word.

**Rationale:** the author liked an all-monospace reference. Monospace body text is slightly harder to read at length; mitigated by the size/line-height/line-length rules and by keeping copy short.

### 3.4 Type and spacing scale

| Token | Value | Used for |
|---|---|---|
| `--text-xs` | 12px | Tech tags, `displayUrl`, pause control, calendar labels/legend |
| `--text-sm` | 14px | Hero label, card summary, footer, "updated" note, nav links |
| `--text-base` | 16px | Body text (line-height 1.6, max ~70ch) |
| `--text-lg` | 20px | Card titles (`h3`, weight 700) |
| `--text-xl` | `clamp(1.5rem, 4vw, 2rem)` | Section headings (`h2`, weight 700) |
| Hero sizes | see §4.2 | Name, role, typed phrase |

| Token | Value |
|---|---|
| `--space-1` … `--space-8` | 4, 8, 12, 16, 24, 32, 48, 96 px |
| `--radius` | 8px — header bar, cards, browser frame, mobile menu panel |
| `--radius-sm` | 4px — tech tags, buttons |

- Section vertical padding: `--space-8` (96px) desktop, 64px mobile. Heading-to-content gap: `--space-6`.
- Card internal padding (below the frame): `--space-4`. Gap between card elements: `--space-3`.
- Tag padding: 2px `--space-2`; gap between tags: `--space-2`.
- Values not listed here are left to the coder's judgment, using the scale above.

### 3.5 Motion
Exactly two effects, both in the Hero:
1. **Matrix rain** (§4.2.1).
2. **Typed phrase** with a blinking block cursor (§4.2.2).

**Reduced motion:** when `prefers-reduced-motion: reduce` matches, neither effect runs — the rain is not rendered and the typed phrase shows the first phrase statically with a non-blinking cursor. The site listens for changes to this media query and applies them live, without reload.

**Pause control (WCAG 2.2.2):** both effects run longer than 5 seconds, so the Hero has a visible **pause/resume control** (§4.2.3) that stops both. This is required regardless of reduced-motion support.

Small hover/focus/expand transitions (≤200ms, colour/opacity/grid-row only) are allowed and not counted as "effects". Under reduced motion they are instant.

### 3.6 Layout & interaction states
- Max content width 1100px, centred, 16px side padding on mobile, 24px on desktop.
- Breakpoints: mobile `<768px`, desktop `≥768px`.
- No horizontal page scroll at 360px width (the contribution calendar scrolls within its own container).
- **Hover states:** text links → `--accent`; project card → border becomes `--border-strong`; nav links → `--text`. Tech tags are not interactive and have no hover state.

## 4. Page structure

### 4.1 Header
- **Floating bar**, `position: fixed`, 12px from the top and sides of the viewport, height `--header-h: 56px`, `--surface` background, 1px `--border`, `--radius`. Page content scrolling visibly through the 12px gaps around the bar is intended (it's what makes it "floating"). Being `fixed`, it takes no space in the layout; the Hero compensates (§4.2).
- **Logo** (left): an `<a href="#top">` showing `<FirstName />` — angle brackets and slash in `--text-muted` and `aria-hidden="true"`, name in `--accent`. The link has `aria-label="<name>, back to top"` (contains the visible first name).
- **Desktop nav** (right): links **Projects, Activity, Contact** (`--text-muted`, hover `--text`) as `<a href="#projects">` etc., then a **Résumé** link styled as an outlined button (1px `--accent` border, `--accent` text, `--radius-sm`), opening the PDF in a new tab.
- Section links smooth-scroll (instant under reduced motion). Every section has `scroll-margin-top: calc(var(--header-h) + 12px + 24px)` (24px of clearance below the bar).
- **Mobile (`<768px`)**: nav links and Résumé collapse behind a menu `<button>` (1px `--border-strong`, `--radius-sm`) with `aria-expanded` and `aria-controls`.
  - **Panel:** directly below the bar with an 8px gap, same width as the bar, `--surface`, 1px `--border`, `--radius`. Links stacked vertically, each at least 48px tall; Résumé last.
  - **Focus:** opening does not move focus; the panel follows the button in DOM order, so the next Tab enters it.
  - **Closes on:** link click; Escape (focus returns to the menu button); click outside the header; focus leaving the header (e.g. tabbing past the last link).
- No active-section highlighting in v1.

### 4.2 Hero
- `<section id="top">`, `min-height: 100svh`, `padding-top: calc(var(--header-h) + 12px)` so content is centred in the space below the bar. Matrix rain fills the whole section, including behind the header.
- DOM and visual order:
  1. **Pause control** (§4.2.3), positioned at the top-right of the content area, just below the header bar. First in DOM so keyboard users reach it before the moving content.
  2. Small label `Hi, my name is` in `--accent`, `--text-sm`.
  3. **Name** — the page's single `h1`, `--text`, `font-size: clamp(2.25rem, 9vw, 6rem)`, may wrap at spaces (`text-wrap: balance`), never overflows horizontally.
  4. **Role** — static text from `site.role`, `--text`, `clamp(1.25rem, 4vw, 2rem)`. Always visible, never animated.
  5. **Typed phrase** — `--accent`, `clamp(1rem, 3.5vw, 1.5rem)`, with cursor (§4.2.2).
  6. **Intro paragraph** — 2–3 sentences, `--text-muted`, centred.
  7. **Icon links** — GitHub and LinkedIn logos (inline SVG, 28px), `--text-muted`, hover `--text`, each with an accessible name ("GitHub", "LinkedIn").

#### 4.2.1 Matrix rain
- A `<canvas aria-hidden="true">` absolutely positioned behind the hero content, filling the hero.
- **Colours:** read `--bg` and `--accent` once on init via `getComputedStyle(document.documentElement)` (canvas can't use CSS variables).
- **Characters:** ASCII only — `0-9`, `A-Z`, and `<>/{}[]=+*` — drawn in JetBrains Mono. Starts after `document.fonts.ready`.
- **Grid:** 16px font size; column width 16px; one stream per column. Initially each stream's head is at a random row in `[-rows, 0]` so the rain fades in rather than starting as a wall.
- **Animation:** each stream advances one row per tick; each column gets a random tick interval between 50ms and 120ms. Trail effect: each frame, the canvas is filled with `--bg` at 10% opacity before new characters are drawn (no blur, no shadow). Because fading is per frame and drawing is per column tick, trail length depends on frame rate — intended.
- **Stream restart:** when a stream's head passes the bottom, it waits a random 1.5–4s (long enough for its trail to fade), then that column's strip is **hard-cleared** with solid `--bg` (removing 8-bit rounding ghosts) and the stream restarts at the top.
- **Look:** characters in `--accent`; the canvas element has CSS `opacity: 0.15`.
- **Rendering:** capped at 30 fps via `requestAnimationFrame`; canvas backing store scaled by `devicePixelRatio`.
- **Resize:** a `ResizeObserver` on the hero. If the **column count changes**, reinitialise streams. If only the height changes (e.g. mobile address bar showing/hiding), resize the backing store and keep existing stream state.
- **Stops** when: the hero is not intersecting the viewport (IntersectionObserver), the tab is hidden (`visibilitychange`), the pause control is active, or reduced motion is on. **On resume** from any of these, streams continue from their current state (no restart).

#### 4.2.2 Typed phrase
- Source: `site.typedPhrases` (≥1 phrase, enforced by type — §5.2).
- **Initial state:** the first phrase is shown in full on load.
- **Loop:** hold 2s → delete (35ms/char) → pause 0.5s → type the next phrase (70ms/char), wrapping to the first after the last → repeat. With one phrase, it deletes and retypes that phrase.
- **Cursor:** a CSS-drawn block (an `inline-block` element, `width: 0.6em`, `height: 1em`, `--accent` background, vertically aligned with the text baseline) — not a text glyph. Blinks at a 1s period while the loop runs; solid when paused or under reduced motion.
- **Stable height:** all phrases are rendered stacked in the same CSS grid cell (`grid-area: 1/1`), invisible (`visibility: hidden`) except the animated one, so the container's height is always that of the tallest phrase at the current width. No JS measurement.
- **Screen readers:** the animated element and the invisible sizers are `aria-hidden="true"`. A visually-hidden element contains all phrases as plain text, separated by periods.
- **Pause/resume semantics:**
  - Pausing completes the current phrase instantly and stops.
  - Resuming starts a fresh 2s hold on that phrase, then continues the loop.
  - Reduced motion turning **on** behaves like pause, but displays the first phrase. Turning **off** resumes from the displayed phrase with a 2s hold — unless the user had pressed pause, in which case it stays paused. The pause state persists across reduced-motion changes within the page load.

#### 4.2.3 Pause control
- A `<button>` reading `[ pause motion ]` / `[ resume motion ]`, `--text-muted`, `--text-xs`, with `aria-pressed`.
- When pressed: the rain freezes on its current frame; the typed phrase behaves per §4.2.2; the cursor stops blinking.
- State is per page load (not persisted).
- Hidden while reduced motion is on (nothing is moving).

### 4.3 Projects
- `<section id="projects">`, heading `> projects`.
- Grid of cards: **1 column on mobile, 2 on desktop**, `align-items: start` so expanding one card does not stretch its row neighbour. Gap `--space-5`.
- Card count = whatever the content file contains; must work for any count from 1 to ~12. Order follows the content file.
- Collapsed cards in the same row may differ slightly in height (summary or tags wrapping to another line); that is accepted. The fixed screenshot ratio prevents layout shift as images load.
- Card: `--surface`, 1px `--border` (hover: `--border-strong`), `--radius`, `overflow: hidden`.

**Card structure (in order):**
1. **Browser frame** — a 28px top bar with three small dots (`--border-strong`) and `project.displayUrl` in `--text-xs` `--text-muted` (omitted if absent), then the screenshot. The whole bar (dots and URL) is `aria-hidden="true"`.
   - Screenshot area has a **fixed 16:10 aspect ratio**; the image uses `object-fit: cover`, `width="1200" height="750"`, `loading="lazy"`, and alt text from content.
   - If no image: the 16:10 area is a solid `--bg` panel showing the project title in `--text-muted`; the panel is `aria-hidden="true"` (the title is announced by the button below).
   - Clicking the frame toggles the card (mouse convenience; the frame is not focusable and not an accessible control).
2. **Header row** — `<h3><button aria-expanded aria-controls="project-{id}-details">…</button></h3>`. The button spans the row and contains: index number (`01`, `02`, …, `--text-muted`), **title**, and on the right a `[+]` / `[−]` indicator (`aria-hidden`). This button is the only accessible toggle.
3. **Summary** — `--text-sm`, `--text-muted`.
4. **Tech tags** — static, 1px `--border-strong`, `--radius-sm`, `--text-xs`, no fill.
5. **Details panel** — `id="project-{id}-details"`, revealed when expanded:
   - **Problem**, **My contribution**, **Outcome**, optional bullet **Highlights**.
   - Links: **Source (GitHub)** and **Live demo**, where provided, with icons and visible text.
   - **Animation technique:** wrapper uses `display: grid` with `grid-template-rows: 0fr` (collapsed) → `1fr` (expanded), transition ≤200ms; the inner element has `overflow: hidden` **and `min-height: 0`** (required for it to collapse).
   - **When collapsed**, the inner element has the `inert` attribute (React 19 supports it as a boolean prop) so its links are unreachable by keyboard and hidden from assistive tech.
- Multiple cards may be open at once.

**Rationale:** the author prefers in-place expansion over a modal.

### 4.4 GitHub Activity
- `<section id="activity">`, heading `> activity`, then the total: `1,234 contributions in the last year` — formatted with `Intl.NumberFormat('en-US')`, singular "contribution" when the total is 1.
- **Scroll container:** wraps the calendar; `overflow-x: auto`; `tabindex="0"`, `role="region"`, `aria-label="Contribution calendar"`, and the standard focus ring, so keyboard users can scroll it. On mobile it starts scrolled to the right end (most recent weeks).
- **Calendar:** an SVG grid of week-columns × 7 day-rows, 11px cells with 3px gaps, 2px radius, rendered by our own component.
  - The `<svg>` has `role="img"` and `aria-label` equal to the total text (e.g. "1,234 contributions in the last year"). Individual cells are not exposed to assistive tech; per-day detail is mouse-only (accepted).
  - **Row placement:** each day's row is its `weekday` (0 = Sunday … 6 = Saturday, from the data — §5.3), never its index within the week array. Partial first/last weeks therefore render correctly.
  - **Colour:** each cell gets a CSS class `level-0` … `level-4` mapping to `--cal-0` … `--cal-4` (`fill` set in CSS, not via presentation attributes, since `fill="var(--x)"` doesn't work).
  - **Tooltips:** each cell has a native SVG `<title>`, e.g. `3 contributions on Oct 29, 2026` / `1 contribution on …` / `No contributions on …`. Dates formatted with `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`.
  - **Dates:** data dates are `YYYY-MM-DD` strings, parsed as local dates (split the string, `new Date(y, m - 1, d)`), never `new Date("YYYY-MM-DD")`, which parses as UTC and shows the previous day in US timezones.
  - **Month labels** (`Jan`, `Feb`, …, `--text-xs`) above the week-column where a new month begins (the column's first day is in a different month from the previous column's first day). A label is **skipped** if fewer than 3 columns separate it from the next label, or from the grid's end for the last label — preventing overlaps from partial months.
  - **Weekday labels** `Mon`, `Wed`, `Fri` (`--text-xs`) left of the grid.
  - **Legend** below, right-aligned: the text `Less`, five SVG squares (same size and radius as cells) in `--cal-0` … `--cal-4`, then `More`. The legend's SVG is `aria-hidden`.
- Below the calendar, `--text-sm` `--text-muted`: `Updated Oct 29, 2026` (from `fetchedAt`, same date format) and a "View on GitHub" link to the user's profile.
- **Fallback:** if data status is `unavailable` (§5.3), the section shows "Contribution activity is unavailable right now." and the GitHub link, instead of the calendar, total, and updated note.

### 4.5 Contact
- `<section id="contact">`, heading `> contact`, one short line inviting contact.
- Three links, each with icon **and the actual value as visible, selectable text**:
  - Email: `mailto:` link showing the address.
  - LinkedIn: showing the URL with protocol, `www.`, and trailing slash stripped (e.g. `linkedin.com/in/your-profile`) — derived, not a separate field.
  - GitHub: showing `github.com/<githubUsername>`.
- Accepted risk: a visible email address can be scraped by spammers. Not worth obfuscation for v1.

### 4.6 Footer
- `--text-sm`, `--text-muted`: `© <current year> <name>` and a "source" link to `site.sourceRepoUrl`.

### 4.7 External links (all sections)
- Every `http(s)` link that leaves the site (GitHub, LinkedIn, project links, source repo) and the Résumé link uses `target="_blank" rel="noopener noreferrer"` and includes visually-hidden text "(opens in a new tab)".
- **Exempt:** `mailto:` links open normally (no `target`, no hidden text).

### 4.8 404 page
- `public/404.html`: a standalone static page (served by Vercel for unknown paths) with inline CSS using the same colours and font (`/fonts/…` via `@font-face`): `> 404` heading, "This page doesn't exist.", and a link back to `/`. No JavaScript.

## 5. Architecture

### 5.1 Stack & tooling
- **Vite + React 19 + TypeScript** (strict mode), client-rendered static single-page build. No router, no SSR/prerendering. React pinned to major 19 (`^19`) because §4.3 relies on its `inert` prop support.
- **Styling:** CSS Modules per component plus a global stylesheet holding the tokens in §3.2–3.4, `@font-face` rules, `color-scheme`, and `::selection`. No CSS framework.
- **Runtime dependencies:** `react`, `react-dom`, `@vercel/analytics`. Fonts are committed files, icons are inline SVGs. **Dev dependencies:** only those from Vite's official `react-ts` template (Vite, the React plugin, TypeScript, ESLint and its configs, `globals`, React type packages). Any other dependency requires a doc change.
- **Analytics:** Vercel Web Analytics via `<Analytics />` from `@vercel/analytics/react`, rendered once in `App.tsx`. Page views only, no custom events. Cookieless, so no consent banner is needed. It only reports on Vercel deployments (no-op locally). Visitors with ad/tracker blockers aren't counted — accepted; the goal is a rough signal that the link is being opened.
- **Node:** 24 LTS, declared in `package.json` `engines` (`"node": ">=24"`) and `.nvmrc`. Vercel's project Node version set to match.
- **Package manager:** npm, with `package-lock.json` committed.
- **Linting:** the template's ESLint config, plus a block for `scripts/**/*.mjs` and `api/**/*.js` with Node globals (via `globals.node`). Those two files also start with `// @ts-check` and use JSDoc types for editor checking; they are **not** part of `tsc -b` (that would need `@types/node`).
- **TypeScript projects:** `tsconfig.node.json`'s `include` lists `src/content/site.ts` and `src/content/types.ts` alongside `vite.config.ts`, since the Vite plugin imports them (§5.5).
- **npm scripts:**

| Script | Command |
|---|---|
| `fetch-contributions` | `node scripts/fetch-contributions.mjs` |
| `predev`, `prebuild`, `pretypecheck` | `npm run fetch-contributions` |
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `typecheck` | `tsc -b` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |

### 5.2 Content model
All author-editable content lives in `src/content/` and `public/` — including page metadata (§5.5) — so placeholders can be replaced without touching UI code or `index.html`.

```ts
// src/content/types.ts
export type Site = {
  name: string;                         // full name: hero h1, footer, <title>
  firstName: string;                    // header logo
  role: string;                         // static role line in hero, <title>
  description: string;                  // meta / OG description (~150 chars)
  typedPhrases: [string, ...string[]];  // non-empty, looped in hero (§4.2.2)
  intro: string;                        // hero paragraph
  resumePath: `/${string}.pdf`;         // file in public/
  email: string;
  linkedinUrl: string;                  // full URL
  githubUsername: string;
  siteUrl: string;                      // no trailing slash
  sourceRepoUrl: string;
};

export type Project = {
  id: string;               // unique; lowercase letters, digits, hyphens; used as React key and in element ids
  title: string;
  summary: string;          // shown collapsed
  tech: string[];
  image?: { src: string; alt: string };   // 1200×750 WebP in public/projects/, ≤150KB
  displayUrl?: string;      // shown in the browser-frame bar
  links?: { source?: string; demo?: string };
  problem: string;
  contribution: string;
  outcome: string;
  highlights?: string[];
};

// src/content/site.ts
export const site = { /* values */ } satisfies Site;
//   githubUsername: "remyj4556", siteUrl: "https://remyjarrett.dev",
//   sourceRepoUrl: "https://github.com/remyj4556/portfolio-site"

// src/content/projects.ts
export const projects = [ /* ... */ ] satisfies Project[];
```

- **Derived values** live in `src/content/derived.ts` (not author-edited): `githubUrl = https://github.com/${githubUsername}`, `githubDisplay = github.com/${githubUsername}`, `linkedinDisplay` (§4.5). No URL is hardcoded in more than one place.
- **Dev-only validation:** when `import.meta.env.DEV`, `main.tsx` asserts every project `id` is unique and matches `/^[a-z0-9-]+$/`, throwing a descriptive error otherwise.
- **Résumé filename:** the PDF is named after the author (e.g. `Remington-Jarrett-Resume.pdf`) so it is identifiable if a recruiter saves it. It opens in a new tab; no `download` attribute.

### 5.3 Contribution data (build-time)
GitHub's contribution calendar is only available via the authenticated GraphQL API (`user.contributionsCollection.contributionCalendar`). A token cannot be shipped to the browser, so data is fetched by a script before dev, build, and typecheck (scripts in §5.1).

**`scripts/fetch-contributions.mjs`** — plain Node ESM, native `fetch`, no dependencies. Queries `totalContributions` and, per day, `date`, `weekday`, `contributionCount`, `contributionLevel`. Writes `src/data/contributions.json` (gitignored).

| Condition | Output | Exit |
|---|---|---|
| `GH_CONTRIB_TOKEN` not set | `{ "status": "unavailable", "reason": "no-token" }`, logs a warning | 0 (local dev works without a token) |
| Token set, valid response | `status: "ok"` data (below) | 0 |
| Token set, **any** of: non-2xx HTTP status; a non-empty GraphQL `errors` array (GitHub returns these with HTTP 200); `data.user` null; `contributionCalendar` missing; schema mismatch (e.g. `weeks` not an array, a `contributionLevel` not one of the five known values, `weekday` not 0–6) | nothing written; logs the reason | **non-zero** — fails the build |

**Rationale for failing:** a token is only set on Vercel, so a failure there means something broke (most likely an expired token). Failing the build makes it visible: Vercel keeps the previous deployment live, so the site never breaks, and the author is notified (§7). Silently falling back would let the calendar vanish unnoticed.

**Schema** — `src/data/contributions.types.ts`:

```ts
export type ContributionLevel = 0 | 1 | 2 | 3 | 4; // NONE, FIRST_QUARTILE … FOURTH_QUARTILE
export type ContributionDay = {
  date: string;        // YYYY-MM-DD
  weekday: number;     // 0 = Sunday … 6 = Saturday (from GitHub)
  count: number;
  level: ContributionLevel;
};
export type ContributionData =
  | { status: "ok"; fetchedAt: string /* ISO 8601 */; total: number; weeks: { days: ContributionDay[] }[] }
  | { status: "unavailable"; reason: "no-token" };
```

`weeks` is chronological; the first and last weeks may have fewer than 7 days.

**Token:** a GitHub fine-grained personal access token with **no repository permissions** (public profile data only), stored in Vercel as `GH_CONTRIB_TOKEN`, scoped to **Production and Preview** environments (a broken token failing a preview build is a useful early signal). Fine-grained tokens expire (max 1 year); expiry surfaces as a failed deployment.

**Freshness:** data is refreshed roughly daily, so it can be up to ~30 hours old; the "Updated <date>" note (§4.4) makes this visible.

**Daily refresh — Vercel Cron:**
- `vercel.json` defines one cron job: path `/api/rebuild`, schedule `0 6 * * *`. Vercel's Hobby plan runs it once a day at an imprecise time within that hour — exact timing is not required.
- `api/rebuild.js` — a Vercel function using the Web handler signature: `export async function GET(request)` (cron sends GET). It compares the `Authorization` header to `Bearer ${process.env.CRON_SECRET}` using a constant-time comparison (`crypto.timingSafeEqual` on equal-length buffers; unequal length → reject). On mismatch → 401. Otherwise POSTs to `process.env.VERCEL_DEPLOY_HOOK` and returns 200 (or 502 if the hook call fails).
- Env vars in Vercel: `CRON_SECRET` (random string; Vercel sends it automatically with cron requests), `VERCEL_DEPLOY_HOOK` (Deploy Hook URL for `main`).

**Rationale:** GitHub disables scheduled Actions workflows in public repos after 60 days without repository activity — a finished portfolio would hit that and silently stop refreshing. Vercel Cron has no such limit. Alternatives rejected: third-party contributions APIs (external dependency), embedded chart images (can't be styled).

### 5.4 File structure
```
api/
  rebuild.js            Vercel cron function
public/
  <Name>-Resume.pdf     placeholder
  404.html
  og-image.png          1200×630 placeholder
  favicon.svg
  apple-touch-icon.png  180×180
  robots.txt            allows all crawlers
  fonts/                jetbrains-mono-latin-400.woff2, jetbrains-mono-latin-700.woff2, OFL.txt
  projects/             project screenshots
scripts/
  fetch-contributions.mjs
src/
  main.tsx
  App.tsx
  content/              types.ts, site.ts, projects.ts, derived.ts
  data/                 contributions.json (generated, gitignored), contributions.types.ts
  styles/               tokens + global CSS
  components/           Header, Hero, MatrixRain, TypedText, MotionToggle, Projects,
                        ProjectCard, BrowserFrame, Activity, ContributionCalendar,
                        Contact, Footer, VisuallyHidden
index.html
vite.config.ts
vercel.json
.nvmrc
```

### 5.5 Metadata
- `index.html` contains placeholders: `%SITE_TITLE%`, `%SITE_DESCRIPTION%`, `%SITE_URL%`, `%OG_IMAGE_URL%`, `%NOSCRIPT%`.
- A small **inline Vite plugin** in `vite.config.ts` (`transformIndexHtml` hook; no new dependency) imports `src/content/site.ts` and replaces them:
  - `%SITE_TITLE%` → `<name> — <role>`
  - `%SITE_DESCRIPTION%` → `site.description`
  - `%SITE_URL%` → `site.siteUrl`
  - `%OG_IMAGE_URL%` → `${site.siteUrl}/og-image.png` (absolute, as Open Graph requires)
  - `%NOSCRIPT%` → a `<noscript>` block with the name, role, and plain links to the résumé, email, LinkedIn, and GitHub.
- Known limitation: edits to `site.ts` don't update these tags in a running `vite` dev server until it is restarted. Not a bug.
- Tags present: `<title>`, meta description, canonical link, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:type=website`), `twitter:card=summary_large_image`, favicon, `apple-touch-icon`, `<meta name="theme-color" content="#0a0e0a">`, font preloads (§3.3), `lang="en"`.

**No-JavaScript / SEO:** the site is client-rendered; without JS, visitors see only the `<noscript>` block. Accepted: recruiters arrive via links with JS enabled, link-preview crawlers read the static meta tags, and Google renders JS when indexing.

## 6. Accessibility & performance requirements
- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`); one `h1` (the name).
- All interactive elements keyboard-operable with a visible focus ring: 2px solid `--accent` outline with 2px offset (no glow).
- Images have alt text; decorative elements (canvas, `>` prompts, `[+]` indicators, logo brackets, browser-frame bar, no-image panel, legend) are `aria-hidden`.
- Motion: reduced-motion support and pause control per §3.5 (WCAG 2.2.2).
- External links per §4.7.
- Lighthouse (mobile) scores ≥ 90 for Performance and Accessibility on the deployed site.

## 7. Hosting & deployment
- **Vercel**, connected to the public GitHub repo `remyj4556/portfolio-site`; pushes to `main` deploy to production.
- Served on **`remyjarrett.dev`** (domain configured in Vercel's dashboard — not code).
- One-time setup (author, in dashboards — not code): env vars `GH_CONTRIB_TOKEN` (Production + Preview), `CRON_SECRET`, `VERCEL_DEPLOY_HOOK`; create the Deploy Hook; set Node 24; enable Web Analytics; **enable email notifications for failed production deployments**; add a calendar reminder to renew the token before it expires.

## 8. Acceptance criteria
v1 is done when:
1. `npm run lint`, `npm run typecheck`, and `npm run build` pass with no errors on a fresh clone with no token set.
2. Every section in §4 is present and behaves as specified, including keyboard operation and the pause control.
3. None of the exclusions in §3.1 appear.
4. With a valid token the calendar renders; with no token the fallback renders; with an invalid token the build fails.
5. The contribution total on the site matches the total shown on `github.com/remyj4556`. If it doesn't (e.g. private contributions are counted differently with a no-permission token), that's a doc change before launch, not a silent fix.
6. Lighthouse targets in §6 are met on the deployed site.
7. **The author reviews screenshots** at 1440px and 390px widths, including one project card expanded. Anything that deviates from this doc is fixed. Requests that would change the design (rather than conform to it) go through the doc process (update → goldfish review) before implementation — this is the exit condition for review, not open-ended iteration.

## 9. Placeholder content
Until the author supplies real content, the coder uses obviously fake placeholders:
- Name "Your Name", first name "Your", role "Software Engineer", a generic description, one typed phrase, and intro.
- Contact: `you@example.com`, `https://www.linkedin.com/in/your-profile`; GitHub from `githubUsername`.
- **Four** sample projects with lorem-style text and varied tech tags; one without an image, one without links, one without `displayUrl` (to exercise optional fields). Placeholder screenshots are solid-colour 1200×750 WebP images.
- `public/Your-Name-Resume.pdf`: a one-page PDF reading "Placeholder résumé".
- `og-image.png` (1200×630) and `apple-touch-icon.png` (180×180): solid-colour placeholders.

Replacing placeholders requires editing only `src/content/` and `public/`.

## 10. Open questions
None currently.

## 11. Revision log
- **v0.1** — Initial draft.
- **v0.2** — Author's reference feedback: all-JetBrains-Mono; floating header with `<FirstName />` logo and outlined Résumé button; hero restructured, About merged in; in-place expanding project cards in a 2-column grid with browser-frame screenshots; hard exclusions; typed phrase loops.
- **v0.3** — Domain `remyjarrett.dev`; repo public; contribution calendar kept.
- **v0.4** — Goldfish round 1: static role; WCAG 2.2.2 pause control; rain and typing fully specified; accessible card toggle and panel; calendar spec and data schema; metadata from `site.ts`; build fails on token errors; Vercel Cron refresh; tooling pinned.
- **v0.5** — Added Vercel Web Analytics.
- **v0.6** — Goldfish round 2: CSS cursor and SVG legend (glyphs missing from font subset); fonts committed as files and preloaded (dropped `@fontsource` dependency); header `fixed` with hero padding (sticky pushed hero below the fold); rain uses ResizeObserver and only reinitialises on column change, reads tokens via `getComputedStyle`, hard-clears columns on restart, continues on resume; strict GraphQL failure rules; `weekday` added to schema for row placement; scrollable calendar region focusable; `color-scheme: dark`; type/spacing/radius scale; pause/resume and reduced-motion semantics; pause control first in hero; mobile menu panel spec and focus behaviour; logo accessible name; dropped equal-card-height claim; month-label collision rule, pinned en-US date/number formats, CSS-class fills, calendar `role="img"`; "Updated <date>" note; LinkedIn display derived; `mailto:` exempt from new-tab rule; real TS types with `satisfies` and non-empty `typedPhrases`; derived URLs; dev-only project id validation; decorative frame parts `aria-hidden`; `min-height: 0` for collapse; React 19 pinned; token scoped to Production + Preview; cron handler signature, GET, constant-time compare, imprecise timing; contribution total check added to acceptance; Node scripts linted with `@ts-check`; tsconfig include for plugin imports; dev-server restart note; screenshots 1200×750 ≤150KB; 404 page, apple-touch-icon, theme-color, robots.txt; hover and selection colours; `--cal-0` lightened and claim softened; scroll-margin corrected.
