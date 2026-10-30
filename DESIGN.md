# DESIGN.md — Portfolio Site

**Status:** Draft v0.2 — not yet reviewed.
**Owner:** the site's author (referred to as "the author").

This document is the single source of truth for the project. It is written to be read with no other context.

---

## 1. Purpose

A personal portfolio site for **job hunting**. The primary audience is **employers and recruiters** who will skim it, typically in under a minute, often from a link in an application or LinkedIn message.

The site must answer, quickly:
1. Who is this and what role do they want?
2. What have they built, and what did they personally do?
3. How do I get their résumé and contact them?

**Rationale:** recruiters skim. Every design choice below favours fast comprehension over novelty.

## 2. Scope

### In scope (v1)
- A single scrolling page with a sticky header linking to each section.
- Sections: Hero, Projects, GitHub Activity, Contact, Footer.
- A variable number of project cards, each expandable in place to show details.
- A GitHub contribution calendar for user `remyj4556`.
- A downloadable résumé PDF.
- Placeholder content everywhere except the GitHub username; the author replaces it before launch (see §9).

### Out of scope (v1)
- Separate About section (the hero's intro paragraph covers it), blog, multiple pages/routing, contact form, CMS, analytics, light theme, internationalisation, tests beyond typecheck/lint/build.

**Rationale:** the author wants this done quickly and efficiently. A contact form needs a backend; plain links suffice.

## 3. Visual direction

**Theme:** "tech-y", loosely inspired by *The Matrix* — dark, terminal-flavoured, green accent. Inspiration, not imitation.

**Principle: restraint.** The look comes from a monospace typeface, a single accent colour, crisp 1px borders, and flat surfaces — not from effects.

### 3.1 Hard exclusions
These are explicitly rejected by the author and must not appear anywhere:
- **No glow.** No `text-shadow` or `box-shadow` used to create glow/neon effects, on text, buttons, borders, or the matrix rain. No blur-based halos.
- **No gradients** on backgrounds or text. All surfaces are solid colours. (This includes "ambient" radial colour blobs behind content.)
- **No skills bubbles/pills that scroll, float, or marquee**, and no standalone "Skills" section. Tech tags on project cards are static and are not a skills section.

**Rationale:** the author considers these hallmarks of generic, AI-generated front-ends.

### 3.2 Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0e0a` | Page background (solid) |
| `--surface` | `#0f1a12` | Header bar, cards (solid) |
| `--border` | `#1f3326` | 1px borders on header, cards, frames |
| `--text` | `#d4e4d8` | Primary text |
| `--text-muted` | `#8aa394` | Secondary text, nav links at rest |
| `--accent` | `#00ff41` | Typed phrase, hero label, links on hover, focus rings, Résumé button, calendar max level |
| `--accent-dim` | `#00b82e` | Calendar mid levels, pressed states |

All text/background pairs must meet WCAG AA contrast (4.5:1 for body text).

### 3.3 Typography
- **One typeface: JetBrains Mono**, used for everything (headings, nav, body, tags). Self-hosted via `@fontsource/jetbrains-mono` — no runtime request to Google Fonts.
- Body text: ~16–17px, line-height ≥1.6, line length ≤ ~70 characters, to keep monospace paragraphs readable.
- Section headings styled as terminal prompts: `> projects`, `> activity`, `> contact` (the `>` in `--accent`, the word in `--text`).

**Rationale:** the author liked the all-monospace look of a reference site. Monospace body text is slightly harder to read at length, mitigated by the size/line-height/line-length rules above and by keeping copy short.

### 3.4 Motion
Exactly two effects:
1. **Matrix rain** — a canvas of falling characters behind the Hero only, in `--accent` at low opacity (≤ 0.15) so hero text stays readable. Characters are drawn flat — no glow, blur, or shadow. Pauses when the hero is off-screen or the tab is hidden.
2. **Typing effect** — the hero phrase types out character by character with a blinking block cursor, loops continuously (see §4.2).

Both are **disabled when the user has `prefers-reduced-motion: reduce`**: rain is not rendered, the first phrase appears fully with a static cursor and does not loop.

Small hover/focus/expand transitions (≤200ms, colour/opacity/height only) are allowed and not counted as "effects". Under reduced motion they are instant.

### 3.5 Layout
- Max content width ~1100px, centred.
- Breakpoints: mobile `<768px`, desktop `≥768px`.
- No horizontal page scroll at 360px width (the contribution calendar scrolls within its own container).

## 4. Page structure

### 4.1 Header
- Sticky at the top, rendered as a **floating bar**: inset from the viewport edges, `--surface` background, 1px `--border`, small border radius.
- Left: a logo in the form `<FirstName />` — angle brackets and slash in `--text-muted`, name in `--accent`. Clicking it scrolls to the top.
- Right: nav links **Projects, Activity, Contact** in `--text-muted` (hover: `--text`), then a **Résumé** button — outlined with 1px `--accent` border and `--accent` text, opens the PDF in a new tab.
- Section links smooth-scroll to their section (instant under reduced motion). Sections have `scroll-margin-top` so the header doesn't cover their headings.
- Mobile (`<768px`): nav links and Résumé button collapse into a menu button that toggles a dropdown panel. Panel closes on link click and on Escape.
- No active-section highlighting in v1.

### 4.2 Hero
- Minimum full-viewport-height, content centred horizontally and vertically, matrix rain behind it.
- Top to bottom:
  1. Small label `Hi, my name is` in `--accent`.
  2. **Name** — the page's single `h1`, very large (fluid, roughly 48px mobile → 96px desktop), `--text`.
  3. **Typed phrase** — large (roughly half the name's size), `--accent`, followed by a blinking block cursor. Text from `site.typedPhrases` (§5.2). Loop: type a phrase (~70ms/char), pause ~2s, delete it (~35ms/char), pause ~0.5s, then type the next phrase, wrapping to the first after the last. With one phrase, it types, deletes, and retypes that phrase. The line reserves its height so the layout doesn't shift while typing.
  4. **Intro paragraph** — 2–3 sentences, `--text-muted`, centred, max ~70 characters per line.
  5. **Icon links** — GitHub and LinkedIn logos (inline SVG, ~28px), `--text-muted`, hover `--text`. Each has an accessible label ("GitHub", "LinkedIn") and opens in a new tab.

### 4.3 Projects
- Section heading `> projects`.
- Grid of cards: **1 column on mobile, 2 on desktop**. Grid uses `align-items: start` so expanding one card does not stretch its row neighbour.
- Number of cards = whatever the content file contains; must work for any count from 1 to ~12. Order follows the content file.

**Card — collapsed:**
- **Screenshot in a browser-style frame**: a thin top bar (`--surface`) with three small dots and the project's display URL in small muted text, the screenshot below, all inside a 1px `--border`. If the project has no image, the frame shows a solid `--surface` panel with the project title in muted monospace instead.
- Below the frame: index number (`01`, `02`, …) in `--text-muted`, **title**, one-line **summary**, static **tech tags** (1px bordered, small monospace, no fill).
- A disclosure control at the bottom: `[+] details` (becomes `[−] details` when open).

**Card — expanded (in place):**
- Clicking the title row or the disclosure control toggles the card. The toggle is a `<button>` with `aria-expanded` and `aria-controls`; the details panel is a sibling of the button, not inside it.
- The panel reveals: **Problem**, **My contribution**, **Outcome**, optional bullet **highlights**, and links — **Source (GitHub)** and **Live demo** — where provided, with icons and visible text, opening in new tabs.
- Multiple cards may be open at once. Expansion animates height ≤200ms (instant under reduced motion).

**Rationale:** the author prefers in-place expansion over a modal. The 2-column grid with `align-items: start` keeps neighbouring cards still; only content below moves.

### 4.4 GitHub Activity
- Section heading `> activity`, total contributions in the last year, and a contribution calendar (53 weeks × 7 days) rendered as an SVG grid by our own component, styled with a 5-step scale from `--surface` (zero) through `--accent-dim` to `--accent`.
- Each day cell has a native tooltip (`<title>`) with date and count.
- A link to `https://github.com/remyj4556`.
- On mobile the calendar scrolls horizontally inside its container, initially scrolled to the most recent weeks.
- **Fallback:** if no contribution data is available (see §5.3), the section shows a short message and the GitHub profile link instead of the calendar. The page must never break because this data is missing.

### 4.5 Contact
- Section heading `> contact`, one short line inviting contact.
- Three links: **Email** (`mailto:`), **LinkedIn**, **GitHub**, each with icon and visible text.
- Accepted risk: a visible email address can be scraped by spammers. Not worth obfuscation for v1.

### 4.6 Footer
- Name and current year in `--text-muted`. Optional link to the site's source repo (omitted if the repo is private — §10.3).

## 5. Architecture

### 5.1 Stack
- **Vite + React + TypeScript** (strict mode), static single-page build. No router.
- **Styling:** CSS Modules per component plus a global stylesheet holding the tokens in §3.2 as CSS custom properties. No CSS framework.
- **Linting:** ESLint (Vite's React+TS template config).
- **Runtime dependencies:** `react`, `react-dom`, `@fontsource/jetbrains-mono`. Icons are inline SVGs (no icon library). Any other dependency requires a doc change.

### 5.2 Content model
All author-editable content lives in `src/content/`, separate from components, so placeholders can be replaced without touching UI code.

```ts
// src/content/site.ts
export const site = {
  name: string,             // full name, hero h1
  firstName: string,        // header logo
  typedPhrases: string[],   // hero typed text; ≥1 phrase, looped (§4.2)
  intro: string,            // hero paragraph
  resumePath: "/resume.pdf",
  contact: { email: string, linkedin: string /* URL */, github: string /* URL */ },
  githubUsername: "remyj4556",
  siteUrl: string,          // canonical URL on the author's domain
};

// src/content/projects.ts
export type Project = {
  id: string;               // unique, URL-safe
  title: string;
  summary: string;          // one line, shown collapsed
  tech: string[];
  image?: { src: string; alt: string };   // files in public/projects/
  displayUrl?: string;      // shown in the browser-frame bar; omitted → bar shows no URL
  links?: { source?: string; demo?: string };
  problem: string;
  contribution: string;
  outcome: string;
  highlights?: string[];
};
export const projects: Project[] = [ /* ... */ ];
```

### 5.3 Contribution data (build-time)
GitHub's contribution calendar is only available via the authenticated GraphQL API (`user.contributionsCollection.contributionCalendar`). A token cannot be shipped to the browser, so data is fetched **at build time**:

- `scripts/fetch-contributions.mjs` (plain Node ESM, Node ≥18 native `fetch`, no dependencies) runs before `vite build` via the `prebuild` npm script.
- It reads `GH_CONTRIB_TOKEN` from the environment, queries the last year for `remyj4556`, and writes `src/data/contributions.json` (gitignored).
- **If the token is missing or the request fails**, it logs a warning and writes a JSON file marking data as unavailable. The build succeeds; the section shows its fallback (§4.4). This also lets the site build locally without a token.
- The token is a GitHub fine-grained personal access token with **no repository permissions** (public profile data only), stored as a Vercel environment variable.

**Daily refresh:** a GitHub Actions workflow (`.github/workflows/daily-rebuild.yml`) runs once a day on a cron schedule and POSTs to a Vercel **Deploy Hook** URL stored as repo secret `VERCEL_DEPLOY_HOOK`, triggering a rebuild that re-fetches the data.

**Rationale:** alternatives were a third-party contributions API (external dependency that can disappear) or an embedded chart image (can't be styled to match). Build-time fetch has neither problem; data is at most ~24h stale.

### 5.4 File structure
```
public/
  resume.pdf          placeholder
  og-image.png        1200×630 placeholder
  favicon.svg
  projects/           project screenshots
scripts/
  fetch-contributions.mjs
src/
  main.tsx
  App.tsx
  content/            site.ts, projects.ts
  data/               contributions.json (generated, gitignored)
  styles/             tokens + global CSS
  components/         Header, Hero, MatrixRain, TypedText, Projects, ProjectCard,
                      BrowserFrame, Activity, ContributionCalendar, Contact, Footer
.github/workflows/daily-rebuild.yml
```

### 5.5 Metadata
`index.html` includes: title (`<Name> — <Role>`), meta description, Open Graph and Twitter card tags (title, description, `og-image.png`, `siteUrl`), favicon, `lang="en"`.

## 6. Accessibility & performance requirements
- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`); one `h1` (the name).
- All interactive elements keyboard-operable with a visible focus ring (`--accent`, solid outline — not a glow).
- Images have alt text; the rain canvas is `aria-hidden`. The typed phrase exposes its full text to screen readers (not announced character by character).
- Reduced motion respected (§3.4).
- Lighthouse (mobile) scores ≥ 90 for Performance and Accessibility on the deployed site.

## 7. Hosting & deployment
- **Vercel**, connected to the project's GitHub repository; pushes to `main` deploy to production.
- Served on the author's purchased custom domain (configured in Vercel's dashboard — not code).
- Requires: the repo pushed to GitHub, `GH_CONTRIB_TOKEN` set in Vercel, a Vercel Deploy Hook created and stored as `VERCEL_DEPLOY_HOOK` in GitHub repo secrets.

## 8. Acceptance criteria
v1 is done when:
1. `npm run lint`, `tsc` typecheck, and `npm run build` all pass with no errors.
2. Every section in §4 is present and behaves as specified.
3. None of the exclusions in §3.1 appear.
4. The site builds and renders correctly both with and without `GH_CONTRIB_TOKEN`.
5. Lighthouse targets in §6 are met on the deployed site.
6. **The author reviews screenshots** at 1440px (desktop) and 390px (mobile) widths — including one project card expanded — and approves the look.

## 9. Placeholder content
Until the author supplies real content, the coder uses obviously fake placeholders:
- Name "Your Name", first name "Your", a generic typed phrase and intro paragraph.
- Contact: `you@example.com`, `https://www.linkedin.com/in/your-profile`, `https://github.com/remyj4556`.
- **Four** sample projects with lorem-style text and varied tech tags; one without an image, one without links, one without `displayUrl` (to exercise optional fields). Placeholder screenshots are plain solid-colour images.
- `public/resume.pdf`: a one-page PDF reading "Placeholder résumé".
- `og-image.png`: a plain solid-colour placeholder.

Replacing placeholders requires editing only `src/content/` and `public/`.

## 10. Open questions
1. **Contribution calendar** — the author should check their GitHub graph and decide whether it helps or hurts (sparse graphs, or mostly private work, can look bad). If kept, enable "include private contributions" on the GitHub profile.
2. **Domain** — the domain name itself (needed for `siteUrl` and OG tags).
3. **GitHub repo** — this repo has no remote yet. Public or private? (Affects the footer source link.)

## 11. Revision log
- **v0.1** — Initial draft.
- **v0.2** — Applied author's reference feedback: all-JetBrains-Mono typography; floating header with `<FirstName />` logo and outlined Résumé button; hero restructured (label, name, typed phrase, intro, GitHub/LinkedIn icons) and About section merged into it; hero CTA buttons removed; projects switched from modal to in-place expansion in a 2-column grid with browser-frame screenshots; added hard exclusions (no glow, no gradients, no skills bubbles); removed Inter font dependency; typed phrase loops (type, delete, next/retype).
