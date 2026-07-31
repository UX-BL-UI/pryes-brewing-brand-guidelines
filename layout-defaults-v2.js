/* ============================================================
   PRYES CONCEPT LAYOUT DEFAULTS - V2
   Geometry for the V2 concepts, one poster type at a time.
   Shared by concept-board-v2.html (rendering) and, later, the
   editor loop that lets Ben re-tune these defaults.
   All values live in the 1800 x 2400 design space; the engine
   scales x/w/size by KX and y/h by KY for the chosen print size.
   Structure is fixed per concept - the shuffle only varies the
   ingredients (shape, colors, pattern density), never geometry.
   ============================================================ */
window.PRYES_LAYOUT_DEFAULTS_V2 = {
  beerfeature: {
    label: 'Beer feature',
    elements: {
      /* Grounded to the Pragmatic Pils reference poster; tuned by
         Ben in concept-editor-v2, 2026-07-31: bigger can, higher
         band, larger band type. Diamonds normalized to matching
         size, inset, and line. */
      wordmark:    { kind: 'asset', asset: 'wordmarktag', cx: 907, y: -4, w: 1577 },
      can:         { kind: 'photo', cx: 893, y: 405, h: 1544 },
      band:        { kind: 'band', y: 1642 },
      shape:       { kind: 'shape', cx: 900, w: 1872, poke: 150 },
      headline:    { kind: 'headline', x: 906, y: 2127, anchor: 'middle', size: 191, track: 0.06 },
      subheadline: { kind: 'sub',  x: 895, y: 2238, anchor: 'middle', size: 98, track: 0.14 },
      diamondL:    { kind: 'diamond', cx: 200,  cy: 2147, s: 50 },
      diamondR:    { kind: 'diamond', cx: 1600, cy: 2147, s: 50 }
    }
  }
};
