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
      can:         { kind: 'photo', cx: 906, y: 370, h: 1458 },
      band:        { kind: 'band', y: 1960 },
      /* Tile overlap as a percent of tile size, so it holds at any
         pattern density. ovX pulls columns together; ovY pulls rows.
         angle tilts the whole field - the brand laurels run diagonal. */
      pattern:     { kind: 'pattern', ovX: 6, ovY: 0, angle: -27 },
      /* Each of the 15 brand shapes keeps its own placement here,
         keyed by shape number: { cx, y, w, h }. A shape without an
         entry gets an automatic placement against the band line.
         All 15 hand-placed by Ben in concept-editor-v2, 2026-07-31. */
      shape:       { kind: 'shape', perShape: {
        '1':  { kind: 'shape', cx: 875,  y: 1375, w: 1872, h: 1493 },
        '2':  { kind: 'shape', cx: 883,  y: 1422, w: 1872, h: 2071 },
        '3':  { kind: 'shape', cx: 850,  y: 1050, w: 2028, h: 1142 },
        '4':  { kind: 'shape', cx: 1135, y: 788,  w: 2336, h: 1480 },
        '5':  { kind: 'shape', cx: 909,  y: 1155, w: 1862, h: 1083 },
        '6':  { kind: 'shape', cx: 905,  y: 1465, w: 1872, h: 1059 },
        '7':  { kind: 'shape', cx: 920,  y: -529, w: 1999, h: 2490 },
        '8':  { kind: 'shape', cx: 912,  y: 1842, w: 1872, h: 581 },
        '9':  { kind: 'shape', cx: 911,  y: 1868, w: 1872, h: 851 },
        '10': { kind: 'shape', cx: 901,  y: 1892, w: 1872, h: 1620 },
        '11': { kind: 'shape', cx: 907,  y: 1866, w: 2077, h: 1475 },
        '12': { kind: 'shape', cx: 917,  y: -545, w: 2878, h: 2735 },
        '13': { kind: 'shape', cx: 924,  y: 1915, w: 1872, h: 1003 },
        '14': { kind: 'shape', cx: 923,  y: 1903, w: 1350, h: 124 },
        '15': { kind: 'shape', cx: 920,  y: 1850, w: 1872, h: 1790 }
      } },
      headline:    { kind: 'headline', x: 906, y: 2127, anchor: 'middle', size: 191, track: 0.06 },
      subheadline: { kind: 'sub',  x: 895, y: 2238, anchor: 'middle', size: 98, track: 0.14 },
      diamondL:    { kind: 'diamond', cx: 200,  cy: 2147, s: 50 },
      diamondR:    { kind: 'diamond', cx: 1600, cy: 2147, s: 50 }
    }
  },
  brandfocus: {
    label: 'Brand focus',
    elements: {
      /* Grounded to the "It's a Midwest Thing" reference; tuned by
         Ben in concept-editor-v2, 2026-07-31. Flat brand field,
         stacked wordmark, laurel wreath + P watermark behind the
         condensed headline, serif line at the foot. Colors come
         from the brand colorways, not here. */
      wordmark:    { kind: 'asset', asset: 'wordmarktag', cx: 900, y: 170, w: 963 },
      laurels:     { kind: 'asset', asset: 'laurels', cx: 900, y: 568, w: 1624 },
      pmark:       { kind: 'asset', asset: 'pmark', cx: 905, y: 831, w: 751 },
      headline:    { kind: 'headline', x: 900, y: 1065, anchor: 'middle', size: 283, track: 0.01, lh: 0.93 },
      subheadline: { kind: 'serif', x: 898, y: 2043, anchor: 'middle', size: 206, lh: 0.92 }
    }
  },
  cobrand: {
    label: 'Co-branded',
    elements: {
      /* Grounded to the Twins reference, 2026-07-31: giant PRYES,
         brand-shape plaque framing the can, message left and
         partner logo right at the foot. Partner colors live in the
         engine's partner list, not here. */
      wordmark:    { kind: 'asset', asset: 'wordmark', cx: 900, y: 90, w: 1529 },
      can:         { kind: 'photo', cx: 899, y: 481, h: 1368 },
      /* plaque placements per shape number, same system as the beer
         poster's divider - hand-place each shape once.
         Shapes 8-15 placed by Ben 2026-07-31; 1-7 still on the
         automatic box. */
      shape:       { kind: 'shape', perShape: {
        '8':  { kind: 'shape', cx: 914, y: 1182, w: 2065, h: 1230 },
        '9':  { kind: 'shape', cx: 922, y: 412,  w: 1529, h: 1585 },
        '10': { kind: 'shape', cx: 896, y: 442,  w: 1479, h: 1510 },
        '11': { kind: 'shape', cx: 900, y: 462,  w: 1504, h: 1460 },
        '12': { kind: 'shape', cx: 902, y: -66,  w: 1820, h: 2508 },
        '13': { kind: 'shape', cx: 910, y: 2269, w: 1868, h: 1857 },
        '14': { kind: 'shape', cx: 900, y: 476,  w: 2085, h: 1433 },
        '15': { kind: 'shape', cx: 903, y: 457,  w: 1466, h: 1473 }
      } },
      headline:    { kind: 'headline', x: 546, y: 2130, anchor: 'middle', size: 126, track: 0.03, lh: 1.04 },
      partner:     { kind: 'partner', cx: 1281, y: 2032, w: 509 }
    }
  },
  photofocus: {
    label: 'Photo focus',
    elements: {
      /* Grounded to the "Trust Your Taste" reference, 2026-07-31:
         giant PRYES over a big photo well, headline flanked by
         diamonds at the foot. Brand colorways only. */
      /* Tuned by Ben in concept-editor-v2, 2026-07-31; diamonds
         normalized to 180 from each edge, same size and line. */
      wordmark:    { kind: 'asset', asset: 'wordmark', cx: 900, y: 90, w: 1529 },
      photo:       { kind: 'photoblock', x: 164, y: 444, w: 1476, h: 1556 },
      headline:    { kind: 'headline', x: 900, y: 2223, anchor: 'middle', size: 163, track: 0.04 },
      diamondL:    { kind: 'diamond', cx: 180,  cy: 2178, s: 38 },
      diamondR:    { kind: 'diamond', cx: 1620, cy: 2178, s: 38 }
    }
  }
};
