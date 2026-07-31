/* ============================================================
   PRYES POSTER ENGINE - V2
   Renderer for the V2 concepts (concept-board-v2.html).
   V1 (poster-engine.js) stays untouched; this engine owns the
   designer-facing concepts, starting with the Beer feature
   poster. Geometry comes from layout-defaults-v2.js.

   Brand rendering canon (carried over from V1, non-negotiable):
   - Preview uses web faces ONLY; exports swap print faces via
     toPrintFonts() (macOS ships Superclarendon and would hijack
     the preview if print faces were named first).
   - Type values follow the guide page's specimen CSS.
   ============================================================ */
window.PryesPosterV2 = (function () {
  const SIZES = [
    { key:'s1117', label:'11 × 17 in', slug:'11x17', w:1100, h:1700, inW:'11in', inH:'17in' },
    { key:'s1824', label:'18 × 24 in', slug:'18x24', w:1800, h:2400, inW:'18in', inH:'24in' }
  ];
  let SIZE = SIZES[0];
  let W, H, KX, KY;
  function setSize(key) {
    SIZE = SIZES.find(s => s.key === key) || SIZES[0];
    W = SIZE.w; H = SIZE.h;
    KX = W / 1800; KY = H / 2400;
    if (document.documentElement) document.documentElement.style.setProperty('--poster-ar', SIZE.w + ' / ' + SIZE.h);
  }
  setSize('s1117');

  const SERIF = "'Bitter',Georgia,serif";
  const COND  = "'Barlow Condensed','Barlow Semi Condensed',sans-serif";
  const SANS  = "'Poppins',system-ui,sans-serif";

  const BRAND = { foam:'#FFF1E4', beige:'#EBCFB8', burgundy:'#3E0F23', burgundyDeep:'#320C1C', offblack:'#101019', miraculum:'#213B1E' };

  /* ---------- beer bundles ----------
     Each beer travels as a bundle: can render + its pattern + its
     colors. Photo and pattern are connected - never mixed across
     beers. colors: bg = the beer's field color, deep = tonal
     pattern color on that field, accent = the beer's dark ink
     (band headline, diamonds). */
  const BEERS = [
    {
      id: 'main-squeeze',
      name: 'Main Squeeze',
      headline: 'Main Squeeze',
      subheadline: 'Available Now',
      can: 'assets/photos/main-squeeze-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#E6CE49', deep: '#C9A92E', accent: '#335A23' }
    }
  ];

  /* ---------- colorways ----------
     Beer-driven: the featured beer supplies its own colors and the
     brand palette fills in the rest. paint(beer) resolves the
     concrete hexes for one card. */
  const COLORWAYS = [
    { id:'beer',     name:'Beer color',      weight:3, paint: b => ({ bg:b.colors.bg, pattern:b.colors.deep, wordmark:BRAND.foam, band:BRAND.foam, bandText:b.colors.accent }) },
    { id:'accent',   name:'Beer accent',     weight:1, paint: b => ({ bg:b.colors.accent, pattern:b.colors.bg, wordmark:BRAND.foam, band:BRAND.foam, bandText:b.colors.accent }) },
    { id:'burgundy', name:'Regal Burgundy',  weight:1, paint: b => ({ bg:BRAND.burgundy, pattern:BRAND.burgundyDeep, wordmark:BRAND.foam, band:BRAND.foam, bandText:BRAND.burgundy }) },
    { id:'offblack', name:'Off-Black',       weight:1, paint: b => ({ bg:BRAND.offblack, pattern:BRAND.burgundy, wordmark:BRAND.foam, band:BRAND.foam, bandText:BRAND.offblack }) },
    { id:'foam',     name:'Beer Foam',       weight:1, paint: b => ({ bg:BRAND.foam, pattern:BRAND.beige, wordmark:BRAND.burgundy, band:b.colors.bg, bandText:b.colors.accent }) }
  ];

  const DENSITIES = [
    { id:'loose',  name:'Loose',  cols: 1 },
    { id:'medium', name:'Medium', cols: 2 },
    { id:'tight',  name:'Tight',  cols: 3 }
  ];

  const WORDMARK_URL = 'assets/logos/svg/BEERFOAM/PRYES-WORDMARK-BEERFOAM.svg';
  const SHAPE_COUNT = 15;
  const shapeUrl = n => 'assets/shapes/svg/BEERFOAM/BEER FOAM SHAPE ' + String(n).padStart(2, '0') + '.svg';

  const A = { wordmark: null, shapes: [], patterns: {} };
  let SPEC = window.PRYES_LAYOUT_DEFAULTS_V2;
  function setSpec(s) { SPEC = s; }

  /* ---------- asset parsing + helpers ---------- */
  function parse(txt) {
    const vb = (txt.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 100 100';
    let body = txt.replace(/<\?xml[^>]*\?>/g, '')
                  .replace(/<!--[\s\S]*?-->/g, '')
                  .replace(/<defs>[\s\S]*?<\/defs>/g, '')
                  .replace(/<style[\s\S]*?<\/style>/g, '');
    body = body.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return { vb: vb, body: body };
  }
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function up(s) { return esc((s || '').toUpperCase()); }
  function beerById(id) { return BEERS.find(b => b.id === id) || BEERS[0]; }
  function colorwayById(id) { return COLORWAYS.find(c => c.id === id) || COLORWAYS[0]; }
  function densityById(id) { return DENSITIES.find(d => d.id === id) || DENSITIES[1]; }

  function placeSVG(a, o) {
    const p = a.vb.split(/\s+/).map(Number);
    const vw = p[2] || 100, vh = p[3] || 100;
    const w = o.w, h = o.h || w * (vh / vw);
    const x = (o.cx != null) ? o.cx - w / 2 : o.x;
    const op = o.opacity != null ? ' opacity="' + o.opacity + '"' : '';
    return '<svg x="' + x + '" y="' + o.y + '" width="' + w + '" height="' + h + '" viewBox="' + a.vb + '" preserveAspectRatio="xMidYMid meet"><g fill="' + o.color + '"' + op + '>' + a.body + '</g></svg>';
  }

  /* ---------- element renderers ---------- */
  /* Band headline auto-sizes off its longest line so long beer
     names stay inside the band. Condensed 600 per the guide's
     subhead spec; the designer's size/track multipliers ride on top. */
  function headlineSize(s) { const n = (s || '').length; return n <= 10 ? 1 : n <= 14 ? 0.86 : n <= 18 ? 0.72 : n <= 24 ? 0.58 : 0.48; }
  function condText(e, txt, fill, o) {
    o = o || {};
    const lines = String(txt || '').split(/\r?\n/).filter(l => l.trim().length);
    const longest = lines.length ? lines.reduce((a, b) => (b.length > a.length ? b : a)) : (txt || '');
    const auto = o.autosize ? headlineSize(longest) : 1;
    const fs = e.size * auto * (o.sizeMul || 1) * KX;
    const track = (e.track != null ? e.track : 0.05) + (o.trackAdd || 0);
    const open = '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + COND + '" font-weight="600" font-size="' + fs + '" letter-spacing="' + fs * track + '" fill="' + fill + '">';
    if (lines.length <= 1) return open + up(txt) + '</text>';
    /* stacked all-caps condensed lines at the guide's tight 75% subhead leading */
    const lh = fs * (e.lh != null ? e.lh : 0.75);
    return open + lines.map((ln, i) => '<tspan x="' + e.x * KX + '" dy="' + (i === 0 ? 0 : lh) + '">' + up(ln) + '</tspan>').join('') + '</text>';
  }
  function diamondEl(e, fill) {
    const s = e.s * KX, cx = e.cx * KX, cy = e.cy * KY;
    /* four-point spark, quiet curves - matches the reference accents */
    return '<path d="M' + cx + ' ' + (cy - s) +
      ' Q' + (cx + s * 0.18) + ' ' + (cy - s * 0.18) + ' ' + (cx + s) + ' ' + cy +
      ' Q' + (cx + s * 0.18) + ' ' + (cy + s * 0.18) + ' ' + cx + ' ' + (cy + s) +
      ' Q' + (cx - s * 0.18) + ' ' + (cy + s * 0.18) + ' ' + (cx - s) + ' ' + cy +
      ' Q' + (cx - s * 0.18) + ' ' + (cy - s * 0.18) + ' ' + cx + ' ' + (cy - s) + ' Z" fill="' + fill + '"/>';
  }

  /* Beer pattern tiled edge-to-edge; density sets the column count.
     Tonal per the guide: pattern renders at full strength in the
     colorway's pattern hex. */
  function patternField(pat, color, cols) {
    if (!pat) return '';
    const p = pat.vb.split(/\s+/).map(Number);
    const vw = p[2] || 100, vh = p[3] || 100;
    const tw = W / cols, th = tw * (vh / vw);
    let s = '';
    for (let row = 0; row * th < H; row++) {
      for (let col = 0; col < cols; col++) {
        s += '<svg x="' + (col * tw) + '" y="' + (row * th) + '" width="' + tw + '" height="' + th + '" viewBox="' + pat.vb + '" preserveAspectRatio="xMidYMid slice"><g fill="' + color + '">' + pat.body + '</g></svg>';
      }
    }
    return s;
  }

  /* Brand shape recolored to the band color so its decorative top
     edge becomes the band's edge. Shapes differ: some are full
     masses anchored to their viewBox bottom, some are thin strips
     floating mid-viewBox - the measured bbox (from load()) anchors
     either kind to the band line without gaps. */
  function bandWithShape(e, shape, bandColor) {
    const bandY = e.y * KY;
    const poke = (e.poke || 150) * KY;
    let s = '';
    if (shape) {
      const p = shape.vb.split(/\s+/).map(Number);
      const vw = p[2] || 100, vh = p[3] || 100;
      const w = W * 1.04, k = w / vw, h = w * (vh / vw);
      const x = (W - w) / 2;
      const bb = shape.bbox || { y: 0, h: vh };
      const massH = bb.h * k;
      /* thin strips sit on the band edge; large masses poke above it
         and their body disappears into the band */
      const y = massH <= poke * 2.5
        ? bandY - massH - bb.y * k
        : (bandY - poke) - bb.y * k;
      s += '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="' + shape.vb + '" preserveAspectRatio="xMidYMid meet"><g fill="' + bandColor + '">' + shape.body + '</g></svg>';
    }
    s += '<rect x="0" y="' + bandY + '" width="' + W + '" height="' + (H - bandY) + '" fill="' + bandColor + '"/>';
    return s;
  }

  /* ---------- poster ----------
     card = { beer, colorway, shape (1-based), density }
     c    = { headline, subheadline, h1Mul, h1Track, h2Mul, h2Track }
     opts = { canHref, tag } */
  function wrap(id, str, tag) { return (tag && str) ? '<g data-el="' + id + '">' + str + '</g>' : str; }
  function buildPosterSVG(card, c, opts) {
    opts = opts || {};
    const E = SPEC.beerfeature.elements;
    const beer = beerById(card.beer);
    const paint = colorwayById(card.colorway).paint(beer);
    const density = densityById(card.density);
    const shape = A.shapes[(card.shape - 1 + SHAPE_COUNT) % SHAPE_COUNT];
    const tag = !!opts.tag;

    let s = '<rect width="' + W + '" height="' + H + '" fill="' + paint.bg + '"/>';
    s += wrap('beerfeature.pattern', patternField(A.patterns[beer.id], paint.pattern, density.cols), tag);

    /* band + shape sit under the can so the can fronts the divider
       notch, exactly as in the reference poster */
    s += wrap('beerfeature.band', bandWithShape(E.band, shape, paint.band), tag);

    const canH = E.can.h * KY, canW = canH * beer.canAspect;
    const href = opts.canHref || beer.can;
    s += wrap('beerfeature.can', '<image x="' + (E.can.cx * KX - canW / 2) + '" y="' + (E.can.y * KY) + '" width="' + canW + '" height="' + canH + '" href="' + esc(href) + '" preserveAspectRatio="xMidYMid meet"/>', tag);

    /* wordmark bleeds the top edge, over the pattern */
    if (A.wordmark) s += wrap('beerfeature.wordmark', placeSVG(A.wordmark, { cx: E.wordmark.cx * KX, y: E.wordmark.y * KY, w: E.wordmark.w * KX, color: paint.wordmark }), tag);
    s += wrap('beerfeature.brewing', condText(E.brewing, 'Brewing', paint.wordmark), tag);
    s += wrap('beerfeature.headline', condText(E.headline, c.headline, paint.bandText, { autosize: true, sizeMul: c.h1Mul, trackAdd: c.h1Track }), tag);
    if (c.subheadline) s += wrap('beerfeature.subheadline', condText(E.subheadline, c.subheadline, paint.bandText, { sizeMul: c.h2Mul, trackAdd: c.h2Track }), tag);
    s += wrap('beerfeature.diamondL', diamondEl(E.diamondL, paint.bandText), tag);
    s += wrap('beerfeature.diamondR', diamondEl(E.diamondR, paint.bandText), tag);

    /* width/height in inches => true print-size artboard in Illustrator */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + s + '</svg>';
  }

  /* Export translation: name the print faces first so Adobe
     connects them. This concept is all condensed + sans; serif
     included for future concepts. */
  function toPrintFonts(svg) {
    return svg
      .split("'Bitter',Georgia,serif").join("'Superclarendon','Bitter',Georgia,serif")
      .split("'Barlow Condensed','Barlow Semi Condensed',sans-serif").join("'Alternate Gothic No.2 D','Barlow Condensed','Barlow Semi Condensed',sans-serif")
      .split("'Poppins',system-ui,sans-serif").join("'Gotham','Poppins',system-ui,sans-serif")
      .replace(/(font-family="'Superclarendon'[^"]*"[^>]*font-weight=")600/g, '$1400')
      .replace(/(font-family="'Superclarendon'[^"]*"[^>]*font-weight=")500/g, '$1300');
  }

  /* ---------- boot ---------- */
  async function loadOne(url) { try { const r = await fetch(url); if (r.ok) return parse(await r.text()); } catch (e) {} return null; }
  /* Measure each shape's real filled bounds - placement math needs
     to know where the mass sits inside its viewBox. */
  function measureShapes() {
    const host = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    host.setAttribute('style', 'position:absolute;left:-9999px;top:-9999px;width:10px;height:10px');
    document.body.appendChild(host);
    A.shapes.forEach(sh => {
      if (!sh) return;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = sh.body;
      host.appendChild(g);
      try { const b = g.getBBox(); sh.bbox = { x: b.x, y: b.y, w: b.width, h: b.height }; } catch (e) {}
      host.removeChild(g);
    });
    document.body.removeChild(host);
  }
  async function load() {
    A.wordmark = await loadOne(WORDMARK_URL);
    A.shapes = await Promise.all(Array.from({ length: SHAPE_COUNT }, (_, i) => loadOne(shapeUrl(i + 1))));
    await Promise.all(BEERS.map(async b => { A.patterns[b.id] = await loadOne(b.pattern); }));
    measureShapes();
  }

  return {
    SIZES: SIZES, BEERS: BEERS, COLORWAYS: COLORWAYS, DENSITIES: DENSITIES, SHAPE_COUNT: SHAPE_COUNT,
    get SIZE() { return SIZE; },
    get SPEC() { return SPEC; },
    setSize: setSize, setSpec: setSpec,
    buildPosterSVG: buildPosterSVG, toPrintFonts: toPrintFonts,
    beerById: beerById, colorwayById: colorwayById, densityById: densityById,
    esc: esc, up: up, shapeUrl: shapeUrl,
    load: load
  };
})();
