# Concept Board v2 - Design Spec

Date: 2026-07-30
File: `concept-board.html` (single-page tool in the brand guidelines site)
Goal: the Pryes team uses it with zero training, and every kept concept reaches the designer as a finalize-ready package.

## 1. Usability

| Change | Detail |
|---|---|
| 3-step strip | Under the page title: **1 Fill in the details · 2 Shuffle until something clicks · 3 Download the winner as a package** |
| Rename buttons | "Reroll unheld" → **Shuffle**; "Release all holds" → **Unpin everything**; "Keep this →" → **Pick this one →** |
| Rename mechanics | "Hold" → **Pin** (card stays put when shuffling); reel tap = "swap just this"; lock = "keep this while shuffling". Helper note rewritten in those words. |
| Card chips | Image / Layout / Color chips stay, with plain tooltips |
| Colorblind-safe | Pin and lock states always show icon + text + border, never color alone |
| No em dashes | All copy follows the brand writing rules |

## 2. Real photos

| Piece | Detail |
|---|---|
| Folder | `assets/photos/` - Ben drops real photos in (JPG/PNG/WebP) |
| Manifest | `assets/photos/photos.json`: array of `{ "file": "name.jpg", "label": "Miraculum can" }` |
| README | `assets/photos/README.md` - two-line instructions: drop the file, add a line |
| Rendering | "Photo well" treatment shows a real photo, cover-cropped (`preserveAspectRatio slice`) |
| Re-roll | Re-rolling the Image reel cycles to a different photo when Photo well is active |
| Fallback | Empty/missing manifest → current gradient placeholder, tool never breaks |

## 3. Designer package

### Size
- New **Size** control next to the content fields: **11×17** (Standard BOTM) or **18×24**
- Poster canvas, preview aspect ratio, and export dimensions all match the chosen size
- Layout positions become size-relative so both sizes compose correctly

### Handoff fields (in the "Pick this one" spotlight)
- Brand (text, default "Pryes") - whose sign this is; a partner bar or restaurant name when the poster is for an account
- Quantity (number, default 4)
- Orientation (Portrait / Landscape, default Portrait) - request info for the designer only; the tool always composes portrait
- Laminate (Yes / No, default No)
- Message (prefilled from beer name + release, editable, e.g. "Main Squeeze Now Available on Draft")

### Export: "Download package" (ZIP per concept)
| File in ZIP | Contents |
|---|---|
| `pryes-<beer>-<size>.svg` | Print-true SVG, editable text, print font names first, photo embedded as data URI |
| `<photo file>` | The original photo used, full resolution |
| `spec-sheet.html` | Printable one-pager, two blocks: |

Spec sheet block 1 - the sales team's own request format:
```
Brand / Sign Type / Quantity / Orientation / Laminate / Message
```
Spec sheet block 2 - the recipe: layout name, color family with exact hexes, print font names (Superclarendon · Gotham · Alternate Gothic), photo filename, final size.

- ZIP built in-browser with JSZip (CDN). If JSZip fails to load, fall back to downloading the SVG alone.

## 4. Featured can layout (added 2026-07-31 from Ben's references)

Ben supplied the Minna poster references (State Fair poster; "Pragmatic Pils Available Now" feature poster). Beer-release concepts must be able to ground in a featured beer can, not just background imagery.

| Piece | Detail |
|---|---|
| New layout | "Featured can", fourth entry in the Layout reel |
| Composition | Wordmark top, style line under it, can render large and centered (contain-fit, never cropped) over a low-opacity laurel pattern, soft ground shadow, beer name + availability line below, CTA at the foot |
| Photo source | Uses the photo library (card's photo index); falls back to the crest emblem when no photos exist |
| Export | Package embeds the can photo for this layout just like the photo well |

## Out of scope
- The grayed-out occasions (Taproom Event, Account/Promo, Announcement, Business Cards) stay "soon"
- No backend, no accounts; password gate stays as is

## Verification
1. Puppeteer screenshot-and-compare loop on localhost, both sizes, at least 2 rounds
2. Export a ZIP: SVG opens at true size with editable text, spec sheet fields correct, photo included
3. Empty-photos fallback: remove manifest, confirm placeholder still renders
4. Reference record: [[Sales team designer request - example]] in the Pryes vault
