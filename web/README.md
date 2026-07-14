# Pryes Brewing — website playground

A greenfield homepage for Pryes Brewing Company, built to show collaborators the
direction and to be the groundwork for moving off SquareSpace. Built on
**Next.js (App Router) + Tailwind v4 + shadcn/ui**, exported as fully static HTML
and deployed to GitHub Pages.

The design system is derived 1:1 from the 2026 brand guide (`../brand.json`):
Regal Burgundy / Beer Foam / Beige palette, Source Serif 4 · Poppins · Barlow
Condensed type, and the crest + laurel motifs.

## Develop

```bash
cd web
npm install
npm run dev      # http://localhost:3000/pryes-brewing-brand-guidelines/
```

The dev/prod URL carries the `/pryes-brewing-brand-guidelines/` base path because
Pages serves this as a project site. See `next.config.ts`.

## Build

```bash
npm run build    # static export -> web/out/
```

## Where things live

- `src/app/globals.css` — the design tokens (brand palette + type mapped onto
  shadcn's CSS variables). This is the heart of the design system.
- `src/lib/site.ts` — brand copy, taproom/business details, and the `asset()`
  base-path helper. Single source of truth for the SEO layer.
- `src/lib/beers.ts` — the flagship lineup data.
- `src/components/` — page sections and the shadcn `ui/` primitives.
- `SEO-MIGRATION.md` — the SquareSpace → new-site cutover plan.

## Deploy

GitHub Pages serves this repo from the `main` branch root (legacy mode), so the
built site is committed to the repo at `/homepage` and published at
`https://ux-bl-ui.github.io/pryes-brewing-brand-guidelines/homepage/`. The
existing brand-guide site stays at the repo root, untouched.

To publish a change:

```bash
cd web
npm run build                 # base path is /pryes-brewing-brand-guidelines/homepage
rm -rf ../homepage && cp -R out ../homepage
git add ../homepage web && git commit -m "Update homepage" && git push
```

A cleaner CI deploy (build on push, no committed output) is possible by switching
**Settings → Pages → Source** to **GitHub Actions**; skipped for now to avoid
changing repo settings.

## Accessibility gate

```bash
npm run test:a11y   # builds, then runs axe-core over / and /design-system/
```

Runs axe-core (WCAG 2.1 A/AA) against the static build in a headless browser and
fails on any color-contrast issue or serious/critical violation. It also runs in
CI on every push and pull request (`.github/workflows/a11y.yml`), so regressions
are caught before they ship. `npm run a11y` runs the check against an existing
build without rebuilding.

## Migrating to a real domain

Set `BASE_PATH=""` at build time and point DNS. Every URL collapses from the
Pages subpath to the domain root with no other code changes.
