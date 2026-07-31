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
      wordmark:    { kind: 'asset', asset: 'wordmarktag', cx: 907, y: -5, w: 1504 },
      can:         { kind: 'photo', cx: 891, y: 437, h: 1458 },
      band:        { kind: 'band', y: 1642 },
      /* Each of the 15 brand shapes keeps its own placement here,
         keyed by shape number: { cx, y, w, h }. A shape without an
         entry gets an automatic placement against the band line. */
      shape:       { kind: 'shape', perShape: {
        /* Shape 05 - Ben's final placement, 2026-07-31 */
        '5': { kind: 'shape', cx: 906, y: 1427, w: 1862, h: 1083 }
      } },
      headline:    { kind: 'headline', x: 906, y: 2127, anchor: 'middle', size: 191, track: 0.06 },
      subheadline: { kind: 'sub',  x: 895, y: 2238, anchor: 'middle', size: 98, track: 0.14 },
      diamondL:    { kind: 'diamond', cx: 200,  cy: 2147, s: 50 },
      diamondR:    { kind: 'diamond', cx: 1600, cy: 2147, s: 50 }
    }
  }
};
