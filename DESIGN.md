# DESIGN.md — Portfolio Site

**Status:** Draft v0.5 — revised after goldfish round 1; ready for round 2.
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
- A single scrolling page with a sticky header linking to each section.
- Sections: Hero, Projects, GitHub Activity, Contact, Footer.
- A variable number of project cards, each expandable in place to show details.
- A GitHub contribution calendar for user `remyj4556`, refreshed daily.
- A résumé PDF, opened in a new browser tab.
- Privacy-friendly page-view analytics (Vercel Web Analytics).
- Placeholder content everywhere except the GitHub username, domain, and repo URL; the author replaces it before launch (see §9).

### Out of scope (v1)
- Separate About section (the hero intro covers it), blog, multiple pages/routing, contact form, CMS, light theme, internationalisation, prerendering/SSR, tests beyond typecheck/lint/build, custom analytics events (page views only).

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
| `--surface` | `#0f1a12` | Header bar, cards, browser-frame bar (solid) |
| `--border` | `#1f3326` | Decorative 1px borders: header bar, cards, frames (~1.5:1 on `--bg`; decorative only) |
| `--border-strong` | `#4a7058` | Borders that must read clearly: tech tags, menu button (≥3:1 on `--bg`) |
| `--text` | `#d4e4d8` | Primary text |
| `--text-muted` | `#8aa394` | Secondary text, nav links at rest |
| `--accent` | `#00ff41` | Typed phrase, hero label, link hover, focus rings, Résumé button |
| `--cal-0` … `--cal-4` | `#1a2a1f`, `#0b4d1c`, `#087a26`, `#00b82e`, `#00ff41` | Contribution calendar levels 0 (none) → 4 (most) |

All text/background pairs must meet WCAG AA contrast (4.5:1 for body text). `--cal-0` is deliberately lighter than `--surface` so empty days remain visible against `--bg`.

### 3.3 Typography
- **One typeface: JetBrains Mono**, weights **400 and 700 only**, Latin subset only, self-hosted via `@fontsource/jetbrains-mono` (import the specific per-weight Latin CSS files, not the package index). `font-display: swap`.
- Body text: 16px, line-height 1.6, max line length ~70 characters.
- Section headings styled as terminal prompts: `> projects`, `> activity`, `> contact`. The `>` is in `--accent` and wrapped in `aria-hidden="true"` so screen readers read only the word.

**Rationale:** the author liked an all-monospace reference. Monospace body text is slightly harder to read at length; mitigated by the size/line-height/line-length rules and by keeping copy short.

### 3.4 Motion
Exactly two effects, both in the Hero:
1. **Matrix rain** (§4.2.1).
2. **Typed phrase** with a blinking block cursor (§4.2.2).

**Reduced motion:** when `prefers-reduced-motion: reduce` matches, neither effect runs — the rain is not rendered and the first phrase is shown statically with a non-blinking cursor. The site listens for changes to this media query and applies them live, without reload.

**Pause control (WCAG 2.2.2):** both effects run longer than 5 seconds, so the Hero has a visible **pause/resume control** (§4.2.3) that stops both. This is required regardless of reduced-motion support.

Small hover/focus/expand transitions (≤200ms, colour/opacity/grid-row only) are allowed and not counted as "effects". Under reduced motion they are instant.

### 3.5 Layout
- Max content width 1100px, centred, 16px side padding on mobile, 24px on desktop.
- Breakpoints: mobile `<768px`, desktop `≥768px`.
- No horizontal page scroll at 360px width (the contribution calendar scrolls within its own container).

## 4. Page structure

### 4.1 Header
- **Floating bar**, `position: sticky`, inset 12px from the top and sides of the viewport, height `--header-h: 56px`, `--surface` background, 1px `--border`, 8px radius. Page content scrolling visibly through the 12px gaps around the bar is intended (it's what makes it "floating").
- **Logo** (left): an `<a href="#top">` (the Hero has `id="top"`) reading `<FirstName />` — angle brackets and slash in `--text-muted`, name in `--accent`.
- **Desktop nav** (right): links **Projects, Activity, Contact** (`--text-muted`, hover `--text`) as `<a href="#projects">` etc., then a **Résumé** link styled as an outlined button (1px `--accent` border, `--accent` text), opening the PDF in a new tab.
- Section links smooth-scroll (instant under reduced motion). Every section has `scroll-margin-top: calc(var(--header-h) + 24px)`.
- **Mobile (`<768px`)**: nav links and Résumé collapse behind a menu `<button>` (1px `--border-strong`) with `aria-expanded` and `aria-controls` pointing at a dropdown panel. The panel closes on: link click, Escape (focus returns to the menu button), and click outside the header.
- No active-section highlighting in v1.

### 4.2 Hero
- `<section id="top">`, `min-height: 100svh`, content centred, matrix rain behind it.
- Top to bottom:
  1. Small label `Hi, my name is` in `--accent`.
  2. **Name** — the page's single `h1`, `--text`, `font-size: clamp(2.25rem, 9vw, 6rem)`, may wrap at spaces (`text-wrap: balance`), never overflows horizontally.
  3. **Role** — static text from `site.role` (e.g. "Software Engineer"), `--text`, `clamp(1.25rem, 4vw, 2rem)`. Always visible, never animated.
  4. **Typed phrase** — `--accent`, `clamp(1rem, 3.5vw, 1.5rem)`, followed by a blinking block cursor (§4.2.2).
  5. **Intro paragraph** — 2–3 sentences, `--text-muted`, centred.
  6. **Icon links** — GitHub and LinkedIn logos (inline SVG, 28px), `--text-muted`, hover `--text`, each with an accessible name ("GitHub", "LinkedIn").
- Pause/resume control at the bottom-right of the hero (§4.2.3).

#### 4.2.1 Matrix rain
- A `<canvas aria-hidden="true">` absolutely positioned behind the hero content, filling the hero.
- **Characters:** ASCII only — `0-9`, `A-Z`, and `<>/{}[]=+*` — drawn in JetBrains Mono (avoids the font fallback katakana would need). Starts after `document.fonts.ready`.
- **Grid:** 16px font size; column width 16px; one stream per column.
- **Animation:** each stream advances one row per tick; each column gets a random tick interval between 50ms and 120ms. When a stream passes the bottom, it restarts at the top after a random delay (0–3s). Trail effect: each frame, the canvas is filled with `--bg` at 10% opacity before new characters are drawn (no blur, no shadow).
- **Look:** characters in `--accent`; the canvas element has CSS `opacity: 0.15`.
- **Rendering:** capped at 30 fps via `requestAnimationFrame`; canvas backing store scaled by `devicePixelRatio`. On resize (debounced 150ms) the canvas and columns are recomputed and streams restart.
- **Stops** when: the hero is not intersecting the viewport (IntersectionObserver), the tab is hidden (`visibilitychange`), the pause control is active, or reduced motion is on.

#### 4.2.2 Typed phrase
- Source: `site.typedPhrases` (≥1 phrase).
- **Initial state:** the first phrase is shown in full on load (so the hero is meaningful immediately).
- **Loop:** pause 2s → delete (35ms/char) → pause 0.5s → type the next phrase (70ms/char), wrapping to the first after the last → repeat. With one phrase, it deletes and retypes that phrase.
- **Cursor:** a block `▌` after the text, blinking at a 1s period while the loop runs; solid (not blinking) when paused or under reduced motion.
- **Stable height:** all phrases are rendered stacked in the same CSS grid cell (`grid-area: 1/1`), invisible (`visibility: hidden`) except the animated one, so the container's height is always that of the tallest phrase at the current width. No JS measurement.
- **Screen readers:** the animated element and the invisible sizers are `aria-hidden="true"`. A visually-hidden element contains all phrases as plain text, separated by periods.

#### 4.2.3 Pause control
- A `<button>` reading `[ pause motion ]` / `[ resume motion ]`, `--text-muted`, small, with `aria-pressed`.
- When pressed: the rain freezes on its current frame, the typed phrase completes instantly to the current phrase's full text and stops, the cursor stops blinking.
- State is per page load (not persisted).
- Hidden when reduced motion is on (nothing is moving).

### 4.3 Projects
- `<section id="projects">`, heading `> projects`.
- Grid of cards: **1 column on mobile, 2 on desktop**, `align-items: start` so expanding one card does not stretch its row neighbour. Gap 24px.
- Card count = whatever the content file contains; must work for any count from 1 to ~12. Order follows the content file.

**Card structure (in order):**
1. **Browser frame** — a 28px top bar (`--surface`) with three small dots (`--border-strong`) and `project.displayUrl` in small `--text-muted` text (omitted if absent), then the screenshot, all inside a 1px `--border`.
   - Screenshot area has a **fixed 16:10 aspect ratio**; the image uses `object-fit: cover`, `width`/`height` attributes (1600×1000), `loading="lazy"`, and alt text from content.
   - If no image: the 16:10 area is a solid `--surface` panel showing the project title in `--text-muted`.
   - Clicking the frame toggles the card (a mouse convenience; the frame is not focusable and not an accessible control — the title button below is).
2. **Header row** — `<h3><button aria-expanded aria-controls="project-{id}-details">…</button></h3>`. The button spans the row and contains: index number (`01`, `02`, …, `--text-muted`), **title**, and on the right a `[+]` / `[−]` indicator (`aria-hidden`). This button is the only accessible toggle.
3. **Summary** — one line, `--text-muted`.
4. **Tech tags** — static, 1px `--border-strong`, small monospace text, no fill.
5. **Details panel** — `id="project-{id}-details"`, revealed when expanded:
   - **Problem**, **My contribution**, **Outcome**, optional bullet **Highlights**.
   - Links: **Source (GitHub)** and **Live demo**, where provided, with icons and visible text.
   - **Animation technique:** wrapper uses `display: grid` with `grid-template-rows: 0fr` (collapsed) → `1fr` (expanded), transition ≤200ms; inner element has `overflow: hidden`.
   - **When collapsed**, the inner element has the `inert` attribute so its links are unreachable by keyboard and hidden from assistive tech.
- Multiple cards may be open at once.

**Rationale:** the author prefers in-place expansion over a modal. The fixed aspect ratio keeps collapsed cards in a row equal height and prevents layout shift.

### 4.4 GitHub Activity
- `<section id="activity">`, heading `> activity`, then "N contributions in the last year".
- **Calendar:** an SVG grid of 53 week-columns × 7 day-rows, 11px cells with 3px gaps, 2px radius, rendered by our own component.
  - Cell colour from GitHub's own `contributionLevel` (`NONE`, `FIRST_QUARTILE`, `SECOND_QUARTILE`, `THIRD_QUARTILE`, `FOURTH_QUARTILE` → `--cal-0` … `--cal-4`). We do not compute our own buckets.
  - **Month labels** (`Jan`, `Feb`, …) above the first week-column of each month; **weekday labels** `Mon`, `Wed`, `Fri` left of the grid; a legend `Less ■■■■■ More` below, right-aligned.
  - Each cell has a native SVG `<title>` tooltip, e.g. `3 contributions on Oct 29, 2026` (`No contributions on …` for zero).
  - **Dates:** GitHub returns `YYYY-MM-DD` strings. They must be parsed as local dates (split the string, `new Date(y, m - 1, d)`), never `new Date("YYYY-MM-DD")`, which parses as UTC and shows the previous day in US timezones.
- Link: "View on GitHub" → `https://github.com/remyj4556`.
- On mobile the calendar scrolls horizontally inside its container, initially scrolled to the right end (most recent weeks).
- **Fallback:** if data status is `unavailable` (§5.3), the section shows "Contribution activity is unavailable right now." and the GitHub link, instead of the calendar.

### 4.5 Contact
- `<section id="contact">`, heading `> contact`, one short line inviting contact.
- Three links, each with icon **and the actual value as visible, selectable text**:
  - Email: `mailto:` link showing the address (e.g. `you@example.com`).
  - LinkedIn: showing `linkedin.com/in/<handle>`.
  - GitHub: showing `github.com/remyj4556`.
- Accepted risk: a visible email address can be scraped by spammers. Not worth obfuscation for v1.

### 4.6 Footer
- `--text-muted`: `© <current year> <name>` and a "source" link to `site.sourceRepoUrl`.

### 4.7 External links (all sections)
- Every link that leaves the site (GitHub, LinkedIn, project links, source repo) and the Résumé link uses `target="_blank" rel="noopener noreferrer"` and includes visually-hidden text "(opens in a new tab)".

## 5. Architecture

### 5.1 Stack & tooling
- **Vite + React + TypeScript** (strict mode), client-rendered static single-page build. No router, no SSR/prerendering.
- **Styling:** CSS Modules per component plus a global stylesheet holding the tokens in §3.2 as CSS custom properties. No CSS framework.
- **Runtime dependencies:** `react`, `react-dom`, `@fontsource/jetbrains-mono`, `@vercel/analytics`. Icons are inline SVGs. **Dev dependencies:** only those from Vite's official `react-ts` template (Vite, the React plugin, TypeScript, ESLint and its configs, React type packages). Any other dependency requires a doc change.
- **Node:** 24 LTS, declared in `package.json` `engines` (`"node": ">=24"`) and `.nvmrc`. Vercel's project Node version set to match.
- **Analytics:** Vercel Web Analytics via `<Analytics />` from `@vercel/analytics/react`, rendered once in `App.tsx`. Page views only, no custom events. Cookieless, so no consent banner is needed. It only reports on Vercel deployments (no-op locally). Visitors with ad/tracker blockers aren't counted — accepted; the goal is a rough signal that the link is being opened, not precise numbers.
- **Package manager:** npm, with `package-lock.json` committed.
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
All author-editable content lives in `src/content/` and `public/` — including page metadata (see §5.5) — so placeholders can be replaced without touching UI code or `index.html`.

```ts
// src/content/site.ts
export const site = {
  name: string,             // full name: hero h1, footer, <title>
  firstName: string,        // header logo
  role: string,             // static role line in hero, <title>
  description: string,      // meta description / OG description (~150 chars)
  typedPhrases: string[],   // ≥1, looped in hero (§4.2.2)
  intro: string,            // hero paragraph
  resumePath: string,       // e.g. "/Your-Name-Resume.pdf" (file in public/)
  contact: {
    email: string,
    linkedin: string,       // full URL
    github: "https://github.com/remyj4556",
  },
  githubUsername: "remyj4556",
  siteUrl: "https://remyjarrett.dev",   // no trailing slash
  sourceRepoUrl: "https://github.com/remyj4556/portfolio-site",
};

// src/content/projects.ts
export type Project = {
  id: string;               // unique; used as React key and in element ids (letters, digits, hyphens)
  title: string;
  summary: string;          // one line, shown collapsed
  tech: string[];
  image?: { src: string; alt: string };   // 1600×1000 WebP in public/projects/, ≤200KB
  displayUrl?: string;      // shown in the browser-frame bar
  links?: { source?: string; demo?: string };
  problem: string;
  contribution: string;
  outcome: string;
  highlights?: string[];
};
export const projects: Project[] = [ /* ... */ ];
```

**Résumé filename:** the PDF is named after the author (e.g. `Remington-Jarrett-Resume.pdf`) so it is identifiable if a recruiter saves it. It opens in a new tab (the browser's PDF viewer offers download); no `download` attribute.

### 5.3 Contribution data (build-time)
GitHub's contribution calendar is only available via the authenticated GraphQL API (`user.contributionsCollection.contributionCalendar`). A token cannot be shipped to the browser, so data is fetched by a script before dev, build, and typecheck (see scripts in §5.1).

**`scripts/fetch-contributions.mjs`** — plain Node ESM, native `fetch`, no dependencies. Writes `src/data/contributions.json` (gitignored). Behaviour:

| Condition | Output | Exit |
|---|---|---|
| `GH_CONTRIB_TOKEN` not set | `{ "status": "unavailable", "reason": "no-token" }`, logs a warning | 0 (local dev works without a token) |
| Token set, request succeeds | `status: "ok"` data (below) | 0 |
| Token set, request fails or response is malformed | nothing written | **non-zero** — fails the build |

**Rationale for failing:** a token is only set in production, so a failure there means something broke (most likely an expired token). Failing the build makes it visible: Vercel keeps the previous deployment live, so the site never breaks, and the author is notified of the failed deployment (§7). Silently falling back would let the calendar vanish unnoticed.

**Schema** — the type lives in `src/data/contributions.types.ts`; the component imports the JSON typed as `ContributionData`:

```ts
export type ContributionLevel = 0 | 1 | 2 | 3 | 4; // mapped from GitHub's NONE…FOURTH_QUARTILE
export type ContributionDay = { date: string /* YYYY-MM-DD */; count: number; level: ContributionLevel };
export type ContributionData =
  | { status: "ok"; fetchedAt: string /* ISO 8601 */; total: number; weeks: { days: ContributionDay[] }[] }
  | { status: "unavailable"; reason: "no-token" };
```

`weeks` is in chronological order, each week's `days` Sunday→Saturday; the first and last weeks may have fewer than 7 days (as GitHub returns them).

**Token:** a GitHub fine-grained personal access token with **no repository permissions** (public profile data only), stored in Vercel as `GH_CONTRIB_TOKEN`. Fine-grained tokens expire (max 1 year); expiry surfaces as a failed deployment.

**Daily refresh — Vercel Cron:**
- `vercel.json` defines one cron job: path `/api/rebuild`, schedule `0 6 * * *` (daily).
- `api/rebuild.js` — a Vercel serverless function (plain ESM JS, no dependencies). It rejects requests whose `Authorization` header isn't `Bearer ${process.env.CRON_SECRET}` (401), otherwise POSTs to `process.env.VERCEL_DEPLOY_HOOK` and returns 200.
- Env vars in Vercel: `CRON_SECRET` (random string; Vercel sends it automatically with cron requests), `VERCEL_DEPLOY_HOOK` (a Deploy Hook URL for `main`).

**Rationale:** GitHub disables scheduled Actions workflows in public repos after 60 days without repository activity — a finished portfolio would hit that and silently stop refreshing. Vercel Cron has no such limit and keeps everything on one platform. Alternatives rejected: third-party contributions APIs (external dependency), embedded chart images (can't be styled).

### 5.4 File structure
```
api/
  rebuild.js            Vercel cron function
public/
  <Name>-Resume.pdf     placeholder
  og-image.png          1200×630 placeholder
  favicon.svg
  projects/             project screenshots
scripts/
  fetch-contributions.mjs
src/
  main.tsx
  App.tsx
  content/              site.ts, projects.ts
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
- A small **inline Vite plugin** in `vite.config.ts` (using the `transformIndexHtml` hook; no new dependency) imports `src/content/site.ts` and replaces them:
  - `%SITE_TITLE%` → `<name> — <role>`
  - `%SITE_DESCRIPTION%` → `site.description`
  - `%SITE_URL%` → `site.siteUrl`
  - `%OG_IMAGE_URL%` → `${site.siteUrl}/og-image.png` (absolute, as Open Graph requires)
  - `%NOSCRIPT%` → a `<noscript>` block with the name, role, and plain links to the résumé, email, LinkedIn, and GitHub.
- Tags present: `<title>`, meta description, canonical link, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:type=website`), `twitter:card=summary_large_image`, favicon, `lang="en"`.

**No-JavaScript / SEO:** the site is client-rendered; without JS, visitors see only the `<noscript>` block. Accepted: recruiters arrive via links with JS enabled, link-preview crawlers read the static meta tags, and Google renders JS when indexing. Prerendering was considered and rejected as unnecessary complexity for v1.

## 6. Accessibility & performance requirements
- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`); one `h1` (the name).
- All interactive elements keyboard-operable with a visible focus ring: 2px solid `--accent` outline with 2px offset (no glow).
- Images have alt text; decorative elements (`canvas`, `>` prompts, `[+]` indicators) are `aria-hidden`.
- Motion: reduced-motion support and pause control per §3.4 (WCAG 2.2.2).
- External links per §4.7.
- Lighthouse (mobile) scores ≥ 90 for Performance and Accessibility on the deployed site.

## 7. Hosting & deployment
- **Vercel**, connected to the public GitHub repo `remyj4556/portfolio-site`; pushes to `main` deploy to production.
- Served on **`remyjarrett.dev`** (domain configured in Vercel's dashboard — not code).
- One-time setup (author, in dashboards — not code): Vercel env vars `GH_CONTRIB_TOKEN`, `CRON_SECRET`, `VERCEL_DEPLOY_HOOK`; create the Deploy Hook; set Node 24; enable Web Analytics for the project; **enable Vercel email notifications for failed production deployments**; add a calendar reminder to renew the token before it expires.

## 8. Acceptance criteria
v1 is done when:
1. `npm run lint`, `npm run typecheck`, and `npm run build` pass with no errors on a fresh clone with no token set.
2. Every section in §4 is present and behaves as specified, including keyboard operation and the pause control.
3. None of the exclusions in §3.1 appear.
4. With a valid token the calendar renders; with no token the fallback renders; with an invalid token the build fails.
5. Lighthouse targets in §6 are met on the deployed site.
6. **The author reviews screenshots** at 1440px and 390px widths, including one project card expanded. Anything that deviates from this doc is fixed. Requests that would change the design (rather than conform to it) go through the doc process (update → goldfish review) before implementation — this is the exit condition for review, not open-ended iteration.

## 9. Placeholder content
Until the author supplies real content, the coder uses obviously fake placeholders:
- Name "Your Name", first name "Your", role "Software Engineer", a generic description, typed phrase, and intro.
- Contact: `you@example.com`, `https://www.linkedin.com/in/your-profile`, `https://github.com/remyj4556`.
- **Four** sample projects with lorem-style text and varied tech tags; one without an image, one without links, one without `displayUrl` (to exercise optional fields). Placeholder screenshots are solid-colour 1600×1000 WebP images.
- `public/Your-Name-Resume.pdf`: a one-page PDF reading "Placeholder résumé".
- `og-image.png`: a solid-colour 1200×630 placeholder.

Replacing placeholders requires editing only `src/content/` and `public/`.

## 10. Open questions
None currently.

## 11. Revision log
- **v0.1** — Initial draft.
- **v0.2** — Applied author's reference feedback: all-JetBrains-Mono typography; floating header with `<FirstName />` logo and outlined Résumé button; hero restructured and About section merged into it; projects switched to in-place expansion in a 2-column grid with browser-frame screenshots; hard exclusions (no glow, no gradients, no skills bubbles); typed phrase loops.
- **v0.3** — Domain `remyjarrett.dev`; repo public (footer source link, `sourceRepoUrl`); contribution calendar kept.
- **v0.4** — Goldfish round 1: static `role` in hero and title; typed phrase starts full, stable height via stacked grid, SR text defined; pause control (WCAG 2.2.2) covering both rain and typing; matrix rain fully specified; project card toggle as `h3 > button`, frame-click convenience, `inert` collapsed panel, grid-rows animation, 16:10 screenshots with image spec; `id` requirement clarified; header dimensions, scroll-margin, `#top` link, mobile menu a11y, floating gaps intended; calendar level tokens from GitHub's `contributionLevel`, labels, legend, local date parsing; résumé opens in new tab with named file; contact shows actual values; metadata generated from `site.ts` via inline Vite plugin with `<noscript>` fallback; contributions JSON schema, pre-scripts so fresh clones typecheck, build fails on token errors; daily refresh moved from GitHub Actions to Vercel Cron; font weights/subset; `>` aria-hidden; external-link rules; Node/npm/scripts pinned; `--border-strong` for tags; acceptance criterion 6 exit condition; analytics raised as open question.
- **v0.5** — Author accepted all v0.4 changes. Added Vercel Web Analytics (page views only, `@vercel/analytics`).
