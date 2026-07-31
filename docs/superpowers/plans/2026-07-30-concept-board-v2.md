# Concept Board v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Concept Board zero-training usable, add a real photo library, and export each kept concept as a designer-ready ZIP package.

**Architecture:** Everything lives in the single static page `concept-board.html` (inline CSS + JS, no build step). New on-disk pieces: `assets/photos/` (photo files + `photos.json` manifest + README) and the JSZip CDN script tag. The poster engine gains a size system (11×17 / 18×24) via two scale factors (KX, KY) applied to the existing 1800×2400 design coordinates.

**Tech Stack:** Plain HTML/CSS/JS, SVG poster rendering, JSZip 3.10.1 (CDN), Puppeteer or chrome-devtools MCP for screenshot verification, `python3 -m http.server` for localhost.

**Spec:** `docs/superpowers/specs/2026-07-30-concept-board-v2-design.md`

## Global Constraints

- **Never use an em dash** in any copy. Plain dash only; public copy rewrites the sentence instead.
- **Commit messages:** no `Co-Authored-By` trailer, ever.
- **No person names in the UI or copy.** The tool talks about the concept and the package, never about who receives it.
- **Colorblind-safe:** pin/lock/selected states always carry icon + text + border, never color alone.
- Single-file page: all CSS in the `<style>` block, all JS in the `<script>` block of `concept-board.html`.
- Password gate, occasions row (disabled "soon" buttons), and overall visual style stay as they are.
- Default size is **11×17** (the sales team's standard BOTM poster).
- Never delete existing files; the old placeholder behavior remains as fallback.
- Verification uses the project's screenshot loop: serve on localhost, screenshot to `temporary screenshots/screenshot-n.png` (next free n, never overwrite), read the PNG back, compare, at least 2 rounds.

## Testing model (read first)

There is no JS test harness in this repo and the page is one static file. Each task therefore ends with **concrete verification steps** instead of unit tests: string checks (`grep`), live browser checks (evaluate JS in the page console), and the screenshot loop. Run them exactly as written before committing.

Start a server once and leave it running:

```bash
cd ~/pryes-brewing-brand-guidelines && python3 -m http.server 8080
```

The page has a password gate backed by `sessionStorage`. Every browser session used for verification must first run:

```js
sessionStorage.setItem('pryes_auth', '1')
```

(then reload). With Puppeteer use `page.evaluateOnNewDocument(() => sessionStorage.setItem('pryes_auth','1'))` before `goto`. With the chrome-devtools MCP: navigate, evaluate the line above, navigate again.

Screenshot helper (write once to the scratchpad, reuse for every round):

```js
// shoot.js — usage: node shoot.js <output-path>
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch();
  const p = await b.newPage();
  await p.evaluateOnNewDocument(() => sessionStorage.setItem('pryes_auth', '1'));
  await p.setViewport({ width: 1280, height: 1800 });
  await p.goto('http://localhost:8080/concept-board.html', { waitUntil: 'networkidle0' });
  await p.screenshot({ path: process.argv[2], fullPage: true });
  await b.close();
})();
```

If Puppeteer is not installed (`node -e "require('puppeteer')"` fails), use the chrome-devtools MCP (`new_page` → `evaluate_script` for the auth line → `navigate_page` → `take_screenshot`) and save the PNG into `temporary screenshots/` manually.

---

### Task 1: Plain-language copy pass + 3-step strip

**Files:**
- Modify: `concept-board.html` (lede, occasions area, toolbar buttons, helper note, card buttons, count, footer)

**Interfaces:**
- Produces: CSS class `.cb-steps` (the how-it-works strip); button ids unchanged (`cb-deal`, `cb-release-holds`, `cb-export`); data-act values unchanged (`hold`, `keep`). Later tasks rely on ids/data-acts staying the same - only visible text changes.

- [ ] **Step 1: Rewrite the lede** - replace the `<h1>` + `<p>` inside `.tool-lede` with:

```html
<h1>Poster ideas, fast.</h1>
<p>Fill in the details once and the board lays out four poster ideas built from the 2026 brand kit. Shuffle until something clicks, pin what you like, and download the winner as a ready-to-finalize package.</p>
```

- [ ] **Step 2: Add the 3-step strip** directly after the closing `</div>` of `.tool-lede`:

```html
<ol class="cb-steps" aria-label="How this works">
  <li><span class="cb-step-n">1</span> Fill in the details</li>
  <li><span class="cb-step-n">2</span> Shuffle until something clicks</li>
  <li><span class="cb-step-n">3</span> Download the winner as a package</li>
</ol>
```

And this CSS (place after the `.cb-note` rules):

```css
.cb-steps { display: flex; flex-wrap: wrap; gap: 10px 26px; list-style: none; margin: 0 0 26px; padding: 14px 18px; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,0.5); }
.cb-steps li { display: flex; align-items: center; gap: 10px; font-family: var(--condensed); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; font-size: 0.85rem; color: var(--ink); }
.cb-step-n { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--burgundy); color: var(--beer-foam); font-size: 0.78rem; flex: none; }
```

- [ ] **Step 3: Rename the toolbar buttons.** `#cb-release-holds` text becomes `Unpin everything`. `#cb-deal` keeps its refresh SVG icon and its label becomes `Shuffle`.

- [ ] **Step 4: Rewrite the helper note** (`.cb-note`):

```html
<p class="cb-note"><b>Shuffle</b> swaps out every idea you have not pinned. On each card, tap <b>Image</b>, <b>Layout</b>, or <b>Color</b> to swap just that piece, or tap its little lock to keep that piece while everything else shuffles. <b>Pin</b> a card to keep the whole thing exactly as it is.</p>
```

- [ ] **Step 5: Rename card actions.** In `cardHTML()`: the hold button label becomes `' Pinned'` / `' Pin'` (icon stays); the keep button text becomes `Pick this one →`. In the held badge span, `Held` becomes `Pinned`. In `renderBoard()`, the count line becomes `' pinned · '` instead of `' held · '`. Add `title` tooltips: hold button `title="Keep this whole card when you shuffle"`, keep button `title="Choose this concept and get the finalize-ready package"`.

- [ ] **Step 6: Update spotlight + footer copy.** Spotlight eyebrow stays `Selected concept`. Footer `Prototype notes` sentence about hero images will be rewritten in Task 3; leave it for now. Check the whole file for em dashes in visible copy (`grep -n "—" concept-board.html`) - none may remain in text you touched (the CSS comment block dashes are fine to leave).

- [ ] **Step 7: Verify.**

```bash
grep -c "Reroll unheld\|Release all holds\|Keep this" concept-board.html   # expect 0
grep -c "cb-steps" concept-board.html                                      # expect >= 2 (CSS + HTML)
```

Screenshot round 1: `node shoot.js "temporary screenshots/screenshot-<next n>.png"`, read it back, confirm: strip renders as one row of three numbered steps, buttons read Shuffle / Unpin everything, cards read Pin / Pick this one, nothing clips or overlaps.

- [ ] **Step 8: Commit**

```bash
git add concept-board.html
git commit -m "Concept board: plain-language copy and 3-step how-it-works strip"
```

---

### Task 2: Size system (11×17 default, 18×24 option)

**Files:**
- Modify: `concept-board.html` (poster engine constants, all three layout functions, `buildPosterSVG`, content panel HTML, CSS `aspect-ratio`)

**Interfaces:**
- Consumes: nothing from Task 1 beyond unchanged ids.
- Produces: globals `SIZES` (array), `SIZE` (current size object `{key,label,slug,w,h,inW,inH,signType}`), `applySize()`, mutable `W,H,M` plus scale factors `KX,KY`; layout functions with new signature `LAY[id](c, fam, card)`; `buildPosterSVG(card, photoHref)` (photoHref used by Task 5, pass-through for now). Task 5 reads `SIZE.signType` and `SIZE.slug`.

- [ ] **Step 1: Replace the fixed dimensions.** Swap `const W = 1800, H = 2400, M = 150;` for:

```js
const SIZES = [
  { key:'s1117', label:'11 × 17 in', slug:'11x17', w:1100, h:1700, inW:'11in', inH:'17in', signType:'Standard BOTM Poster 11x17' },
  { key:'s1824', label:'18 × 24 in', slug:'18x24', w:1800, h:2400, inW:'18in', inH:'24in', signType:'Poster 18x24' }
];
let SIZE = SIZES[0];
let W, H, M, KX, KY;
function applySize() {
  W = SIZE.w; H = SIZE.h;
  KX = W / 1800; KY = H / 2400;
  M = Math.round(150 * KX);
  document.documentElement.style.setProperty('--poster-ar', SIZE.w + ' / ' + SIZE.h);
}
applySize();
```

And in CSS change `.cb-poster { ... aspect-ratio: 3 / 4; ... }` to `aspect-ratio: var(--poster-ar, 11 / 17);`.

- [ ] **Step 2: Scale the layouts.** The three layout functions were designed on an 1800×2400 canvas. Convert every literal: **x positions, widths, font sizes, letter-spacing multiply by KX; y positions and heights multiply by KY.** Change the signature to `(c, fam, card)` and read `card.img` / `card.seed` inside. Full replacements:

```js
const LAY = {
  stacked: function (c, fam, card) {
    let s = heroBehind(card.img, fam, card.seed);
    s += placeAsset({ key:'lockup', cx: W/2, y: 180*KY, w: 500*KX, color: fam.ink });
    const fs = nameSize(c.beer) * KX;
    s += '<text x="' + (W/2) + '" y="' + 1150*KY + '" text-anchor="middle" font-family="' + SERIF + '" font-size="' + fs + '" fill="' + fam.ink + '">' + esc(c.beer) + '</text>';
    if (c.style) s += '<text x="' + (W/2) + '" y="' + 1285*KY + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 86*KX + '" letter-spacing="' + 9*KX + '" fill="' + fam.accent + '">' + up(c.style) + '</text>';
    s += tagline(c.tagline, W/2, 1480*KY, 62*KX, fam.ink, 'middle');
    s += '<line x1="' + M + '" y1="' + 2000*KY + '" x2="' + (W-M) + '" y2="' + 2000*KY + '" stroke="' + fam.ink + '" stroke-opacity="0.24" stroke-width="2"/>';
    s += statTrio(c, fam, 2120*KY);
    if (c.cta) s += '<text x="' + (W/2) + '" y="' + 2295*KY + '" text-anchor="middle" font-family="' + SANS + '" font-size="' + 38*KX + '" letter-spacing="' + 5*KX + '" fill="' + fam.ink + '" fill-opacity="0.8">' + up(c.cta) + '</text>';
    return s;
  },
  anchored: function (c, fam, card) {
    const HH = 250*KY, split = 1500*KY;
    let s = heroBlock(card.img, fam, card.seed, { x: 0, y: HH, w: W, h: split - HH }, card);
    s += placeAsset({ key:'wordmark', x: M, y: 96*KY, w: 470*KX, color: fam.ink });
    if (c.date) s += '<text x="' + (W-M) + '" y="' + 172*KY + '" text-anchor="end" font-family="' + COND + '" font-size="' + 52*KX + '" letter-spacing="' + 7*KX + '" fill="' + fam.ink + '">' + up(c.date) + '</text>';
    s += '<line x1="' + M + '" y1="' + (HH - 42*KY) + '" x2="' + (W-M) + '" y2="' + (HH - 42*KY) + '" stroke="' + fam.ink + '" stroke-opacity="0.22" stroke-width="2"/>';
    s += '<line x1="0" y1="' + split + '" x2="' + W + '" y2="' + split + '" stroke="' + fam.ink + '" stroke-opacity="0.2" stroke-width="2"/>';
    if (c.style) s += '<text x="' + M + '" y="' + (split + 120*KY) + '" font-family="' + COND + '" font-size="' + 78*KX + '" letter-spacing="' + 9*KX + '" fill="' + fam.accent + '">' + up(c.style) + '</text>';
    const fs = nameSize(c.beer) * KX;
    s += '<text x="' + M + '" y="' + (split + 120*KY + fs*0.86) + '" font-family="' + SERIF + '" font-size="' + fs + '" fill="' + fam.ink + '">' + esc(c.beer) + '</text>';
    s += tagline(c.tagline, M, split + 120*KY + fs*0.86 + 110*KY, 54*KX, fam.ink, 'start');
    if (c.abv || c.ibu) s += '<text x="' + M + '" y="' + (H - 130*KY) + '" font-family="' + COND + '" font-size="' + 58*KX + '" letter-spacing="' + 3*KX + '" fill="' + fam.ink + '">' + up([c.abv, c.ibu].filter(Boolean).join('   ·   ')) + '</text>';
    if (c.avail) s += '<text x="' + (W-M) + '" y="' + (H - 130*KY) + '" text-anchor="end" font-family="' + SANS + '" font-size="' + 38*KX + '" letter-spacing="' + 4*KX + '" fill="' + fam.ink + '" fill-opacity="0.85">' + up(c.avail) + '</text>';
    if (c.cta) s += '<text x="' + M + '" y="' + (H - 72*KY) + '" font-family="' + SANS + '" font-size="' + 34*KX + '" letter-spacing="' + 5*KX + '" fill="' + fam.ink + '" fill-opacity="0.68">' + up(c.cta) + '</text>';
    return s;
  },
  framed: function (c, fam, card) {
    const fm = 96*KX;
    let s = heroBehind(card.img, fam, card.seed);
    s += '<rect x="' + fm + '" y="' + fm + '" width="' + (W - 2*fm) + '" height="' + (H - 2*fm) + '" fill="none" stroke="' + fam.ink + '" stroke-width="4"/>';
    s += placeAsset({ key:'wordmark', cx: W/2, y: fm + 80*KY, w: 430*KX, color: fam.ink });
    s += '<text x="' + (W/2) + '" y="' + (fm + 300*KY) + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 52*KX + '" letter-spacing="' + 13*KX + '" fill="' + fam.accent + '">NEW RELEASE</text>';
    const fs = nameSize(c.beer) * KX;
    s += '<text x="' + (W/2) + '" y="' + 1090*KY + '" text-anchor="middle" font-family="' + SERIF + '" font-size="' + fs + '" fill="' + fam.ink + '">' + esc(c.beer) + '</text>';
    if (c.style) s += '<text x="' + (W/2) + '" y="' + 1215*KY + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 74*KX + '" letter-spacing="' + 9*KX + '" fill="' + fam.ink + '">' + up(c.style) + '</text>';
    s += tagline(c.tagline, W/2, 1420*KY, 58*KX, fam.ink, 'middle');
    s += placeAsset({ key:'crest', cx: W/2, y: 1640*KY, w: 290*KX, color: fam.ink });
    const line = [c.abv, c.ibu, c.date].filter(Boolean).join('    ·    ');
    if (line) s += '<text x="' + (W/2) + '" y="' + (H - fm - 70*KY) + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 54*KX + '" letter-spacing="' + 7*KX + '" fill="' + fam.ink + '">' + up(line) + '</text>';
    return s;
  }
};
```

Also scale the supporting helpers: in `statTrio` use `font-size="' + 64*KX + '"`, `letter-spacing="' + 3*KX + '"`, and change the two divider lines to `y1="' + (y - 50*KY) + '"` / `y2="' + (y + 8*KY) + '"`; in `heroBehind` scale the placed widths (`1450*KX`, `1150*KX`) and y (`H * 0.30` already relative - keep); in `photoWell` scale the two font sizes (`62*KX`, `30*KX`, offset `66*KY`); in `tagline` no change (size passed in already scaled). `heroBlock` gains a trailing `card` parameter and passes it to `photoWell(r, fam, card)` (used in Task 3; until then `photoWell` ignores it).

- [ ] **Step 3: Update `buildPosterSVG`.** New signature and export dimensions:

```js
function buildPosterSVG(card, photoHref) {
  const c = content(), fam = famById(card.fam);
  const inner = '<rect width="' + W + '" height="' + H + '" fill="' + fam.bg + '"/>' + LAY[card.lay](c, fam, card);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + inner + '</svg>';
  return photoHref ? svg.replace(/href="assets\/photos\/[^"]+"/, 'href="' + photoHref + '"') : svg;
}
```

- [ ] **Step 4: Add the Size control.** In the content panel form, add as the first field:

```html
<div class="cb-field"><label id="cb-size-label">Size</label>
  <div class="cb-sizes" role="group" aria-labelledby="cb-size-label">
    <button class="cb-size" type="button" data-size="s1117" aria-pressed="true">11 × 17</button>
    <button class="cb-size" type="button" data-size="s1824" aria-pressed="false">18 × 24</button>
  </div>
</div>
```

CSS (near `.cb-occasion` rules):

```css
.cb-sizes { display: flex; gap: 8px; }
.cb-size { flex: 1; font-family: var(--condensed); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; font-size: 0.88rem; padding: 9px 0; border: 1.5px solid var(--line); border-radius: 3px; background: var(--beer-foam); color: var(--ink-soft); cursor: pointer; }
.cb-size[aria-pressed="true"] { background: var(--burgundy); color: var(--beer-foam); border-color: var(--burgundy); }
```

JS wiring (near the other event listeners):

```js
document.querySelectorAll('.cb-size').forEach(btn => btn.addEventListener('click', () => {
  SIZE = SIZES.find(s => s.key === btn.dataset.size) || SIZES[0];
  applySize();
  document.querySelectorAll('.cb-size').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  renderBoard();
}));
```

- [ ] **Step 5: Update the spotlight recipe and note.** In `renderSpotlight()`, the Size line becomes `'<b>Size</b> ' + SIZE.label`. Replace the `.cb-spot-note` paragraph text with: `The SVG exports at the chosen print size with live, editable text and intact vectors. Font names call the print faces (Superclarendon · Gotham · Alternate Gothic) so Adobe picks them up; this preview uses the sanctioned web substitutes.`

- [ ] **Step 6: Verify in the browser.** Reload localhost (auth line first). In the console:

```js
document.querySelector('.cb-poster svg').getAttribute('width')   // "11in"
document.querySelector('.cb-poster svg').getAttribute('viewBox') // "0 0 1100 1700"
```

Click `18 × 24`, re-check: `"18in"` and `"0 0 1800 2400"`. Confirm no console errors. Screenshot both sizes (two files), read back, compare: posters compose correctly at both sizes - name centered, footer stats inside the canvas, framed border not clipped, card aspect visibly taller at 11×17.

- [ ] **Step 7: Commit**

```bash
git add concept-board.html
git commit -m "Concept board: 11x17 and 18x24 size system with scaled layouts"
```

---

### Task 3: Real photo library

**Files:**
- Create: `assets/photos/photos.json`, `assets/photos/README.md`, `assets/photos/sample-photo.png` (temporary stand-in)
- Modify: `concept-board.html` (boot loader, card state, `photoWell`, `rerollReel`, footer note)

**Interfaces:**
- Consumes: `heroBlock(img, fam, seed, r, card)` and `photoWell(r, fam, card)` pass-through from Task 2.
- Produces: global `PHOTOS` (array of `{file, label}`), card property `ph` (photo index, integer). Task 5 reads `PHOTOS` and `card.ph` to locate the photo used.

- [ ] **Step 1: Create the folder and manifest.**

```bash
mkdir -p assets/photos
cp assets/previews/app-47.png assets/photos/sample-photo.png
```

`assets/photos/photos.json`:

```json
[
  { "file": "sample-photo.png", "label": "Sample photo (replace me)" }
]
```

`assets/photos/README.md`:

```markdown
# Concept Board photos

Real photos the Concept Board can drop into poster concepts (can renders, taproom shots, beer glamour shots).

**To add a photo:**
1. Drop the image file (JPG, PNG, or WebP) into this folder.
2. Add one line for it inside `photos.json`, for example: `{ "file": "miraculum-can.jpg", "label": "Miraculum can" }`

That's it. The board picks it up on the next page load. `sample-photo.png` is a placeholder - replace it with real photography and update its line in `photos.json`.
```

- [ ] **Step 2: Load the manifest at boot.** Add `let PHOTOS = [];` near the top of the poster engine, and inside the boot `(async function(){...})()` before `renderBoard()`:

```js
try {
  const r = await fetch('assets/photos/photos.json');
  if (r.ok) { const j = await r.json(); if (Array.isArray(j)) PHOTOS = j.filter(p => p && p.file); }
} catch (e) {}
```

- [ ] **Step 3: Give cards a photo index.** Add `ph: 0` to each of the four opening-hand card objects. In `rerollReel`, after the existing `img` branch logic, add:

```js
if (key === 'img' && card.img === 'well' && PHOTOS.length) card.ph = Math.floor(Math.random() * PHOTOS.length);
```

- [ ] **Step 4: Render real photos in the photo well.** Replace `photoWell(r, fam)` with:

```js
function photoWell(r, fam, card) {
  if (PHOTOS.length) {
    const p = PHOTOS[(card && card.ph || 0) % PHOTOS.length];
    return '<image x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" href="assets/photos/' + esc(p.file) + '" preserveAspectRatio="xMidYMid slice"/>';
  }
  const id = 'cbg' + (UID++);
  /* fallback: original gradient placeholder, unchanged */
  return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + fam.ink + '" stop-opacity="0.92"/><stop offset="1" stop-color="' + fam.accent + '" stop-opacity="0.82"/></linearGradient></defs>' +
    '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="url(#' + id + ')"/>' +
    '<text x="' + (r.x + r.w/2) + '" y="' + (r.y + r.h/2) + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 62*KX + '" letter-spacing="12" fill="' + fam.bg + '" fill-opacity="0.92">HERO IMAGE</text>' +
    '<text x="' + (r.x + r.w/2) + '" y="' + (r.y + r.h/2 + 66*KY) + '" text-anchor="middle" font-family="' + SANS + '" font-size="' + 30*KX + '" letter-spacing="5" fill="' + fam.bg + '" fill-opacity="0.72">CAN RENDER OR LIFESTYLE PHOTO</text>';
}
```

- [ ] **Step 5: Update the Image reel label and footer.** In `reelValueLabel`, when `key` is `img` and `card.img === 'well'` and `PHOTOS.length`, return `'Photo · ' + (PHOTOS[card.ph % PHOTOS.length].label || PHOTOS[card.ph % PHOTOS.length].file)`. Rewrite the footer notes paragraph:

```html
<b>Prototype notes.</b> Photos come from the shared photo library (assets/photos); add new ones with one line in photos.json. Fonts render as web substitutes here; the exported file names the licensed print faces so they connect in Adobe. Built entirely from the 2026 brand kit. Feedback welcome; nothing here is locked in.
```

- [ ] **Step 6: Verify.** Reload localhost. Console: `PHOTOS.length` returns `1`. Re-roll a card's Image chip until it lands on the photo well: a real image renders cover-cropped, chip reads `Photo · Sample photo (replace me)`. Fallback check: rename the manifest fetch URL in the console is not possible - instead run `mv assets/photos/photos.json assets/photos/photos.json.bak`, reload, confirm the gradient placeholder renders and there are no console errors, then `mv` it back. Screenshot with a photo-well card visible, read back, confirm the photo crops correctly at both sizes.

- [ ] **Step 7: Commit**

```bash
git add assets/photos concept-board.html
git commit -m "Concept board: real photo library with manifest and fallback"
```

---

### Task 4: Handoff fields in the spotlight

**Files:**
- Modify: `concept-board.html` (spotlight HTML, CSS, `openSpotlight`)

**Interfaces:**
- Produces: inputs `#cb-brand` (text, default "Pryes"), `#cb-qty` (number), `#cb-orient` (select: Portrait/Landscape), `#cb-lam` (select: No/Yes), `#cb-msg` (text). Task 5 reads all five by id.

- [ ] **Step 1: Add the fields.** Inside `.cb-spot-side`, between the recipe div and `.cb-spot-cta`:

```html
<div class="cb-handoff">
  <div class="cb-h-field"><label for="cb-brand">Brand</label><input id="cb-brand" type="text" value="Pryes" autocomplete="off"></div>
  <div class="cb-h-field"><label for="cb-qty">Quantity</label><input id="cb-qty" type="number" value="4" min="1" max="99"></div>
  <div class="cb-h-field"><label for="cb-orient">Orientation</label>
    <select id="cb-orient"><option>Portrait</option><option>Landscape</option></select></div>
  <div class="cb-h-field"><label for="cb-lam">Laminate</label>
    <select id="cb-lam"><option>No</option><option>Yes</option></select></div>
  <div class="cb-h-field cb-h-wide"><label for="cb-msg">Message</label><input id="cb-msg" type="text" autocomplete="off"></div>
</div>
<p class="cb-spot-note">Brand is whose sign this is - Pryes, or a partner account like a bar, restaurant, or the Twins. Orientation and laminate ride along on the request sheet; the poster itself is composed portrait.</p>
```

CSS (near the spotlight rules; fields on the burgundy panel, so foam-on-burgundy styling):

```css
.cb-handoff { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,241,228,0.2); }
.cb-h-field { display: flex; flex-direction: column; gap: 5px; }
.cb-h-field.cb-h-wide { grid-column: 1 / -1; }
.cb-h-field label { font-family: var(--condensed); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; font-size: 0.7rem; color: var(--beige); }
.cb-h-field input, .cb-h-field select { font-family: var(--sans); font-size: 0.9rem; padding: 8px 10px; color: var(--beer-foam); background: rgba(255,241,228,0.08); border: 1px solid rgba(255,241,228,0.3); border-radius: 3px; }
.cb-h-field input:focus, .cb-h-field select:focus { outline: none; border-color: var(--beige); }
.cb-h-field select option { color: var(--ink); }
```

- [ ] **Step 2: Prefill the message.** In `openSpotlight(i)`, after `renderSpotlight()`:

```js
const msg = document.getElementById('cb-msg');
if (!msg.value.trim()) {
  const c = content();
  msg.value = (c.beer || 'New beer') + ' Now Available on Draft';
}
```

(Only prefills when empty, so a hand-edited message survives switching concepts.)

- [ ] **Step 3: Verify.** Reload, pick a concept via `Pick this one →`. Confirm: the four fields render on the burgundy panel, readable and labeled; message prefills `Miraculum Now Available on Draft`; editing it, closing, and picking another concept keeps the edit. Screenshot the open spotlight, read back, check spacing and that nothing clips at 940px and 560px widths (resize and re-screenshot once).

- [ ] **Step 4: Commit**

```bash
git add concept-board.html
git commit -m "Concept board: designer handoff fields in the spotlight"
```

---

### Task 5: Concept package export

**Files:**
- Modify: `concept-board.html` (JSZip script tag, export button, `exportSVG` replaced by `downloadPackage`, new helpers `photoData`, `specSheetHTML`, `downloadBlob`)

**Interfaces:**
- Consumes: `buildPosterSVG(card, photoHref)` (Task 2), `PHOTOS` + `card.ph` (Task 3), `#cb-qty` `#cb-orient` `#cb-lam` `#cb-msg` (Task 4), `SIZE.signType` / `SIZE.slug` / `SIZE.label` (Task 2).
- Produces: the shipped feature; nothing downstream.

- [ ] **Step 1: Add JSZip.** Before the main `<script>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
```

- [ ] **Step 2: Rename the button.** The `#cb-export` button label becomes `Download package` (keep the download icon).

- [ ] **Step 3: Add the helpers** (replace `exportSVG` wholesale):

```js
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function photoData(file) {
  const r = await fetch('assets/photos/' + file);
  if (!r.ok) return null;
  const blob = await r.blob();
  const dataUrl = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
  return { name: file, blob: blob, dataUrl: dataUrl };
}
function specSheetHTML(c, card, fam, photo) {
  const req = [
    ['Brand', document.getElementById('cb-brand').value || 'Pryes'],
    ['Sign Type', SIZE.signType],
    ['Quantity', document.getElementById('cb-qty').value || '4'],
    ['Orientation', document.getElementById('cb-orient').value],
    ['Laminate', document.getElementById('cb-lam').value],
    ['Message', document.getElementById('cb-msg').value]
  ];
  const recipe = [
    ['Layout', LAYOUTS.find(l => l.id === card.lay).label],
    ['Color family', fam.name + ' / background ' + fam.bg + ' / ink ' + fam.ink + ' / accent ' + fam.accent],
    ['Print fonts', 'Superclarendon / Gotham / Alternate Gothic No.2 D (SVG text is live and editable)'],
    ['Photo', photo ? photo.name + ' (full-resolution copy in this package)' : 'None - brand art only'],
    ['Final size', SIZE.label + ', portrait']
  ];
  const tr = r => '<tr><th>' + r[0] + '</th><td>' + esc(String(r[1])) + '</td></tr>';
  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + esc(c.beer || 'Concept') + ' - Pryes poster spec</title>' +
    '<style>body{font-family:Georgia,serif;max-width:640px;margin:40px auto;padding:0 20px;color:#3e0f23;line-height:1.5}h1{font-size:24px;margin-bottom:4px}p.sub{margin:0 0 24px;color:#6b4351;font-size:14px}h2{font-size:13px;text-transform:uppercase;letter-spacing:.12em;margin:28px 0 8px}table{border-collapse:collapse;width:100%}th{text-align:left;padding:7px 16px 7px 0;white-space:nowrap;vertical-align:top;font-size:14px}td{padding:7px 0;font-size:14px}tr{border-bottom:1px solid #eee}@media print{body{margin:0}}</style></head><body>' +
    '<h1>' + esc(c.beer || 'Concept') + ' - poster concept</h1><p class="sub">From the Pryes Concept Board. The SVG in this package is the concept to finalize; everything in it is editable.</p>' +
    '<h2>Request</h2><table>' + req.map(tr).join('') + '</table>' +
    '<h2>Concept recipe</h2><table>' + recipe.map(tr).join('') + '</table></body></html>';
}
async function downloadPackage() {
  const card = cards[selected] || cards[0];
  const c = content(), fam = famById(card.fam);
  const slug = (c.beer || 'concept').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let photo = null;
  if (card.img === 'well' && PHOTOS.length) photo = await photoData(PHOTOS[card.ph % PHOTOS.length].file);
  const svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + buildPosterSVG(card, photo && photo.dataUrl);
  const svgName = 'pryes-' + slug + '-' + SIZE.slug + '.svg';
  if (window.JSZip) {
    const zip = new JSZip();
    zip.file(svgName, svg);
    zip.file('spec-sheet.html', specSheetHTML(c, card, fam, photo));
    if (photo) zip.file(photo.name, photo.blob);
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, 'pryes-' + slug + '-concept.zip');
    showToast('Concept package downloaded');
  } else {
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), svgName);
    showToast('ZIP unavailable, SVG downloaded');
  }
}
```

Wire it: `document.getElementById('cb-export').addEventListener('click', downloadPackage);` (replacing the old `exportSVG` listener).

- [ ] **Step 4: Verify the package.** Reload, set a card to the photo well, `Pick this one →`, fill Quantity 4 / Laminate No, click **Download package**. Then:

```bash
cd ~/Downloads && unzip -o pryes-miraculum-11x17.zip -d pryes-test 2>/dev/null || unzip -o pryes-*-concept.zip -d pryes-test
ls pryes-test        # expect: pryes-miraculum-11x17.svg, spec-sheet.html, sample-photo.png
grep -c "data:image" pryes-test/*.svg          # expect 1 (photo embedded)
grep -c "Standard BOTM Poster 11x17" pryes-test/spec-sheet.html   # expect 1
grep -c ">Pryes<" pryes-test/spec-sheet.html                      # expect 1 (Brand row)
grep -c "width=\"11in\"" pryes-test/*.svg      # expect 1
```

Open `spec-sheet.html` in a browser: two tables, sales-format fields on top, recipe below. Open the SVG in a browser: renders identically to the preview, photo included. Also verify a no-photo concept (brand-art image) exports with `Photo: None - brand art only` and no photo file in the ZIP. Verify the fallback: in the console run `window.JSZip = undefined`, click Download package, confirm a lone SVG downloads with the toast message.

- [ ] **Step 5: Commit**

```bash
git add concept-board.html
git commit -m "Concept board: concept package ZIP export with spec sheet"
```

---

### Task 6: Full verification pass

**Files:**
- Create: screenshots in `temporary screenshots/` (next free numbers)
- No source changes expected unless issues are found (fix them in this task, then re-verify)

- [ ] **Step 1: Fresh-eyes screenshot loop, round 1.** Serve, auth, screenshot the full page at 1280px and at 560px width, both sizes (11×17 and 18×24). Read each PNG back. Check against the spec: 3-step strip present and readable; all copy plain-language, no casino jargon, no em dashes; pin/lock states readable without color (icon + text + border); photo well shows the real photo; size toggle changes card proportions; spotlight fields complete.

- [ ] **Step 2: Fix anything off, round 2.** Apply fixes, re-screenshot, re-read. Minimum two rounds total per the project rules, more until no visible differences from intent remain.

- [ ] **Step 3: Export regression, anchored to the real sales request** (Ben, 2026-07-31; BOTM = Beer of the Month). Scenario: content fields Beer name `Main Squeeze`, Style `Lemon-Lime Blonde Ale`; a card on the **Featured can** layout showing the Main Squeeze can; spotlight fields Brand `Custom`, Quantity `4`, Orientation `Portrait`, Laminate `No`, Message `Main Squeeze Now Available on Draft`. Export at 11×17 and verify the spec sheet reproduces the request block exactly:

```
Brand: Custom
Sign Type: Standard BOTM Poster 11x17
Quantity: 4
Orientation: Portrait
Laminate: No
Message: Main Squeeze Now Available on Draft
```

ZIP name `pryes-main-squeeze-concept.zip`, SVG `pryes-main-squeeze-11x17.svg` with the can embedded as a data URI and the photo file included. Then one 18×24 package as a second regression (Sign Type `Poster 18x24`).

- [ ] **Step 4: Fallback regression.** Manifest renamed away → placeholder gradient, no console errors → manifest restored. `window.JSZip = undefined` → lone SVG download.

- [ ] **Step 5: Commit any fixes**

```bash
git add concept-board.html
git commit -m "Concept board: verification-pass fixes"
```

- [ ] **Step 6: Report to Ben** with before/after screenshots, what changed, and the one thing he must do next: drop real photos into `assets/photos/` and replace the sample.

---

### Task 7: Featured can layout (added 2026-07-31; execute BEFORE Task 6)

Ben's design references (Minna poster system): beer-release posters feature the can - wordmark top, can large and centered on a patterned brand background, name and availability below. This task adds that as a fourth layout.

**Files:**
- Modify: `concept-board.html` (LAYOUTS list, LAY object, opening hand, downloadPackage photo condition)

**Interfaces:**
- Consumes: `patternCover`, `placeAsset`, `nameSize`, `tagline` helpers; `PHOTOS`, `card.ph`, KX/KY scaling (Tasks 2-3); `downloadPackage` (Task 5).
- Produces: layout id `feature` labeled `Featured can`.

- [ ] **Step 1: Register the layout.** `LAYOUTS` becomes:

```js
const LAYOUTS = [ {id:'stacked',label:'Stacked'}, {id:'anchored',label:'Anchored'}, {id:'framed',label:'Framed'}, {id:'feature',label:'Featured can'} ];
```

- [ ] **Step 2: Add `LAY.feature`** (after `framed` in the LAY object):

```js
feature: function (c, fam, card) {
  let s = '';
  if (A.laurel) s += patternCover({ x: 0, y: 0, w: W, h: H }, fam, 0.08);
  s += placeAsset({ key: 'wordmark', cx: W/2, y: 150*KY, w: 520*KX, color: fam.ink });
  if (c.style) s += '<text x="' + (W/2) + '" y="' + 330*KY + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 56*KX + '" letter-spacing="' + 11*KX + '" fill="' + fam.accent + '">' + up(c.style) + '</text>';
  if (PHOTOS.length) {
    const p = PHOTOS[(card.ph || 0) % PHOTOS.length];
    s += '<ellipse cx="' + (W/2) + '" cy="' + 1620*KY + '" rx="' + 330*KX + '" ry="' + 42*KY + '" fill="' + fam.ink + '" fill-opacity="0.16"/>';
    s += '<image x="' + (W/2 - 520*KX) + '" y="' + 430*KY + '" width="' + 1040*KX + '" height="' + 1200*KY + '" href="assets/photos/' + esc(p.file) + '" preserveAspectRatio="xMidYMid meet"/>';
  } else {
    s += placeAsset({ key: 'crest', cx: W/2, y: 500*KY, w: 900*KX, color: fam.accent, opacity: 0.9 });
  }
  const fs = nameSize(c.beer) * KX;
  s += '<text x="' + (W/2) + '" y="' + 1860*KY + '" text-anchor="middle" font-family="' + SERIF + '" font-size="' + fs + '" fill="' + fam.ink + '">' + esc(c.beer) + '</text>';
  const line = [c.date, c.avail].filter(Boolean).join('   ·   ');
  if (line) s += '<text x="' + (W/2) + '" y="' + 2010*KY + '" text-anchor="middle" font-family="' + COND + '" font-size="' + 66*KX + '" letter-spacing="' + 8*KX + '" fill="' + fam.ink + '">' + up(line) + '</text>';
  if (c.cta) s += '<text x="' + (W/2) + '" y="' + 2290*KY + '" text-anchor="middle" font-family="' + SANS + '" font-size="' + 36*KX + '" letter-spacing="' + 5*KX + '" fill="' + fam.ink + '" fill-opacity="0.75">' + up(c.cta) + '</text>';
  return s;
}
```

- [ ] **Step 3: Showcase it in the opening hand.** Concept 1 becomes:

```js
{ img:'emblem', lay:'feature', fam:'foam', held:false, seed:2, ph:0, lock:{img:false,lay:false,fam:false} },
```

- [ ] **Step 4: Embed the can on export.** In `downloadPackage`, the photo condition becomes:

```js
if ((card.img === 'well' || card.lay === 'feature') && PHOTOS.length) photo = await photoData(PHOTOS[card.ph % PHOTOS.length].file);
```

- [ ] **Step 5: Verify.** Reload localhost (auth line). Concept 1 renders: wordmark top, style line, Main Squeeze can large and un-cropped over the faint laurel pattern with a soft ellipse shadow, name, availability line, CTA. Console error count zero. Check both sizes. Screenshot to "temporary screenshots/screenshot-t7-1.png" (+ -2 for 18×24), read back, analyze. Export the feature-layout concept: ZIP contains the photo file, SVG embeds a data URI, spec sheet Layout row reads "Featured can".

- [ ] **Step 6: Commit**

```bash
git add concept-board.html
git commit -m "Concept board: featured can layout grounded in the Minna poster references"
```

---

## Self-review notes (already applied)

- Spec coverage: every spec row maps to a task (usability → 1, photos → 3, size → 2, handoff fields → 4, ZIP + spec sheet + JSZip fallback → 5, verification → 6). Out-of-scope items untouched.
- Person names removed from all UI copy per Ben; the export is a neutral "concept package".
- Brand is an editable handoff field (default "Pryes") per Ben: it names whose sign this is, and can be any partner account - a bar, a restaurant, even the Twins - whose branding then leads. Full partner-brand poster composition stays out of scope (the "Account / Promo" occasion remains "soon"); the field just records it for the designer.
- Type consistency: `LAY[id](c, fam, card)`, `buildPosterSVG(card, photoHref)`, `photoWell(r, fam, card)`, `heroBlock(img, fam, seed, r, card)` used consistently across Tasks 2, 3, 5.
