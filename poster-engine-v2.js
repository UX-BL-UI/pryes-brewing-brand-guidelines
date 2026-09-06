/* ============================================================
   PRYES POSTER ENGINE - V2
   Renderer for the V2 concepts (concept-board.html + concept-editor.html).
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
      id: 'course-correct',
      name: 'Course Correct',
      headline: 'Course Correct',
      subheadline: 'Available Now',
      can: 'assets/photos/course-correct-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#8FBE3F', deep: '#64941F', accent: '#3C5E12' }
    },
    {
      id: 'glamorama',
      name: 'Glamorama',
      headline: 'Glamorama',
      subheadline: 'Available Now',
      can: 'assets/photos/glamorama-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#B00D0D', deep: '#8C0909', accent: '#7C0A0C' }
    },
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
    },
    {
      id: 'mass-haze-teria',
      name: 'Mass Haze-Teria',
      headline: 'Mass Haze-Teria',
      subheadline: 'Available Now',
      can: 'assets/photos/mass-haze-teria-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#E09150', deep: '#B53B12', accent: '#98300C' }
    },
    {
      id: 'miraculum',
      name: 'Miraculum',
      headline: 'Miraculum',
      subheadline: 'Available Now',
      can: 'assets/photos/miraculum-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#213B1E', deep: '#32492B', accent: '#182D15' }
    },
    {
      id: 'peace-offering',
      name: 'Peace Offering',
      headline: 'Peace Offering',
      subheadline: 'Available Now',
      can: 'assets/photos/peace-offering-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#141414', deep: '#2E2E2E', accent: '#101019' }
    },
    {
      id: 'pragmatic',
      name: 'Pragmatic',
      headline: 'Pragmatic',
      subheadline: 'Available Now',
      can: 'assets/photos/pragmatic-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#5FB0D0', deep: '#25689E', accent: '#174B80' }
    },
    {
      id: 'pryes-gold',
      name: 'Pryes Gold',
      headline: 'Pryes Gold',
      subheadline: 'Available Now',
      can: 'assets/photos/pryes-gold-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#D5C455', deep: '#B5951F', accent: '#1C1A12' }
    },
    {
      id: 'royal-peach',
      name: 'Royal Peach',
      headline: 'Royal Peach',
      subheadline: 'Available Now',
      can: 'assets/photos/royal-peach-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#C87040', deep: '#A0522A', accent: '#B02820' }
    },
    {
      id: 'royal-pineapple',
      name: 'Royal Pineapple',
      headline: 'Royal Pineapple',
      subheadline: 'Available Now',
      can: 'assets/photos/royal-pineapple-can.png',
      canAspect: 3000 / 4000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#4E7A22', deep: '#3A5E14', accent: '#2F4D10' }
    },
    {
      id: 'royal-raspberry',
      name: 'Royal Raspberry',
      headline: 'Royal Raspberry',
      subheadline: 'Available Now',
      can: 'assets/photos/royal-raspberry-can.png',
      canAspect: 1500 / 2000,
      pattern: 'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg',
      patternName: 'Laurels',
      colors: { bg: '#8E1119', deep: '#700D14', accent: '#8E1119' }
    }
  ];

  /* ---------- colorways ----------
     Beer-driven: the featured beer supplies its own colors and the
     brand palette fills in the rest. paint(beer) resolves the
     concrete hexes for one card. Dark beers can have accent ~= bg;
     lum/toneUp keep patterns and partner marks legible there. */
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  }
  function toneUp(hex, t) {
    const n = parseInt(hex.slice(1), 16), F = [255, 241, 228];
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map((v, i) => Math.round(v + (F[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  /* Legibility gate: type that carries information (band headlines,
     co-brand ink, partner marks) must clear WCAG 3:1 on its field.
     A failing ink is swapped for the best-contrasting brand ink.
     The big PRYES wordmark is intentionally NOT gated - tone-on-tone
     wordmarks (foam on gold) are approved brand canon. */
  function relLum(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  }
  function contrast(a, b) {
    const la = relLum(a), lb = relLum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function legible(fg, bg) {
    if (contrast(fg, bg) >= 3) return fg;
    return [fg, BRAND.foam, BRAND.burgundy, BRAND.offblack]
      .sort((x, y) => contrast(y, bg) - contrast(x, bg))[0];
  }
  /* Exact shape hit-test: is poster-space point (px,py) on the painted
     shape? Uses the real path geometry, so frame shapes with hollow
     centers (e.g. shape 12) report their holes correctly. */
  const hitCtx = (typeof document !== 'undefined') ? document.createElement('canvas').getContext('2d') : null;
  function shapeHit(shapeAsset, r, px, py) {
    if (!hitCtx || !shapeAsset) return false;
    if (px < r.cx - r.w / 2 || px > r.cx + r.w / 2 || py < r.y || py > r.y + r.h) return false;
    if (!shapeAsset.hitPaths) {
      shapeAsset.hitPaths = [];
      const re = /<path[^>]*\sd="([^"]+)"/g;
      let m;
      while ((m = re.exec(shapeAsset.body))) shapeAsset.hitPaths.push(new Path2D(m[1]));
    }
    const p = shapeAsset.vb.split(/\s+/).map(Number);
    const vx = (px - (r.cx - r.w / 2)) / r.w * (p[2] || 100) + (p[0] || 0);
    const vy = (py - r.y) / r.h * (p[3] || 100) + (p[1] || 0);
    return shapeAsset.hitPaths.some(path => hitCtx.isPointInPath(path, vx, vy));
  }
  const COLORWAYS = [
    { id:'beer',     name:'Beer color',      weight:3, paint: b => ({ bg:b.colors.bg, pattern:b.colors.deep, wordmark:BRAND.foam, band:BRAND.foam, bandText:b.colors.accent }) },
    { id:'accent',   name:'Beer accent',     weight:1, paint: b => { const pat = Math.abs(lum(b.colors.accent) - lum(b.colors.bg)) < 0.12 ? toneUp(b.colors.accent, 0.16) : b.colors.bg; return { bg:b.colors.accent, pattern:pat, wordmark:BRAND.foam, band:BRAND.foam, bandText:b.colors.accent }; } },
    { id:'burgundy', name:'Regal Burgundy',  weight:1, paint: b => ({ bg:BRAND.burgundy, pattern:BRAND.burgundyDeep, wordmark:BRAND.foam, band:BRAND.foam, bandText:BRAND.burgundy }) },
    { id:'offblack', name:'Off-Black',       weight:1, paint: b => ({ bg:BRAND.offblack, pattern:BRAND.burgundy, wordmark:BRAND.foam, band:BRAND.foam, bandText:BRAND.offblack }) },
    { id:'foam',     name:'Beer Foam',       weight:1, paint: b => ({ bg:BRAND.foam, pattern:BRAND.beige, wordmark:BRAND.burgundy, band:b.colors.bg, bandText:b.colors.accent }) }
  ];

  /* cols = poster widths per tile; fractional cols keep even the
     biggest tiles interleaving. Rescaled to Ben's reference swatch
     2026-07-31: Loose matches the swatch, Tight is the old Medium,
     Medium sits between. */
  const DENSITIES = [
    { id:'loose',  name:'Loose',  cols: 0.85 },
    { id:'medium', name:'Medium', cols: 1.35 },
    { id:'tight',  name:'Tight',  cols: 1.8 }
  ];

  /* All BEERFOAM masters - recolored per colorway at render time */
  const ASSET_URLS = {
    wordmark:    'assets/logos/svg/BEERFOAM/PRYES-WORDMARK-BEERFOAM.svg',
    wordmarktag: 'assets/logos/svg/BEERFOAM/PRYES-WORDMARK+TAGLINE-BEERFOAM.svg',
    lockup:      'assets/logos/svg/BEERFOAM/PRYES-CREST+WORDMARK+TAGLINE-BEERFOAM.svg',
    lockupopen:  'assets/logos/svg/BEERFOAM/PRYES-CREST-NOBORDER+WORDMARK+TAGLINE-BEERFOAM.svg',
    crest:       'assets/logos/svg/BEERFOAM/PRYES-CREST-NOBORDER-BEERFOAM.svg',
    crestcircle: 'assets/logos/svg/BEERFOAM/PRYES-CREST-CIRCLE01-BEERFOAM.svg',
    pmark:       'assets/logos/svg/BEERFOAM/PRYES-P-WATERMARK-BEERFOAM.svg',
    mnicon:      'assets/logos/svg/BEERFOAM/PRYES-MN-ICON-BEERFOAM.svg',
    laurels:     'assets/logos/svg/BEERFOAM/PRYES-LAURELS-BEERFOAM.svg'
  };
  const ASSET_OPTIONS = [
    { id: 'wordmarktag', label: 'Pryes Brewing wordmark' },
    { id: 'wordmark',    label: 'Wordmark - PRYES only' },
    { id: 'lockup',      label: 'Crest + wordmark lockup' },
    { id: 'lockupopen',  label: 'Open crest + wordmark' },
    { id: 'crest',       label: 'Crest' },
    { id: 'crestcircle', label: 'Crest circle' },
    { id: 'pmark',       label: 'P watermark' },
    { id: 'mnicon',      label: 'Minnesota icon' },
    { id: 'laurels',     label: 'Laurel wreath' }
  ];

  /* ---------- concepts ---------- */
  const CONCEPTS = [
    { id: 'beerfeature', label: 'Beer feature' },
    { id: 'brandfocus',  label: 'Brand focus' },
    { id: 'cobrand',     label: 'Co-branded' },
    { id: 'photofocus',  label: 'Photo focus' }
  ];

  /* Photo-focus library: real photography only. Add a photo by
     dropping it in assets/photos and adding a row here. */
  const FOCUS_PHOTOS = [
    { id: 'miraculum-cooler', name: 'Miraculum cooler', file: 'assets/photos/miraculum-cooler.jpg' }
  ];
  function focusPhotoById(id) { return FOCUS_PHOTOS.find(p => p.id === id) || FOCUS_PHOTOS[0]; }

  /* ---------- partners ----------
     One-color logo files painted in the partner's own brand color.
     onDark swaps in when the poster field is dark so the mark stays
     legible. Add a partner by dropping an SVG in assets/partners
     and adding a row here. */
  const PARTNERS = [
    { id: 'twins', name: 'Twins', file: 'assets/partners/twins.svg', color: '#D2232A', onDark: BRAND.foam }
  ];
  function partnerById(id) { return PARTNERS.find(p => p.id === id) || PARTNERS[0]; }

  /* Co-branded colorways: brand palette plus the featured beer's
     own colors; dark = use the partner's onDark ink. */
  function isDarkField(hex) { return lum(hex) < 0.5; }
  const COBRAND_WAYS = [
    { id:'foam',      name:'Beer Foam',       weight:2, paint: b => ({ bg:BRAND.foam, plaque:BRAND.beige, ink:BRAND.burgundy, dark:false }) },
    { id:'beerfield', name:'Beer color',      weight:1, paint: b => { const dark = isDarkField(b.colors.bg); return { bg:b.colors.bg, plaque:BRAND.foam, ink: dark ? BRAND.foam : b.colors.accent, dark: dark }; } },
    { id:'beerplaque',name:'Beer plaque',     weight:1, paint: b => ({ bg:BRAND.foam, plaque:b.colors.bg, ink:BRAND.burgundy, dark:false }) },
    { id:'beige',     name:'Beige',           weight:1, paint: b => ({ bg:BRAND.beige, plaque:BRAND.foam, ink:BRAND.burgundy, dark:false }) },
    { id:'burgundy',  name:'Regal Burgundy',  weight:1, paint: b => ({ bg:BRAND.burgundy, plaque:BRAND.burgundyDeep, ink:BRAND.foam, dark:true }) },
    { id:'offblack',  name:'Off-Black',       weight:1, paint: b => ({ bg:BRAND.offblack, plaque:BRAND.burgundy, ink:BRAND.foam, dark:true }) }
  ];
  function cobrandWayById(id) { return COBRAND_WAYS.find(c => c.id === id) || COBRAND_WAYS[0]; }

  /* Brand-focus colorways: no beer involved - background, ink, and
     the two center marks move through the brand palette. Wreath and
     P watermark carry their own tint + opacity per colorway. */
  const BRAND_COLORWAYS = [
    { id:'foam',      name:'Beer Foam',       weight:2, paint: { bg:BRAND.foam, ink:BRAND.burgundy, wreath:'#E2CCB8', wreathOp:1, pmark:'#E2CCB8', pmarkOp:0.55 } },
    { id:'beige',     name:'Beige',           weight:1, paint: { bg:BRAND.beige, ink:BRAND.burgundy, wreath:BRAND.foam, wreathOp:1, pmark:BRAND.foam, pmarkOp:0.62 } },
    { id:'burgundy',  name:'Regal Burgundy',  weight:1, paint: { bg:BRAND.burgundy, ink:BRAND.foam, wreath:BRAND.burgundyDeep, wreathOp:1, pmark:BRAND.burgundyDeep, pmarkOp:0.9 } },
    { id:'offblack',  name:'Off-Black',       weight:1, paint: { bg:BRAND.offblack, ink:BRAND.foam, wreath:BRAND.burgundy, wreathOp:1, pmark:BRAND.burgundy, pmarkOp:0.85 } },
    { id:'miraculum', name:'Miraculum Green', weight:1, paint: { bg:BRAND.miraculum, ink:BRAND.foam, wreath:BRAND.beige, wreathOp:0.3, pmark:BRAND.beige, pmarkOp:0.18 } }
  ];
  function brandColorwayById(id) { return BRAND_COLORWAYS.find(c => c.id === id) || BRAND_COLORWAYS[0]; }
  const SHAPE_COUNT = 15;
  const shapeUrl = n => 'assets/shapes/svg/BEERFOAM/BEER FOAM SHAPE ' + String(n).padStart(2, '0') + '.svg';

  const A = { assets: {}, shapes: [], patterns: {}, partners: {} };
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
  /* the beer every tool opens on; the list itself stays alphabetical */
  const DEFAULT_BEER = 'miraculum';
  function beerById(id) { return BEERS.find(b => b.id === id) || BEERS.find(b => b.id === DEFAULT_BEER) || BEERS[0]; }
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
  function textLines(txt) { return String(txt || '').split(/\r?\n/).filter(l => l.trim().length); }
  function longestLine(txt) { const lines = textLines(txt); return lines.length ? lines.reduce((a, b) => (b.length > a.length ? b : a)) : String(txt || ''); }
  function condText(e, txt, fill, o) {
    o = o || {};
    /* fill may be an array of per-line inks (legibility gate on
       fields the text straddles); a plain string colors every line */
    const fill0 = Array.isArray(fill) ? fill[0] : fill;
    const lines = textLines(txt);
    const auto = o.autosize ? headlineSize(longestLine(txt)) : 1;
    const fs = e.size * auto * (o.sizeMul || 1) * KX;
    const track = (e.track != null ? e.track : 0.05) + (o.trackAdd || 0);
    const open = '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + COND + '" font-weight="600" font-size="' + fs + '" letter-spacing="' + fs * track + '" fill="' + fill0 + '">';
    if (lines.length <= 1) return open + up(txt) + '</text>';
    /* stacked all-caps condensed lines at the guide's tight 75% subhead leading */
    const lh = fs * (e.lh != null ? e.lh : 0.75);
    return open + lines.map((ln, i) => '<tspan x="' + e.x * KX + '" dy="' + (i === 0 ? 0 : lh) + '"' + (Array.isArray(fill) && fill[i] !== fill0 ? ' fill="' + fill[i] + '"' : '') + '>' + up(ln) + '</tspan>').join('') + '</text>';
  }
  /* Serif line (Superclarendon in print, Bitter on the web) - as
     typed, no uppercasing; multi-line at a tight title leading. */
  function serifText(e, txt, fill, o) {
    o = o || {};
    const lines = String(txt || '').split(/\r?\n/).filter(l => l.trim().length);
    const fs = e.size * (o.sizeMul || 1) * KX;
    const track = (e.track || 0) + (o.trackAdd || 0);
    const open = '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + SERIF + '" font-weight="600" font-size="' + fs + '"' + (track ? ' letter-spacing="' + fs * track + '"' : '') + ' fill="' + fill + '">';
    if (lines.length <= 1) return open + esc(txt) + '</text>';
    const lh = fs * (e.lh != null ? e.lh : 1.12);
    return open + lines.map((ln, i) => '<tspan x="' + e.x * KX + '" dy="' + (i === 0 ? 0 : lh) + '">' + esc(ln) + '</tspan>').join('') + '</text>';
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
  let patternUid = 0; /* unique symbol ids - several posters share one page */
  /* Pattern art runs 400KB+ per file; parsing it into every poster made
     pattern-heavy views slow. For on-page previews the artwork lives once
     in a persistent hidden holder and every poster references it; exports
     stay standalone and carry their own copy. */
  const patternDefs = { host: null, seen: {} };
  /* the hidden holder; if it ever leaves the document every cached
     id is stale, so the cache resets with it */
  function patternHost() {
    if (!patternDefs.host || !document.body.contains(patternDefs.host)) {
      patternDefs.host = document.createElement('div');
      patternDefs.host.setAttribute('aria-hidden', 'true');
      patternDefs.host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      document.body.appendChild(patternDefs.host);
      patternDefs.seen = {};
    }
    return patternDefs.host;
  }
  function sharedPatternId(pat, color) {
    patternHost();
    const key = (pat.key || pat.vb) + '|' + color;
    if (!patternDefs.seen[key]) {
      const id = 'pryespatshared' + (++patternUid);
      const holder = document.createElement('div');
      holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><symbol id="' + id + '" viewBox="' + pat.vb + '" preserveAspectRatio="xMidYMid slice"><g fill="' + color + '">' + pat.body + '</g></symbol></svg>';
      patternDefs.host.appendChild(holder.firstChild);
      patternDefs.seen[key] = id;
    }
    return patternDefs.seen[key];
  }
  function patternField(pat, color, cols, pE, standalone) {
    if (!pat) return '';
    pE = pE || {};
    const p = pat.vb.split(/\s+/).map(Number);
    const vw = p[2] || 100, vh = p[3] || 100;
    const tw = W / cols, th = tw * (vh / vw);
    /* the pattern art carries margins inside its viewBox, so tiles
       overlap to interleave; ovX/ovY are percent of tile size and
       come from the layout defaults (editable in the editor) */
    const ovX = tw * Math.min(90, Math.max(0, pE.ovX != null ? pE.ovX : 18)) / 100;
    const ovY = th * Math.min(90, Math.max(0, pE.ovY != null ? pE.ovY : 0)) / 100;
    const strideX = tw - ovX, strideY = th - ovY;
    /* the field can rotate (the brand laurels run at an angle);
       tile a padded region around the poster so the rotated grid
       still covers every corner */
    const angle = pE.angle || 0;
    const pad = angle ? Math.max(W, H) * 0.55 : 0;
    const regionW = W + 2 * pad, regionH = H + 2 * pad;
    const nCols = Math.max(1, Math.ceil((regionW - tw) / strideX) + 1);
    const nRows = Math.max(1, Math.ceil((regionH - th) / strideY) + 1);
    /* center the grid so leftover margin splits evenly across edges */
    const x0 = (W - ((nCols - 1) * strideX + tw)) / 2;
    const y0 = (H - ((nRows - 1) * strideY + th)) / 2;
    let s;
    if (standalone || typeof document === 'undefined') {
      /* exports carry their own copy of the art: define it once,
         stamp a copy per tile */
      const pid = 'pryespat' + (++patternUid);
      s = '<symbol id="' + pid + '" viewBox="' + pat.vb + '" preserveAspectRatio="xMidYMid slice"><g fill="' + color + '">' + pat.body + '</g></symbol>';
      for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
          s += '<use href="#' + pid + '" x="' + (x0 + c * strideX) + '" y="' + (y0 + r * strideY) + '" width="' + tw + '" height="' + th + '"/>';
        }
      }
    } else {
      /* previews paint with an SVG pattern: the browser rasterizes the
         cell once and repeats it as paint, so laying out thousands of
         art copies per poster is avoided. Tiles overlap their stride to
         interleave, and repeated cells clip at their own edges - so each
         cell draws every neighboring tile that reaches into it, arriving
         pre-interleaved and seamless at any overlap. The art is one flat
         color, so overlap order is invisible. */
      /* the pattern def itself is shared and persistent too, keyed by
         art + color + every input that shapes the grid (the padding
         that comes with an angle shifts the grid's phase), so re-renders
         reuse the browser's cached raster instead of building a fresh one */
      patternHost();
      const defKey = 'def|' + (pat.key || pat.vb) + '|' + color + '|' + cols + '|' + ovX.toFixed(2) + '|' + ovY.toFixed(2) + '|' + pad + '|' + W + 'x' + H;
      if (!patternDefs.seen[defKey]) {
        const symId = sharedPatternId(pat, color);
        const fillId = 'pryespatfill' + (++patternUid);
        /* a tile at offset -k reaches into this cell while k * stride < tile size */
        const reachX = Math.ceil(tw / strideX) - 1, reachY = Math.ceil(th / strideY) - 1;
        let cell = '';
        for (let dy = -reachY; dy <= 0; dy++) {
          for (let dx = -reachX; dx <= 0; dx++) {
            cell += '<use href="#' + symId + '" x="' + (dx * strideX) + '" y="' + (dy * strideY) + '" width="' + tw + '" height="' + th + '"/>';
          }
        }
        const holder = document.createElement('div');
        holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs><pattern id="' + fillId + '" patternUnits="userSpaceOnUse" x="' + x0 + '" y="' + y0 + '" width="' + strideX + '" height="' + strideY + '">' + cell + '</pattern></defs></svg>';
        patternDefs.host.appendChild(holder.firstChild);
        patternDefs.seen[defKey] = fillId;
      }
      s = '<rect x="' + (-pad) + '" y="' + (-pad) + '" width="' + regionW + '" height="' + regionH + '" fill="url(#' + patternDefs.seen[defKey] + ')"/>';
    }
    return angle ? '<g transform="rotate(' + angle + ' ' + (W / 2) + ' ' + (H / 2) + ')">' + s + '</g>' : s;
  }

  /* Brand shape recolored to the band color so its decorative top
     edge becomes the band's edge. Every shape number keeps its own
     placement ({ cx, y, w, h } in perShape); shapeFallback computes
     a starting placement against the band line for shapes that have
     not been hand-placed yet, using the measured bbox from load(). */
  function shapeFallback(n, bandY) {
    const shape = A.shapes[(n - 1 + SHAPE_COUNT) % SHAPE_COUNT];
    if (!shape) return { kind: 'shape', cx: 900, y: bandY - 300, w: 1872, h: 300 };
    const p = shape.vb.split(/\s+/).map(Number);
    const vw = p[2] || 100, vh = p[3] || 100;
    const w = 1872, k = w / vw;
    /* pure design-space values: the automatic placement stretches
       between print sizes exactly like a hand-placed one, and can be
       stored in the defaults without carrying a size inside it */
    const h = w * (vh / vw);
    const bb = shape.bbox || { y: 0, h: vh };
    const massH = bb.h * k;
    const bbTop = bb.y * k;
    const y = massH <= 375 ? bandY - massH - bbTop : (bandY - 150) - bbTop;
    return { kind: 'shape', cx: 900, y: Math.round(y), w: w, h: Math.round(h) };
  }
  function resolveShape(n) {
    const E = SPEC.beerfeature.elements;
    const ps = (E.shape && E.shape.perShape) || {};
    return ps[n] || shapeFallback(n, E.band.y);
  }
  /* Concept-aware variants: the co-branded plaque anchors shapes to
     a centered box instead of the band line. */
  function shapeFallbackFor(concept, n, spec) {
    spec = spec || SPEC;
    if (concept === 'cobrand') return { kind: 'shape', cx: 900, y: 476, w: 1440, h: 1455 };
    return shapeFallback(n, spec.beerfeature.elements.band.y);
  }
  function resolveShapeFor(concept, n) {
    const lay = SPEC[concept];
    const ps = (lay && lay.elements.shape && lay.elements.shape.perShape) || {};
    return ps[n] || shapeFallbackFor(concept, n);
  }
  function shapeDividerEl(n, shape, bandColor) {
    if (!shape) return '';
    const r = resolveShape(n);
    return '<svg x="' + (r.cx - r.w / 2) * KX + '" y="' + r.y * KY + '" width="' + r.w * KX + '" height="' + r.h * KY + '" viewBox="' + shape.vb + '" preserveAspectRatio="none"><g fill="' + bandColor + '">' + shape.body + '</g></svg>';
  }
  function bandEl(e, bandColor) {
    const bandY = e.y * KY;
    return '<rect x="0" y="' + bandY + '" width="' + W + '" height="' + (H - bandY) + '" fill="' + bandColor + '"/>';
  }

  /* ---------- poster ----------
     card = { beer, colorway, shape (1-based), density }
     c    = { headline, subheadline, h1Mul, h1Track, h2Mul, h2Track }
     opts = { canHref, tag } */
  function wrap(id, str, tag) { return (tag && str) ? '<g data-el="' + id + '">' + str + '</g>' : str; }

  /* ---------- resolved facts ----------
     Everything the legibility gate decides (final inks, per-line inks,
     the partner mark's ink, the auto-sized headline) is computed here,
     once. The SVG builders render from it and the board's build recipe
     reads it, so the recipe can never describe a poster differently
     than it renders. */
  function trackOf(e, add) { return (e.track != null ? e.track : 0.05) + (add || 0); }
  function resolveBeerFeature(card, c) {
    const E = SPEC.beerfeature.elements;
    const beer = beerById(card.beer);
    const way = colorwayById(card.colorway);
    const paint = way.paint(beer);
    paint.bandText = legible(paint.bandText, paint.band);
    return {
      concept: 'beerfeature', E: E, beer: beer, way: way, paint: paint,
      density: densityById(card.density),
      shape: A.shapes[(card.shape - 1 + SHAPE_COUNT) % SHAPE_COUNT],
      headlinePx: Math.round(E.headline.size * headlineSize(longestLine(c.headline)) * (c.h1Mul || 1)),
      headlineTrack: trackOf(E.headline, c.h1Track),
      subheadlinePx: Math.round(E.subheadline.size * (c.h2Mul || 1)),
      subheadlineTrack: trackOf(E.subheadline, c.h2Track)
    };
  }
  function resolveCobrand(card, c) {
    const E = SPEC.cobrand.elements;
    const beer = beerById(card.beer);
    const partner = partnerById(card.partner);
    const way = cobrandWayById(card.colorway);
    const paint = way.paint(beer);
    paint.ink = legible(paint.ink, paint.bg);
    const shapeAsset = A.shapes[(card.shape - 1 + SHAPE_COUNT) % SHAPE_COUNT];
    const r = resolveShapeFor('cobrand', card.shape);
    /* the foot elements can sit on the plaque, the background, or
       straddle both; hit-test each headline line and the partner mark
       against the real shape geometry and gate each ink to its field */
    const hFs = E.headline.size * (c.h1Mul || 1);
    const hLh = hFs * (E.headline.lh != null ? E.headline.lh : 0.75);
    const headlineInks = textLines(c.headline).map((ln, i) => {
      const y = E.headline.y + i * hLh - hFs * 0.35;
      return legible(paint.ink, shapeHit(shapeAsset, r, E.headline.x, y) ? paint.plaque : paint.bg);
    });
    const partnerField = shapeHit(shapeAsset, r, E.partner.cx, E.partner.y + 70) ? paint.plaque : paint.bg;
    const partnerInk = contrast(partner.color, partnerField) >= 3 ? partner.color
      : (contrast(partner.onDark, partnerField) > contrast(partner.color, partnerField) ? partner.onDark : partner.color);
    return {
      concept: 'cobrand', E: E, beer: beer, partner: partner, way: way, paint: paint,
      shapeAsset: shapeAsset, r: r, headlineInks: headlineInks, partnerField: partnerField, partnerInk: partnerInk,
      headlinePx: Math.round(hFs),
      headlineTrack: trackOf(E.headline, c.h1Track)
    };
  }
  function resolveBrand(card, c, concept) {
    const E = SPEC[concept].elements;
    const way = brandColorwayById(card.colorway);
    const auto = concept === 'brandfocus' ? headlineSize(longestLine(c.headline)) : 1;
    const out = {
      concept: concept, E: E, way: way, paint: way.paint,
      headlinePx: Math.round(E.headline.size * auto * (c.h1Mul || 1)),
      headlineTrack: trackOf(E.headline, c.h1Track)
    };
    if (concept === 'photofocus') out.photo = focusPhotoById(card.photo);
    if (E.subheadline) out.subheadlinePx = Math.round(E.subheadline.size * (c.h2Mul || 1));
    return out;
  }
  function describe(card, c) {
    const k = card.concept || 'beerfeature';
    if (k === 'cobrand') return resolveCobrand(card, c);
    if (k === 'brandfocus' || k === 'photofocus') return resolveBrand(card, c, k);
    return resolveBeerFeature(card, c);
  }

  /* the shipped words per poster type; beer feature words follow the beer */
  function defaultWords(concept, beerId) {
    if (concept === 'brandfocus') return { headline: "It's a\nMidwest\nThing", subheadline: 'Available\nNow', showP: true };
    if (concept === 'cobrand') return { headline: 'See You\nAt the Game', subheadline: '' };
    if (concept === 'photofocus') return { headline: 'Trust Your Taste', subheadline: '' };
    const b = beerById(beerId);
    return { headline: b.headline, subheadline: b.subheadline };
  }

  /* Brand-focus poster: flat brand field, stacked wordmark, laurel
     wreath + P watermark behind the headline, serif line at the
     foot. card = { concept:'brandfocus', colorway } */
  function buildBrandFocus(card, c, opts) {
    opts = opts || {};
    const E = SPEC.brandfocus.elements;
    const paint = brandColorwayById(card.colorway).paint;
    const tag = !!opts.tag;

    let s = '<rect width="' + W + '" height="' + H + '" fill="' + paint.bg + '"/>';
    const laurels = A.assets[E.laurels.asset || 'laurels'];
    if (laurels) s += wrap('brandfocus.laurels', placeSVG(laurels, { cx: E.laurels.cx * KX, y: E.laurels.y * KY, w: E.laurels.w * KX, color: paint.wreath, opacity: paint.wreathOp }), tag);
    const pm = A.assets[E.pmark.asset || 'pmark'];
    if (pm && c.showP !== false) s += wrap('brandfocus.pmark', placeSVG(pm, { cx: E.pmark.cx * KX, y: E.pmark.y * KY, w: E.pmark.w * KX, color: paint.pmark, opacity: paint.pmarkOp }), tag);
    const mark = A.assets[E.wordmark.asset || 'wordmarktag'];
    if (mark) s += wrap('brandfocus.wordmark', placeSVG(mark, { cx: E.wordmark.cx * KX, y: E.wordmark.y * KY, w: E.wordmark.w * KX, color: paint.ink }), tag);
    s += wrap('brandfocus.headline', condText(E.headline, c.headline, paint.ink, { autosize: true, sizeMul: c.h1Mul, trackAdd: c.h1Track }), tag);
    if (c.subheadline) s += wrap('brandfocus.subheadline', serifText(E.subheadline, c.subheadline, paint.ink, { sizeMul: c.h2Mul, trackAdd: c.h2Track }), tag);

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + s + '</svg>';
  }

  /* Co-branded poster: giant PRYES over a shape plaque framing the
     can, message left and partner logo right at the foot.
     card = { concept:'cobrand', beer, partner, shape, colorway } */
  function buildCobrand(card, c, opts) {
    opts = opts || {};
    const R = resolveCobrand(card, c);
    const E = R.E, beer = R.beer, partner = R.partner, paint = R.paint, shapeAsset = R.shapeAsset, r = R.r;
    const tag = !!opts.tag;

    let s = '<rect width="' + W + '" height="' + H + '" fill="' + paint.bg + '"/>';

    /* plaque: brand shape stretched into its hand-placed box */
    if (shapeAsset) {
      s += wrap('cobrand.shape', '<svg x="' + (r.cx - r.w / 2) * KX + '" y="' + r.y * KY + '" width="' + r.w * KX + '" height="' + r.h * KY + '" viewBox="' + shapeAsset.vb + '" preserveAspectRatio="none"><g fill="' + paint.plaque + '">' + shapeAsset.body + '</g></svg>', tag);
    }

    const canH = E.can.h * KY, canW = canH * beer.canAspect;
    const href = opts.canHref || beer.can;
    s += wrap('cobrand.can', '<image x="' + (E.can.cx * KX - canW / 2) + '" y="' + (E.can.y * KY) + '" width="' + canW + '" height="' + canH + '" href="' + esc(href) + '" preserveAspectRatio="xMidYMid meet"/>', tag);

    const mark = A.assets[E.wordmark.asset || 'wordmark'];
    if (mark) s += wrap('cobrand.wordmark', placeSVG(mark, { cx: E.wordmark.cx * KX, y: E.wordmark.y * KY, w: E.wordmark.w * KX, color: paint.ink }), tag);

    s += wrap('cobrand.headline', condText(E.headline, c.headline, R.headlineInks.length ? R.headlineInks : paint.ink, { sizeMul: c.h1Mul, trackAdd: c.h1Track }), tag);

    const logo = A.partners[partner.id];
    if (logo) s += wrap('cobrand.partner', placeSVG(logo, { cx: E.partner.cx * KX, y: E.partner.y * KY, w: E.partner.w * KX, color: R.partnerInk }), tag);

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + s + '</svg>';
  }

  /* Photo-focus poster: giant PRYES over a big photo well, headline
     with diamond accents at the foot. Brand colorways only.
     card = { concept:'photofocus', photo, colorway } */
  let PF_UID = 0;
  function buildPhotoFocus(card, c, opts) {
    opts = opts || {};
    const E = SPEC.photofocus.elements;
    const paint = brandColorwayById(card.colorway).paint;
    const photo = focusPhotoById(card.photo);
    const tag = !!opts.tag;

    let s = '<rect width="' + W + '" height="' + H + '" fill="' + paint.bg + '"/>';

    const px = E.photo.x * KX, py = E.photo.y * KY, pw = E.photo.w * KX, ph = E.photo.h * KY;
    const clipId = 'pfclip' + (PF_UID++);
    const href = opts.photoHref || photo.file;
    s += wrap('photofocus.photo',
      '<clipPath id="' + clipId + '"><rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '"/></clipPath>' +
      '<image x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" href="' + esc(href) + '" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + clipId + ')"/>', tag);

    const mark = A.assets[E.wordmark.asset || 'wordmark'];
    if (mark) s += wrap('photofocus.wordmark', placeSVG(mark, { cx: E.wordmark.cx * KX, y: E.wordmark.y * KY, w: E.wordmark.w * KX, color: paint.ink }), tag);

    s += wrap('photofocus.headline', condText(E.headline, c.headline, paint.ink, { sizeMul: c.h1Mul, trackAdd: c.h1Track }), tag);
    s += wrap('photofocus.diamondL', diamondEl(E.diamondL, paint.ink), tag);
    s += wrap('photofocus.diamondR', diamondEl(E.diamondR, paint.ink), tag);

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + s + '</svg>';
  }

  function buildPosterSVG(card, c, opts) {
    opts = opts || {};
    if ((card.concept || 'beerfeature') === 'brandfocus') return buildBrandFocus(card, c, opts);
    if ((card.concept || 'beerfeature') === 'cobrand') return buildCobrand(card, c, opts);
    if ((card.concept || 'beerfeature') === 'photofocus') return buildPhotoFocus(card, c, opts);
    const R = resolveBeerFeature(card, c);
    const E = R.E, beer = R.beer, paint = R.paint, density = R.density, shape = R.shape;
    const tag = !!opts.tag;

    let s = '<rect width="' + W + '" height="' + H + '" fill="' + paint.bg + '"/>';
    s += wrap('beerfeature.pattern', patternField(A.patterns[beer.id], paint.pattern, density.cols, E.pattern, opts.standalone), tag);

    /* shape + band sit under the can so the can fronts the divider
       notch, exactly as in the reference poster */
    s += wrap('beerfeature.shape', shapeDividerEl(card.shape, shape, paint.band), tag);
    s += wrap('beerfeature.band', bandEl(E.band, paint.band), tag);

    const canH = E.can.h * KY, canW = canH * beer.canAspect;
    const href = opts.canHref || beer.can;
    s += wrap('beerfeature.can', '<image x="' + (E.can.cx * KX - canW / 2) + '" y="' + (E.can.y * KY) + '" width="' + canW + '" height="' + canH + '" href="' + esc(href) + '" preserveAspectRatio="xMidYMid meet"/>', tag);

    /* wordmark bleeds the top edge, over the pattern - one brand
       asset (Pryes Brewing), swappable in the editor */
    const mark = A.assets[E.wordmark.asset || 'wordmarktag'];
    if (mark) s += wrap('beerfeature.wordmark', placeSVG(mark, { cx: E.wordmark.cx * KX, y: E.wordmark.y * KY, w: E.wordmark.w * KX, color: paint.wordmark }), tag);
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
    /* every file is fetched once, all requests in flight together;
       beers that share a pattern file share one parsed copy, keyed by
       the file so the shared preview art is defined once per color */
    const byUrl = {};
    const once = url => (byUrl[url] = byUrl[url] || loadOne(url));
    await Promise.all([
      Promise.all(Object.keys(ASSET_URLS).map(async k => { A.assets[k] = await once(ASSET_URLS[k]); })),
      Promise.all(Array.from({ length: SHAPE_COUNT }, (_, i) => once(shapeUrl(i + 1)))).then(list => { A.shapes = list; }),
      Promise.all(BEERS.map(async b => { A.patterns[b.id] = await once(b.pattern); if (A.patterns[b.id]) A.patterns[b.id].key = b.pattern; })),
      Promise.all(PARTNERS.map(async p => { A.partners[p.id] = await once(p.file); }))
    ]);
    measureShapes();
  }

  return {
    SIZES: SIZES, BEERS: BEERS, DEFAULT_BEER: DEFAULT_BEER, COLORWAYS: COLORWAYS, DENSITIES: DENSITIES, SHAPE_COUNT: SHAPE_COUNT, ASSET_OPTIONS: ASSET_OPTIONS,
    CONCEPTS: CONCEPTS, BRAND_COLORWAYS: BRAND_COLORWAYS, brandColorwayById: brandColorwayById,
    PARTNERS: PARTNERS, partnerById: partnerById, COBRAND_WAYS: COBRAND_WAYS, cobrandWayById: cobrandWayById,
    FOCUS_PHOTOS: FOCUS_PHOTOS, focusPhotoById: focusPhotoById,
    resolveShapeFor: resolveShapeFor, shapeFallbackFor: shapeFallbackFor,
    get SIZE() { return SIZE; },
    get SPEC() { return SPEC; },
    setSize: setSize, setSpec: setSpec,
    buildPosterSVG: buildPosterSVG, toPrintFonts: toPrintFonts,
    describe: describe, defaultWords: defaultWords,
    beerById: beerById, colorwayById: colorwayById, densityById: densityById,
    resolveShape: resolveShape, shapeFallback: shapeFallback,
    esc: esc, up: up, shapeUrl: shapeUrl,
    load: load
  };
})();
