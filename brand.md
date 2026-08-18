# Pryes Brewing — Brand (agent reference)

Token-lean, complete brand knowledge base. Read this one file to use the Pryes
brand correctly; no need to open the 55-page PDF or the HTML site.
Machine-readable twin: [`brand.json`](brand.json). Source of truth:
`assets/documents/PRYES-Brand-Guide-2026.pdf`. Human site:
`pryes-brand-guidelines.html` (password `pryes2026`). All paths are relative to
repo root and verified to exist.

## Identity
- **Tagline:** Trust Your Taste
- **Mission:** To help every Minnesotan find their favorite beer.
- **Vision:** To be a Top 5 Minnesota brewery.
- **Mantra (internal):** Let's find your favorite.
- **Statement:** Pryes is a Minnesota craft brewery with a beer for everyone.
- **Positioning:** the beer-for-everyone brewery · for Minnesotans, by Minnesotans (the New Glarus of MN) · enjoy-it-anywhere, never a gamble.

## Colors
Core (name · hex · rgb · cmyk · role):

| Name | HEX | RGB | CMYK | Role |
|---|---|---|---|---|
| Beer Foam | `#FFF1E4` | 255,241,228 | 0,5,9,0 | primary light bg / reversed text · PMS 9224 C |
| Beige | `#EBCFB8` | 235,207,184 | 7,18,26,0 | tonal layering · PMS 9224C/9184U |
| Regal Burgundy | `#3E0F23` | 62,15,35 | 53,89,58,67 | primary dark bg / text · PMS 4975 C |
| Miraculum Green | `#213B1E` | 33,59,30 | 77,49,89,60 | secondary |
| Miraculum Off-Black | `#121A12` | 18,26,18 | 74,62,71,80 | tonal / packaging shade |
| Burgundy Off-Black | `#101019` | 16,16,25 | 79,73,59,80 | tonal / text on dark |

Packaging accents (full · shade): Haze-steria Orange `#E3884D`/`#BE442A` · Pragmatic Blue `#328ACA`/`#024060` · Citrus Yellow `#E8BC20`/`#82632B`.

Rules: backgrounds = Burgundy / Beer Foam / Beige. Text on light = Burgundy or Burgundy Off-Black; on dark = Beer Foam or Beige. Miraculum Green pairs with Beer Foam, Beige, or Miraculum Off-Black. Packaging shades ≈ 30% darker than full.

## Typography
- **Print faces:** Superclarendon (serif, display+body) · Gotham (sans) · Alternate Gothic No.2 D (condensed caps).
- **Web substitutes:** Superclarendon→**Bitter** (Clarendon-style slab) · Gotham→**Poppins** · Alternate Gothic→**Barlow Condensed**. MS Office fallbacks: Georgia (serif), Arial (sans). Body copy is set in the serif (Bitter), matching the print hierarchy; the sans is for callouts, captions and links only.
- **Hierarchy** (class · face · leading · tracking · case):
  - Header · Superclarendon Regular · 100% · 0 · Title
  - Subhead · Alternate Gothic · 75% · 175–200 · All caps
  - Body · Superclarendon Light · 66.67% · 0 · Sentence
  - Callout · Gotham Light · 66.67% · 150 · All caps
  - Links · Gotham Medium · 75% · 150 · All caps
- Leading rules: Header 1:1; Subhead & Paragraph 2:3.

## Voice & tone
- **Is:** warm · down-to-earth · clear · relaxed · knowledgeable · confident · welcoming · self-aware & lightly witty.
- **Is not:** exclusive · trendy · corporate · loud · pretentious · goofy/gimmicky · edgy · abstract.
- **Tone by channel:** website=confident/clear · social=playful/conversational · sales=polished/trustworthy · support=calm/empathetic · campaigns=bold/expressive.
- **Writing rules:** active voice; inclusive; Oxford comma; commas in numbers >3 digits; spaces around em dashes ( — ); ALL CAPS & "!" sparingly; ampersands only in headings; emojis social-only, one max.
- **Approved lines (verbatim):** "Bold enough for IPA fans, smooth enough for everyone else." · "If you like sours, you'll like this. (If you don't like sours? You might still like this.)" · "Back for a good time, not a long time." · "Minnesota born. Minnesota raised."

## Logo
- **Primary mark:** the PRYES wordmark. Marks available: WORDMARK, WORDMARK+TAGLINE, CREST+WORDMARK+TAGLINE, CREST-NOBORDER(+WORDMARK+TAGLINE), CREST-CIRCLE01/02, CREST-FULL, MN-ICON, P-WATERMARK.
- **Colorways:** BEERFOAM, BURGUNDY, BURGUNDY-OFFBLACK, WHITE, BLACK. Match mark to ground for contrast.
- **Clear space:** ~½ wordmark height; crest ~¼ coin height.
- **Min size:** Wordmark 24px/0.5in · Wordmark+Tagline 42px/0.5in · Crest 48px/0.675in · Crest-Circle (coin) 72px/1in · P-Monogram 48px/0.675in · Primary Lockup 64px/0.667in.
- **Misuse (never):** drop shadow/effects · rearrange elements · alter/retype the wordmark · stretch/condense · gradients/non-brand colors · rotate · busy/low-contrast backgrounds.

## Patterns & shapes
- **Laurels** = primary texture (from the crest). Other patterns: CREST, CREST-TAGLINE, WORDMARK — used sparingly, 45° or horizontal.
- Keep tonal (e.g. Beige laurels on Beer Foam; Off-Black-Burgundy on Regal Burgundy). Reduce to ~60% opacity if it competes.
- **Container shapes:** 15 per colorway (BEERFOAM, BEIGE, BURGUNDY OFFBLACK, MIRACULUM OFFBLACK, REGAL BURGUNDY). Swoopy shapes go full-bleed; symmetrical elements stay within margins.

## Assets — how to fetch
Path shape: `assets/{logos|patterns|shapes}/{svg|png}/{COLORWAY}/{file}`. Filenames
vary (spaces, `+`, colorway suffixes), so **for the exhaustive, exact file list use
[`brand.json`](brand.json) → `assets.*.by_colorway`.** Highest-use files, ready to use:

- Wordmark (dark bg): `assets/logos/svg/BEERFOAM/PRYES-WORDMARK-BEERFOAM.svg`
- Wordmark (light bg): `assets/logos/svg/BURGUNDY/PRYES-WORDMARK-BURGUNDY.svg`
- Primary lockup (light bg): `assets/logos/svg/BURGUNDY/PRYES-CREST+WORDMARK+TAGLINE-BURGUNDY.svg`
- Primary lockup (dark bg): `assets/logos/svg/BEERFOAM/PRYES-CREST+WORDMARK+TAGLINE-BEERFOAM.svg`
- Crest / coin: `assets/logos/svg/BURGUNDY/PRYES-CREST-CIRCLE01-BURGUNDY.svg`
- Laurel pattern: `assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg`
- Full brand guide: `assets/documents/PRYES-Brand-Guide-2026.pdf`

Each logo/pattern ships as SVG (`assets/.../svg/...`) and PNG (`.../png/...`). PNG
raster equivalents mirror the SVG names. Note: pattern SVGs use folder `MIRACULUM`;
pattern PNGs use folder `MIRACULUM GREEN`.

## Notes
- Web renders use the sanctioned Google-Font substitutes above (Superclarendon/Gotham/Alternate Gothic are licensed). Do not embed the licensed print faces on the web.
- Large print-production files (cooler clings ~97MB, posters, patterns PDF) are **not** bundled here; find them in `PRYES/2026/PRYES-BRAND-ASSETS`.
- Superseded: an earlier green + Asap Condensed direction. Do not restore it — burgundy + Bitter (Clarendon slab) is final.
