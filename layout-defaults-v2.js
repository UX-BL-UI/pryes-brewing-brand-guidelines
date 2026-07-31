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
      /* Grounded to the Pragmatic Pils reference poster, 2026-07-31:
         the Pryes Brewing wordmark (one brand asset) bleeding the
         top edge, patterned field, centered can, brand shape cutting
         into the beer foam band that carries headline + subheadline. */
      wordmark:    { kind: 'asset', asset: 'wordmarktag', cx: 900, y: -44, w: 1724 },
      can:         { kind: 'photo', cx: 900, y: 610, h: 1330 },
      band:        { kind: 'band', y: 1985, poke: 150 },
      headline:    { kind: 'headline', x: 900, y: 2200, anchor: 'middle', size: 150, track: 0.06 },
      subheadline: { kind: 'sub',  x: 900, y: 2312, anchor: 'middle', size: 74, track: 0.14 },
      diamondL:    { kind: 'diamond', cx: 150,  cy: 2226, s: 26 },
      diamondR:    { kind: 'diamond', cx: 1650, cy: 2226, s: 26 }
    }
  }
};
