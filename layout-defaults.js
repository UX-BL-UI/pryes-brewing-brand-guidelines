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
      /* Tuned by Ben, 2026-07-31: wordmark+Brewing mark, raised 40 */
      lockup:   { kind: 'asset', asset: 'wordmarktag', cx: 900, y: 100, w: 760 },
      name:     { kind: 'name', x: 900, y: 1150, anchor: 'middle', scale: 1, track: 0 },
      style:    { kind: 'sub', x: 900, y: 1285, anchor: 'middle', size: 108, track: 0.05 },
      body:     { kind: 'body', x: 900, y: 1480, anchor: 'middle', size: 62, lh: 1.5 },
      stats:    { kind: 'stats', y: 2120, size: 64, track: 0.05 },
      callout2: { kind: 'cap', x: 900, y: 2295, anchor: 'middle', size: 38, track: 0.15, opacity: 0.8 }
    }
  },
  anchored: {
    label: 'Anchored',
    elements: {
      band:       { kind: 'band', y: 250, h: 1250 },
      headerRule: { kind: 'rule', x1: 150, x2: 1650, y: 250 },
      splitRule:  { kind: 'rule', x1: 0, x2: 1800, y: 1500 },
      wordmark:   { kind: 'asset', asset: 'wordmark', x: 150, y: 60, w: 720 },
      subhead:    { kind: 'sub', x: 1650, y: 172, anchor: 'end', size: 62, track: 0.05 },
      style:      { kind: 'sub', x: 150, y: 1620, anchor: 'start', size: 98, track: 0.05 },
      name:       { kind: 'name', x: 150, y: 1835, anchor: 'start', scale: 1, track: 0 },
      body:       { kind: 'body', x: 150, y: 1945, anchor: 'start', size: 54, lh: 1.5 },
      statline:   { kind: 'sub', x: 150, y: 2270, anchor: 'start', size: 58, track: 0.05 },
      callout:    { kind: 'cap', x: 1650, y: 2270, anchor: 'end', size: 38, track: 0.15, opacity: 0.85 },
      callout2:   { kind: 'cap', x: 150, y: 2328, anchor: 'start', size: 34, track: 0.15, opacity: 0.68 }
    }
  },
  framed: {
    label: 'Framed',
    elements: {
      frame:    { kind: 'frame', x: 96, y: 96, stroke: 4 },
      wordmark: { kind: 'asset', asset: 'wordmark', cx: 900, y: 156, w: 860 },
      eyebrow:  { kind: 'sub', x: 900, y: 536, anchor: 'middle', size: 66, track: 0.05 },
      name:     { kind: 'name', x: 900, y: 1090, anchor: 'middle', scale: 1, track: 0 },
      style:    { kind: 'sub', x: 900, y: 1215, anchor: 'middle', size: 92, track: 0.05 },
      body:     { kind: 'body', x: 900, y: 1420, anchor: 'middle', size: 58, lh: 1.5 },
      crest:    { kind: 'asset', asset: 'crest', cx: 900, y: 1640, w: 290 },
      statline: { kind: 'sub', x: 900, y: 2234, anchor: 'middle', size: 54, track: 0.05 }
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
