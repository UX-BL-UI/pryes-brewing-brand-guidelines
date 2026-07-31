/* ============================================================
   PRYES CONCEPT LAYOUT DEFAULTS
   Single source of truth for every element's geometry, shared by
   concept-board.html (rendering) and concept-editor.html (editing).
   All values live in the 1800 x 2400 design space; the engine
   scales x/w/size by KX and y/h by KY for the chosen print size.
   Units: x/cx/y/w/h in design units; size = font size in design
   units; scale multiplies the auto headline size; track = letter
   spacing in em; lh = line height multiple.
   Edited defaults are exported from concept-editor.html - replace
   this file with the exported one to update every concept.
   ============================================================ */
window.PRYES_LAYOUT_DEFAULTS = {
  stacked: {
    label: 'Stacked',
    elements: {
      /* Tuned by Ben in concept-editor, 2026-07-31: big style headline mid-page, name near the foot */
      lockup:   { kind: 'asset', asset: 'wordmarktag', cx: 900, y: 132, w: 1046 },
      hero:     { kind: 'hero', cx: 900, y: 564, w: 1556 },
      name:     { kind: 'name', x: 906, y: 2025, anchor: 'middle', scale: 0.71, track: 0 },
      style:    { kind: 'sub', x: 900, y: 1285, anchor: 'middle', size: 306, track: 0.05 },
      body:     { kind: 'body', x: 902, y: 1391, anchor: 'middle', size: 62, lh: 1.5 },
      stats:    { kind: 'stats', y: 2131, size: 64, track: 0.05 },
      callout2: { kind: 'cap', x: 900, y: 2228, anchor: 'middle', size: 38, track: 0.15, opacity: 0.8 }
    }
  },
  anchored: {
    label: 'Anchored',
    elements: {
      /* Tuned by Ben in concept-editor, 2026-07-31: photo block and rules dropped a half inch,
         full-bleed header rule */
      band:       { kind: 'band', y: 320, h: 1250 },
      headerRule: { kind: 'rule', x1: 0, x2: 1800, y: 320 },
      splitRule:  { kind: 'rule', x1: 0, x2: 1800, y: 1570 },
      wordmark:   { kind: 'asset', asset: 'wordmark', x: 149, y: 102, w: 720 },
      subhead:    { kind: 'sub', x: 1659, y: 140, anchor: 'end', size: 62, track: 0.05 },
      style:      { kind: 'sub', x: 160, y: 1712, anchor: 'start', size: 98, track: 0.05 },
      name:       { kind: 'name', x: 149, y: 1911, anchor: 'start', scale: 1, track: 0 },
      body:       { kind: 'body', x: 152, y: 1992, anchor: 'start', size: 54, lh: 1.5 },
      statline:   { kind: 'sub', x: 154, y: 2213, anchor: 'start', size: 58, track: 0.05 },
      callout:    { kind: 'cap', x: 716, y: 1987, anchor: 'end', size: 38, track: 0.15, opacity: 0.85 },
      callout2:   { kind: 'cap', x: 150, y: 2270, anchor: 'start', size: 34, track: 0.15, opacity: 0.68 }
    }
  },
  framed: {
    label: 'Framed',
    elements: {
      /* Tuned by Ben in concept-editor, 2026-07-31: name leads at the top, wordmark closes the foot */
      frame:    { kind: 'frame', x: 96, y: 96, stroke: 4 },
      hero:     { kind: 'hero', cx: 900, y: 720, w: 1450 },
      wordmark: { kind: 'asset', asset: 'wordmark', cx: 910, y: 1979, w: 860 },
      eyebrow:  { kind: 'sub', x: 893, y: 1842, anchor: 'middle', size: 66, track: 0.05 },
      name:     { kind: 'name', x: 895, y: 550, anchor: 'middle', scale: 1.28, track: 0 },
      style:    { kind: 'sub', x: 908, y: 1494, anchor: 'middle', size: 137, track: 0.05 },
      body:     { kind: 'body', x: 921, y: 1590, anchor: 'middle', size: 67, lh: 1.5 },
      crest:    { kind: 'asset', asset: 'crest', cx: 893, y: 1054, w: 335 },
      statline: { kind: 'sub', x: 907, y: 1765, anchor: 'middle', size: 54, track: 0.05 }
    }
  },
  feature: {
    label: 'Featured can',
    elements: {
      /* Tuned by Ben in concept-editor, 2026-07-31 */
      wordmark: { kind: 'asset', asset: 'wordmark', cx: 900, y: -1, w: 1539 },
      style:    { kind: 'sub', x: 900, y: 396, anchor: 'middle', size: 100, track: 0.05 },
      photo:    { kind: 'photo', x: 118, y: 359, w: 1529, h: 1503 },
      crestAlt: { kind: 'asset', asset: 'crest', cx: 900, y: 560, w: 900, opacity: 0.9 },
      name:     { kind: 'name', x: 890, y: 2093, anchor: 'middle', scale: 1, track: 0 },
      subline:  { kind: 'sub', x: 898, y: 2216, anchor: 'middle', size: 84, track: 0.05 },
      callout2: { kind: 'cap', x: 900, y: 2306, anchor: 'middle', size: 36, track: 0.15, opacity: 0.75 }
    }
  }
};
