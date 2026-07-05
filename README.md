# SMPWeapons Page

Static GitHub Pages-ready documentation site for SMPWeapons. Redesigned as a single docs shell (sticky sidebar, top search, weapon browser) — no build step.

## Publish

1. Create a GitHub repository named `smpweapons-page`.
2. Copy these files to the repository root.
3. Push to `main`.
4. In GitHub, open **Settings → Pages**.
5. Set **Source** to **Deploy from a branch**.
6. Select branch `main` and folder `/root`.

No build command is required. 

## Files

- `index.html` — complete single-page documentation site.
- `404.html` — matching not-found page.
- `assets/styles.css` — dark, docs-style design system (CSS variables, no framework build step).
- `assets/app.js` — Alpine.js app: global search, weapon search/filter, active-section tracking, copy-to-clipboard on code blocks, mobile nav.
- `assets/logo.svg` — local SVG icon.
- `data/weapons.json` — weapon index extracted from SMPWeapons YAML resources (unchanged from source extraction: 26 total, 21 enabled, 5 disabled examples).
- `.nojekyll` — disables Jekyll processing for predictable static hosting.

## Stack

Bootstrap 5.3 (CDN, utility classes only) + Bootstrap Icons + Alpine.js 3 (CDN, no build). All colors/spacing driven by CSS variables in `assets/styles.css`.

## Redesign notes

- Docs-site layout: sticky left nav with active-section highlighting, sticky top bar with instant search (press `/`), sticky-scoped content column.
- Weapon browser: live search + state/source filters, backed directly by `data/weapons.json` (no content duplicated in HTML).
- Copy-to-clipboard button on every code block.
- Content, commands, permissions, and YAML examples are unchanged from the original source-grounded extraction — only presentation was redesigned.
