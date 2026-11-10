# DESIGN.md — Portfolio Site

**Status:** v0.7 — "terminal-pop" redesign, implemented on branch `redesign/terminal-pop` (goldfish review skipped by the author for this experiment). Decisions from the first draft applied (§10); deviations found while building are recorded in the sections they affect and in §8. Supersedes the visual direction of v0.6; everything not mentioned here is unchanged from v0.6.
**Owner:** the site's author (referred to as "the author").

This document is the single source of truth for the project. It is written to be read with no other context.

---

## 1. Purpose

A personal portfolio site for **job hunting**. The primary audience is **employers and recruiters** who will skim it, typically in under a minute, often from a link in an application or LinkedIn message.

The site must answer, quickly:
1. Who is this and what role do they want?
2. What have they built, and what did they personally do?
3. How do I get their résumé and contact them?

**Rationale:** recruiters skim. Every design choice below favours fast comprehension. Anything essential (name, role, contact) is static text, never only inside an animation. The redesign (v0.7) adds visual character; it does not change this priority.

## 2. Scope

### In scope (v1)
- A single scrolling page with a header linking to each section.
- Sections: Hero, Projects, Case study, GitHub Activity, Contact (closing section), Footer.
- A variable number of project cards, each expandable in place to show details.
- A GitHub contribution calendar for user `remyj4556`, refreshed daily.
- A résumé PDF, opened in a new browser tab.
- Privacy-friendly page-view analytics (Vercel Web Analytics).
- A themed static 404 page.
- Placeholder content everywhere except the GitHub username, domain, and repo URL; the author replaces it before launch (see §9).

### Out of scope (v1)
- Separate About section (the hero intro covers it), blog, multiple pages/routing, contact form, CMS, light theme, internationalisation, prerendering/SSR, sitemap, tests beyond typecheck/lint/build and the kit checks in §8, custom analytics events (page views only), a big scroll scene (§3.5).

**Rationale:** the author wants this done quickly and efficiently. A contact form needs a backend; plain links suffice.

## 3. Visual direction

**Theme:** terminal-flavoured, dark, green accent — now **stylised and committed**: a terminal window is the hero's centrepiece, section headings are shell prompts, and the type is large and confident. Inspiration from *The Matrix*, not imitation.

**Principle (replaces v0.6's "restraint"): one concept, fully committed, with a fixed budget of motion.** The terminal conceit appears in the hero window (whose border carries the one animated gradient), the `>` prompts, the project-card chrome, the tags and the calendar; motion is limited to the budget in §3.5. Nothing else decorates.

**Rationale:** v0.6 was accessible and coherent but, below the hero, read as a standard dark card layout: the terminal idea lived mostly in the headings, sections looked alike, and the Matrix rain (the only visual flourish) is the most familiar "hacker site" device. The author asked for more style and "pop", and treats this redesign as an experiment (the previous design stays in git history).

### 3.1 Exclusions
Changed from v0.6 (the author confirmed lifting the gradient ban for the experiment, limited to the two named uses below; the glow ban is narrowed to element shadows and halos, since a soft ground is light by nature):
- **No glow on elements.** No `text-shadow` or `box-shadow` used to create neon effects, and no blur halos, on text, buttons, borders or focus rings.
- **No frosted glass** (`backdrop-filter`) anywhere, including the header and menu.
- **No violet or lavender** anywhere in the site's own design.
- **No skills bubbles/pills that scroll, float, or marquee**, and no standalone "Skills" section. Tech tags on project cards are static and are not a skills section.
- **Gradients are allowed in exactly two places:** the hero terminal window's **border** (a green gradient sweeping round its edge, §4.2.1) and the case-study section's `bg-halo` ground (§3.7). Never on text, buttons, cards or any other surface; the terminal's own fill and everything behind it stay solid.

**Rationale:** the first four are what makes a "tech" page look generic; the kit's own rules also forbid them. Gradients are confined to two named uses so they stay a deliberate feature rather than a default. The first design for the hero put a drifting gradient ground behind the terminal; the author scrapped it for the border sweep, which keeps the page's one flourish on the terminal itself.

### 3.2 Colour tokens
The palette is unchanged from v0.6 — terminal green is the author's brand — and is fed to the design kit (§5.1) as its brand colours, replacing the colours the kit would otherwise deal.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0e0a` | Page background (solid) |
| `--surface` | `#0f1a12` | Cards, terminal window, frame bars, menu panel (solid) |
| `--border` | `#1f3326` | Decorative 1px borders (~1.5:1 on `--bg`; decorative only) |
| `--border-strong` | `#4a7058` | Borders that must read clearly: tech tags, menu button, card hover (≥3:1 on `--bg`) |
| `--text` | `#d4e4d8` | Primary text |
| `--text-muted` | `#9ab5a4` | Secondary text (lightened from v0.6's `#8aa394`: the kit wants 7:1 for text people read, and 14px card summaries on `--surface` measured 6.58:1) |
| `--accent` | `#00ff41` | Prompts, typed phrase, cursor, primary button, link hover, focus rings, text selection |
| `--cal-0` … `--cal-4` | `#243a2c`, `#0b4d1c`, `#087a26`, `#00b82e`, `#00ff41` | Contribution calendar levels 0 → 4 |

- The kit's own tokens (`--p-bg`, `--p-surface`, `--p-ink`, `--p-muted`, `--p-accent`, …) are generated from these values by the kit's brand command; the generated `:root` block is kept as printed and is the single place these values are defined. The names above remain as aliases so existing component CSS keeps working.
- All text/background pairs must meet WCAG AA (4.5:1 body text). The kit's checker measures this.
- `--cal-0` is only faintly distinguishable from `--bg` (~1.6:1); accepted as in v0.6.
- `:root` sets `color-scheme: dark`. `::selection` uses `--accent` background with `--bg` text.

### 3.3 Typography
Two faces, both **self-hosted** as Latin-subset `.woff2` in `public/fonts/` with `@font-face` (`font-display: swap`) and preloaded in `index.html`:
- **Manrope** (variable, weight axis, 400–700): headlines (weight 500, negative tracking at hero size as the kit prints) and body text.
- **JetBrains Mono** (existing files, weights 400 and 700): the terminal window, `>` section prompts, project-card chrome, tags, nav labels, the pause control, the calendar and code-like labels.

The kit's own snippet loads these from Google Fonts; **we do not** — self-hosting is kept from v0.6 (no third-party font requests, stable preloads). Manrope's file is downloaded once from Fontsource's Latin subset and committed with its OFL licence in `public/fonts/`.

- The Latin subset lacks block-drawing and geometric-shape glyphs, so no UI element may rely on such characters (cursor and legend are drawn with CSS/SVG).
- Section headings stay terminal prompts: `> projects`, `> case study`, `> activity`, `> contact`, set in JetBrains Mono 700; the `>` is `--accent` and `aria-hidden="true"`.

**Rationale:** the pairing the kit dealt (Manrope + JetBrains Mono) gives large display type real presence while the mono face keeps the terminal identity exactly where it is functional. **Trade-off, accepted by the author:** v0.6 was all-monospace by the author's preference; this makes headlines and body proportional.

### 3.4 Scale, spacing, shape
Superseded: the v0.6 type/spacing/radius tables are retired. Type sizes, spacing, the 12-column grid and content width (about 1200px at 1440) come from the kit's `system.css` and `layout.css`; radius is the kit's `sharp` setting (square-ish corners). Values not given by the kit are left to the coder's judgment. Breakpoints and verification widths: §8.

### 3.5 Motion
A **fixed budget**; nothing outside it moves:
1. **The hero entrance** — the hero's elements enter once on load via the kit's motion layer (`data-enter`).
2. **The border sweep** — a green gradient that travels once round the hero terminal's border every 8 seconds (§4.2.1). Pure CSS: no canvas, no WebGL.
3. **The typed phrase** inside the terminal window (§4.2.2) — custom, retained from v0.6.
4. **The one moment** — `pinned-chapters` in the Case study section (§4.3.1). Scroll-driven, inside its own section only.
5. **The hover/press layer** from the kit's motion layer: linked cards lift 2px, buttons step on hover and press on click, underlines draw. No tilt, no magnetic buttons, no custom cursor.

Nothing else may move because the page scrolled: no cards fading in, no parallax.

**Reduced motion** (`prefers-reduced-motion: reduce`, tracked live without reload): the entrance does not play, the border sweep rests (the gradient stays visible, unmoving), the typed phrase shows the first phrase statically with a solid cursor, the moment collapses to static rows. All content stays visible.

**Pause control (WCAG 2.2.2):** the border sweep and the typed phrase run longer than 5 seconds, so the hero keeps one visible pause/resume control that stops both (§4.2.3). The scroll-driven moment is not time-based and is exempt.

Phones get the kit's still or light version of the moment (it decides per its own rules); the border sweep and the typed phrase run on all sizes.

### 3.6 Layout & interaction states
- Content width and breakpoints from the kit; no horizontal page scroll down to 320px (the contribution calendar scrolls within its own container).
- Every interactive element answers the pointer (kit motion layer). Text links go `--accent` on hover. Tech tags are not interactive.
- On phones every link and control outside running text is a 44px tap target (icon links, the pause control, card toggles, card links).
- One button pair across the site: **primary** (solid `--accent` fill, `--bg` text) and **secondary** (outlined). One card style, one link look.

### 3.7 Deal record
The kit chooses its parts by script, not by taste, so the result is recorded here and built exactly. Rolled again only if a dealt part cannot carry this site's content (a re-roll must be recorded with its reason).

| Part | Result | Notes |
|---|---|---|
| Kind | software | A developer's portfolio treated as a software page (dark page and effects are allowed there; a "service" page would forbid them). |
| Hero | `collage` | Text left; the terminal window in the right six columns. The kit's lit ground behind the window and its offset and cut are dropped: the terminal fills the frame (§4.2). |
| Palette | author's brand (§3.2) | Replaces the dealt "graphite and orange". |
| Type | Manrope + JetBrains Mono | First pairing dealt. |
| Radius | sharp | Kit setting for developer tools. |
| Effect | none | The dealt `grain-gradient` ground was built and then replaced by the animated border (§4.2.1); the kit's effect files are no longer copied in. |
| Moment | `pinned-chapters` | Case study section (§4.3.1). No second moment: the page has fewer than eight sections. |
| Big scene | none | The kit's scenes need the client's own UI at true size; not available with placeholders. |
| Section grounds | projects: plain · case study: `bg-halo` · activity: `bg-dots` · contact: plain | `bg-halo` and `bg-dots` are the kit's CSS grounds. |
| Nav / close / footer | `nav-centre` / `close-word` / `footer-statement` | |
| Rhythm / buttons / mark | `space` / `solid` / `ring` | Sections separated by space on one ground, no bands. |

## 4. Page structure

### 4.1 Header
- Kit `nav-centre`, fixed to the top, `--surface` background with a 1px `--border`; no `backdrop-filter`. **Logo** (left, links to `#top`): the kit's `ring` mark followed by the first name in `--accent`; accessible name `<name>, back to top` (the visible first name is contained in it). The v0.6 `<FirstName />` bracket treatment is dropped.
- **Links:** Projects, Activity, Contact (to `#projects`, `#activity`, `#contact`), then **Résumé** as the primary-style button opening the PDF in a new tab. Smooth-scroll (instant under reduced motion); sections keep a `scroll-margin-top` that clears the header.
- **Mobile:** links and Résumé collapse behind a menu `<button>` with `aria-expanded` and `aria-controls`; the menu is a full-screen panel (kit rule), links at least 48px tall, Résumé last. The menu's behaviour is the kit's script, not React state: the toggle flips `aria-expanded`, the sheet locks page scroll, and it closes on a link tap, on Escape (focus returns to the toggle) and when the window grows to desktop width. v0.6's click-outside and focus-leaves-header closing are dropped: a full-screen sheet has no outside, and tabbing out of it is not possible while it locks the page. The skip link targets `<main id="main">`.
- No active-section highlighting in v1.

### 4.2 Hero
- `<section id="top">`, one full screen on its own at every width (`min-height: 100svh`), kit `collage` layout.
- **Left column**, in DOM order after the pause control:
  1. **h1** — the author's name, the page's single `h1`.
  2. **Role** — static text from `site.role`, always visible, never animated.
  3. **Buttons** (two at most): primary **View projects** (`#projects`), secondary **Email me** (`mailto:`).
  4. **Icon links** — GitHub and LinkedIn (inline SVG, accessible names, external-link rules §4.7).
  5. **Proof line** (`--text-muted`): `1,234 contributions in the last year`, from the same data and formatter as §4.4; omitted when contribution data is unavailable.
- **Right column:** the **terminal window** (§4.2.2), **filling the whole right-hand frame** (six columns wide and as tall as the hero's content area) with **nothing behind it** — no ground, no gradient, no canvas. Its border is the animated gradient (§4.2.1). The pause control (§4.2.3) lives in the window's title bar, so it comes before the moving typed line in DOM order and never overlaps the headline at narrow widths. On phones the window stands alone under the text, whole, and the hero still fits the first screen.
- The "Hi, my name is" label from v0.6 is dropped.

#### 4.2.1 Border sweep
- The terminal window has a **2px border drawn as a conic gradient**: the page's dark green (`#1f3326`) all the way round, with one short sweep of brighter greens (`#087a26` → `#00b82e` → `#00ff41`) that **travels once round the edge every 8 seconds**, clockwise, linear. The window's own fill (`--surface`) is clipped inside the border, so only the border shows the gradient.
- **Implementation:** pure CSS — a registered `@property --angle` (type `<angle>`) animated from `0deg` to `360deg`, used as the `from` angle of the `conic-gradient` on the border box. No JavaScript, no canvas, no WebGL; the kit's effect runtime is not loaded. In a browser without `@property` support the border shows at its resting angle (a static green gradient) instead of moving.
- No `box-shadow`, `text-shadow` or blur is added, so nothing glows (§3.1); the gradient is confined to the 2px border.
- **Pause and reduced motion:** the hero's pause control (§4.2.3) sets the animation to paused, freezing the sweep where it is; under reduced motion the animation does not run and no pause control is shown (§3.5).
- **Rationale:** the first hero design put a drifting gradient ground behind the terminal (a WebGL effect from the kit). The author scrapped it: the ground competed with the terminal and added WebGL weight. A border sweep keeps the hero's motion on the terminal itself, costs no WebGL, and keeps the page's one flourish contained.

#### 4.2.2 Terminal window and typed phrase
- A window with a title bar (three dots in `--border-strong`, title `remy@portfolio: ~` derived from the first name — display only), body on `--surface`, text in JetBrains Mono. It is a decorative composition: the bar and prompt characters are `aria-hidden="true"`.
- Content, top to bottom, each line prefixed by a `$` prompt in `--accent`:
  - `whoami` → the name; `cat role.txt` → the role; `cat intro.txt` → the intro paragraph (static, selectable text); then a final prompt line holding the **typed phrase** and cursor.
- Typed phrase source: `site.typedPhrases` (≥1 phrase, enforced by type). **Initial state:** the first phrase shown in full on load.
- **Sequence (plays once), unchanged from v0.6:** hold 2s → delete (35ms/char) back to the text shared with the next phrase (common prefix trimmed back to a word end) → pause 0.5s → type the rest of the next phrase (70ms/char) → repeat until the last phrase, which is held indefinitely. With one phrase it simply holds. Phrases carry their own terminal punctuation. Current sequence: `I build reliable software for the web.` → `I build reliable applications.` → `I build fun video games.` → `I build.`
  - **Rationale:** deleting only to the shared prefix reads as the author revising the sentence; ending on a settled line avoids a perpetual loop.
- **Cursor:** a CSS-drawn block (`inline-block`, `width: 0.6em`, `height: 1em`, `--accent`), not a glyph. Blinks at a 1s period while motion is active; solid when paused or under reduced motion.
- **Stable height:** all phrases are rendered stacked in the same grid cell, invisible except the animated one, so the container height never changes. No JS measurement.
- **Screen readers:** the animated element and sizers are `aria-hidden`; a visually-hidden element holds all phrases joined by spaces. The name, role and intro are exposed once (the window's duplicate display lines are hidden from assistive tech where they repeat the left column; the intro is read from the window).
- **Pause/resume semantics** unchanged: pausing completes the current phrase instantly; resuming starts a fresh 2s hold, then continues; reduced motion turning on behaves like pause but shows the first phrase; turning off resumes from the displayed phrase with a 2s hold unless the user had pressed pause. Pause state persists across reduced-motion changes within the page load.

#### 4.2.3 Pause control
- A `<button>` reading `[ pause motion ]` / `[ resume motion ]` (brackets drawn in CSS, because the kit flags bracketed text as unfinished content), `--text-muted`, small mono text, with `aria-pressed`, at the right of the terminal window's title bar.
- When pressed: the typed phrase behaves per §4.2.2; the cursor stops blinking; the border sweep (§4.2.1) pauses too, freezing in place; resuming continues from that angle. One control stops everything in the hero that moves.
- Per page load (not persisted). Hidden while reduced motion is on.

### 4.3 Projects
- `<section id="projects">`, heading `> projects`, on the plain page ground.
- This section **grows with its content** (open cards make it taller) instead of keeping the kit's fixed one-or-two-screens height, which would clip an open card on wide screens. Known and accepted deviation from the kit's rhythm rule (§8).
- Grid of cards: **1 column on mobile, 2 on desktop**, `align-items: start`. Count = whatever the content file holds (1 to ~12), in file order.
- **Card** (one style site-wide, kit card look, sharp radius, hover lifts 2px and the border becomes `--border-strong`): same structure as v0.6 — a **terminal-window frame** (28px title bar with three dots and `project.displayUrl`, or `~/{id}` when absent; the bar is `aria-hidden`) over a fixed **16:10** screenshot (`width=1200 height=750`, `loading="lazy"`, alt from content, `--bg` placeholder panel with the title when there is no image); then the header-row toggle button, summary, static tech tags, and the expandable details panel.
- Toggle and panel behaviour is unchanged from v0.6: `<h3><button aria-expanded aria-controls>` is the only accessible toggle (index `01`, title, `[+]`/`[−]`); clicking the frame also toggles (mouse only, not focusable); the details panel animates with `grid-template-rows 0fr → 1fr` (≤200ms, instant under reduced motion), the inner element has `overflow: hidden; min-height: 0`, and `inert` while collapsed; details: Problem, My contribution, Outcome, optional Highlights, then Source (GitHub) and Live demo links. Multiple cards may be open.

#### 4.3.1 Case study
- `<section id="case-study">`, heading `> case study`, a direct child of `main`, on the kit's `bg-halo` ground. Not in the header nav (reached by scrolling).
- It walks through the **first project in the content file** (`projects[0]`) in three steps using the kit's `pinned-chapters` moment: **Problem**, **My contribution**, **Outcome** — a title and the project's text for each, with one picture per step at the right. While the section is in view it holds for two screens of scroll and the steps open one at a time with a short crossfade between pictures.
- **Pictures:** new optional content field `Project.walkthroughImages?: { src: string; alt: string }[]` (up to three, in step order, 1200×750 WebP in `public/projects/`). Missing steps fall back to the project's `image`, or to a `--bg` panel with the step title.
- **Not pinned** on phones or under reduced motion (kit rule): each step is a static row with its picture under it. All text is real HTML, readable without the motion.
- The moment is initialised once after React renders; it must tolerate React StrictMode's double mount.
- **Kit conflict, resolved:** the section's `bg-halo` ground makes it a centred, padded grid, which confines the sticky one-screen stage to its own row and pushes it 450px down, collapsing the two-screen hold. The section is therefore a block container with its content at the start and no padding while the moment is live, so the stage pins for the full two screens (verified: pinned across 900px of scroll, steps 1 → 2 → 3).

### 4.4 GitHub Activity
Specification unchanged from v0.6 — heading `> activity`, total line, focusable scroll container, SVG calendar with weekday placement, `level-0…4` classes, native `<title>` tooltips, month labels with the collision rule, weekday labels, SVG legend, "Updated" note, "View on GitHub" link, `unavailable` fallback — with these changes: the section sits on the kit's `bg-dots` ground (dots in the margins only, never behind the calendar); from 1024px the total is shown as a large accent-coloured figure beside the calendar (`1,234` with `contributions in the last year` under it), stacked above it below that; the section is at least one screen tall; calendar labels use JetBrains Mono. The visible text still reads `1,234 contributions in the last year`.

### 4.5 Contact (closing section)
- **Contact and Footer are one element**: the kit's `footer.closing#contact` (the close and the directory are a single last screen), on the lit ground (`footer--statement`). §4.5 is its first row and §4.6 its second. Its first row is the kit's `close-word` closing: the heading `> contact` and one short inviting line beside a primary **Email me** button, then **the author's name** set across the full width in the display face (the kit's "word"; its size is computed from the page width and the length of the name, because the kit sizes it for short names and would clip a long one). The three contact links, each with icon **and the actual value as visible, selectable text** (email `mailto:`, LinkedIn display URL, `github.com/<username>`), are in the second row's Contact column. Accepted spam-scraping risk unchanged.

### 4.6 Footer
- Second row of the closing element: the logo and the last typed phrase (`site.typedPhrases` last item, currently `I build.`) as the lede; a Contact column (§4.5); a Sections column (Projects, Case study, Activity); then `© <current year> <name>` and a "source" link to `site.sourceRepoUrl`.

### 4.7 External links (all sections)
Unchanged: every `http(s)` link leaving the site and the Résumé link uses `target="_blank" rel="noopener noreferrer"` plus visually-hidden "(opens in a new tab)". `mailto:` links are exempt.

### 4.8 404 page
Unchanged in function: `public/404.html`, standalone, no JavaScript, `> 404`, "This page doesn't exist.", link to `/`. Inline CSS uses the same colours; fonts `/fonts/…` via `@font-face` (JetBrains Mono for the heading, Manrope for the sentence).

## 5. Architecture

### 5.1 Stack & tooling
- **Vite + React 19 + TypeScript** (strict), client-rendered static single-page build; no router, SSR or prerendering; React pinned to `^19`.
- **Styling:** the **design kit** — a local set of CSS/JS assets (system tokens, layout, motion layer, backgrounds, one moment) — copied **in part** into `public/assets/` and loaded as plain files (`<link>` and module `<script>` in `index.html`). Only what §3.7 deals is copied (system, layout, motion, backgrounds, the `pinned-chapters` moment, their shared helpers; the effect files are not copied, because nothing on the page uses a kit effect) to keep weight down. CSS Modules remain for component-specific rules (terminal window, calendar, cards); the generated token block replaces `tokens.css` and is placed after the kit's stylesheets. The global stylesheet still holds `@font-face`, `color-scheme` and `::selection`.
- **React ↔ kit:** the kit's scripts enhance elements by data attributes and class names. They run **after React has rendered** (a mount effect, once) and must not be run twice (StrictMode). Elements the kit manages are not conditionally re-rendered by React.
- **Runtime dependencies:** `react`, `react-dom`, `@vercel/analytics` — unchanged; the kit is committed files, not an npm dependency. **Dev dependencies:** unchanged (the `react-ts` template set). Any other dependency requires a doc change.
- **Kit checkers** (copy lint, layout check, consistency, performance, finish gate) are run from the kit's own scripts folder, which lives outside the repository on the author's machine; their working files stay out of git (via `.git/info/exclude`, not `.gitignore`). They are checks, not build steps.
- **No trace of tooling in tracked files:** kit files copied into the repository are checked for tool or vendor names in comments before commit and stripped if present.
- **Analytics, Node 24 (`engines`, `.nvmrc`), npm + committed lockfile, linting (Node-globals block for `scripts/**/*.mjs` and `api/**/*.js`, `@ts-check`), TypeScript projects, and the npm scripts table:** unchanged from v0.6.

| Script | Command |
|---|---|
| `fetch-contributions` | `node scripts/fetch-contributions.mjs` |
| `fetch-resume` | `node scripts/fetch-resume.mjs` |
| `predev`, `pretypecheck` | `npm run fetch-contributions` |
| `prebuild` | `npm run fetch-contributions && npm run fetch-resume` |
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `typecheck` | `tsc -b` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |

### 5.2 Content model
All author-editable content lives in `src/content/` and `public/`, as in v0.6 (`Site` type unchanged). The `Project` type gains one optional field:

```ts
export type Project = {
  id: string;               // unique; lowercase letters, digits, hyphens
  title: string;
  summary: string;
  tech: string[];
  image?: { src: string; alt: string };           // 1200×750 WebP in public/projects/, ≤150KB
  walkthroughImages?: { src: string; alt: string }[]; // NEW: up to 3, step order; same format (§4.3.1)
  displayUrl?: string;
  links?: { source?: string; demo?: string };
  problem: string;
  contribution: string;
  outcome: string;
  highlights?: string[];
};
```

Derived values (`derived.ts`), dev-only project-id validation, the résumé filename and the build-time résumé fetch (`fetch-resume.mjs`, soft failure) are unchanged from v0.6.

### 5.3 Contribution data (build-time)
Unchanged from v0.6: `scripts/fetch-contributions.mjs`, the failure table, `ContributionData` schema, token scope, freshness note, and the Vercel Cron daily rebuild (`api/rebuild.js`, `vercel.json`).

### 5.4 File structure
```
api/
  rebuild.js
public/
  <Name>-Resume.pdf     fallback copy; overwritten at build
  404.html
  og-image.png  favicon.svg  apple-touch-icon.png  robots.txt
  assets/               NEW: the part of the design kit in §5.1
  fonts/                jetbrains-mono-latin-400/700.woff2, manrope-latin-variable.woff2, OFL.txt (both faces)
  projects/             screenshots and walkthrough images
scripts/
  fetch-contributions.mjs  fetch-resume.mjs
src/
  main.tsx  App.tsx
  content/              types.ts, site.ts, projects.ts, derived.ts
  data/                 contributions.json (generated, gitignored), contributions.types.ts
  styles/               generated token block + global CSS
  components/           Header, Hero, HeroTerminal, TypedText, MotionToggle, Projects,
                        ProjectCard, BrowserFrame, CaseStudy, Activity, ContributionCalendar,
                        Contact, Footer, VisuallyHidden
                        (MatrixRain removed)
index.html  vite.config.ts  vercel.json  .nvmrc
```

### 5.5 Metadata
Unchanged from v0.6, with one addition: `index.html` also links the kit stylesheets and scripts from `public/assets/`, and font preloads cover Manrope and both JetBrains Mono files. The theme-color remains `#0a0e0a`. The no-JavaScript/SEO limitation is unchanged.

## 6. Accessibility & performance requirements
- Semantic landmarks, one `h1`, headings one level at a time.
- All interactive elements keyboard-operable with a visible focus ring: 2px solid `--accent`, 2px offset (no glow).
- Decorative elements (hero terminal chrome and prompts, `>` prompts, `[+]` indicators, frame bars, placeholder panels, legend) are `aria-hidden`; images have alt text.
- Motion: reduced-motion behaviour and pause control per §3.5.
- Lighthouse (mobile) ≥ 90 for Performance and Accessibility on the deployed site. **Risk:** the kit adds weight; mitigations are copying only the parts used (there is no WebGL anywhere on the page), and the still fallback for the moment on phones. If the target cannot be met, that is a doc decision, not a silent drop.

## 7. Hosting & deployment
Unchanged from v0.6. The redesign is developed on the branch `redesign/terminal-pop`; Vercel builds it as a preview, and it reaches production only by merging to `main`.

## 8. Acceptance criteria
v1 (redesign) is done when:
1. `npm run lint`, `npm run typecheck` and `npm run build` pass on a fresh clone with no token set.
2. Every section in §4 is present and behaves as specified, including keyboard operation, the pause control (it stops the typed phrase and the border sweep) and the case-study fallbacks.
3. None of the exclusions in §3.1 appear; the matrix rain code is gone.
4. With a valid token the calendar renders; with no token the fallback renders; with an invalid token the build fails.
5. The contribution total matches `github.com/remyj4556`; if not, that is a doc change.
6. The kit's checkers (copy lint, layout check at 1440/1024/820/768/390, consistency, performance, finish gate) run on the built page. Findings are fixed unless they fall in one of these **accepted waivers**, each with its reason: (a) caused by the placeholder content of §9 (solid-colour screenshots, lorem text, the unavailable-activity fallback without a token) — re-run when real content arrives; (b) the kit's one-or-two-screens-per-section rule on the Projects section, which grows with open cards (§4.3), and the section starts that follow from it; (c) `#root` — React's mount element sits above the header (the page is client-rendered; it does not change the visible structure); (d) card interior text not on the container's left lines and the card frame's hairline — bordered, padded cards are part of the design; (e) the h1 being a personal name rather than a product description, and `> prompt` headings — the terminal conceit (§3); (f) the analytics script 404 outside Vercel (§5.1: it only runs there); (g) the perf script's below-fold-images-not-lazy finding — the kit switches `loading="lazy"` images to eager once the page has loaded, so a later swap never shows an empty frame (first paint stays lazy) — and its oversized-image finding for the 1200×750 screenshots the content model specifies (no `srcset` in v1).
7. Lighthouse targets in §6 are met on the deployed preview.
8. **The author reviews screenshots** at 1440px and 390px, including one project card expanded and the case study mid-scroll. Deviations from this doc are fixed; requests that change the design go through the doc process first.

## 9. Placeholder content
As in v0.6 (four sample projects, one without an image, one without links, one without `displayUrl`; placeholder intro, résumé, `og-image.png`, `apple-touch-icon.png`), plus: the first project carries three `walkthroughImages`: 1200×750 WebP panels of abstract UI blocks (a list, code lines, a chart) in the site's greens, with no text, so the case study's crossfade is visible. The author has said real content comes later; the layout must hold with the placeholders, and replacing them requires editing only `src/content/` and `public/`.

## 10. Open questions
Resolved by the author (first draft):
1. **Gradients and glow** — lifting the gradient ban for the two named grounds is correct; glow ban narrowed (§3.1).
2. **Proportional type** — accepted (§3.3).
3. **Case study duplicates card text** — accepted; the first project's card keeps its details panel.
4. **Pausing the effect** — superseded: the effect is gone; the one pause control stops the typed phrase and the border sweep (§4.2.3).

5. **React and the kit** — resolved: the kit's scripts are imported once, after a synchronous first render (`flushSync`), from `main.tsx`; the scroll moment and the menu initialise. React must not re-render elements the kit manages: the header, the case study and the hero frame hold no state.
6. **Does the gradient settle** — superseded: there is no ground effect; the border sweep is pure CSS and pausable (§4.2.1).

Still open: none.

## 11. Revision log
- **v0.1** — Initial draft.
- **v0.2** — Author's reference feedback: all-JetBrains-Mono; floating header with `<FirstName />` logo and outlined Résumé button; hero restructured, About merged in; in-place expanding project cards in a 2-column grid with browser-frame screenshots; hard exclusions; typed phrase loops.
- **v0.3** — Domain `remyjarrett.dev`; repo public; contribution calendar kept.
- **v0.4** — Goldfish round 1: static role; WCAG 2.2.2 pause control; rain and typing fully specified; accessible card toggle and panel; calendar spec and data schema; metadata from `site.ts`; build fails on token errors; Vercel Cron refresh; tooling pinned.
- **v0.5** — Added Vercel Web Analytics.
- **v0.6** — Goldfish round 2: CSS cursor and SVG legend (glyphs missing from font subset); fonts committed as files and preloaded (dropped `@fontsource` dependency); header `fixed` with hero padding (sticky pushed hero below the fold); rain uses ResizeObserver and only reinitialises on column change, reads tokens via `getComputedStyle`, hard-clears columns on restart, continues on resume; strict GraphQL failure rules; `weekday` added to schema for row placement; scrollable calendar region focusable; `color-scheme: dark`; type/spacing/radius scale; pause/resume and reduced-motion semantics; pause control first in hero; mobile menu panel spec and focus behaviour; logo accessible name; dropped equal-card-height claim; month-label collision rule, pinned en-US date/number formats, CSS-class fills, calendar `role="img"`; "Updated <date>" note; LinkedIn display derived; `mailto:` exempt from new-tab rule; real TS types with `satisfies` and non-empty `typedPhrases`; derived URLs; dev-only project id validation; decorative frame parts `aria-hidden`; `min-height: 0` for collapse; React 19 pinned; token scoped to Production + Preview; cron handler signature, GET, constant-time compare, imprecise timing; contribution total check added to acceptance; Node scripts linted with `@ts-check`; tsconfig include for plugin imports; dev-server restart note; screenshots 1200×750 ≤150KB; 404 page, apple-touch-icon, theme-color, robots.txt; hover and selection colours; `--cal-0` lightened and claim softened; scroll-margin corrected.
- **v0.7** — "Terminal-pop" redesign experiment (branch `redesign/terminal-pop`): restraint replaced by one committed concept with a fixed motion budget; matrix rain removed in favour of a `grain-gradient` ground behind a hero terminal window (typed phrase moved into it); hero layout `collage`; Manrope added beside JetBrains Mono (both self-hosted); design kit adopted as the styling layer (partial copy into `public/assets/`); new Case study section with a `pinned-chapters` moment and `Project.walkthroughImages`; dealt nav, close, footer, buttons and grounds recorded in §3.7; exclusions revised (gradients only on named grounds; no glass, no violet); kit checkers added to acceptance; open questions recorded in §10. Author decisions applied: gradient ban lifted for the two named grounds, proportional type accepted, case-study text duplication accepted, pause control does not stop the gradient. Implementation findings folded in: pause control moved into the terminal title bar; kit pause disc covers the gradient; `--text-muted` lightened; Contact and Footer merged into the kit's single closing element; footer name sized from the page width; Projects and Activity sections grow past the kit's fixed screen height; waivers listed in §8. The hero's gradient ground was scrapped: the terminal now fills its frame with nothing behind it and its border is a green gradient sweeping round the edge (CSS only; no WebGL; the kit's effect files removed). Browser audit fixes: terminal centred in its frame; case-study pinned hold repaired; 44px tap targets on phones; hero fits the first screen at phone and tablet widths; 404 page moved to the new fonts and muted colour.
