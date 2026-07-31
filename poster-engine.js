/* ============================================================
   PRYES POSTER ENGINE
   Shared renderer for concept-board.html and concept-editor.html.
   Geometry comes from layout-defaults.js (window.PRYES_LAYOUT_DEFAULTS);
   this file owns brand tokens, assets, type classes, and rendering.
   ============================================================ */
window.PryesPoster = (function () {
  const SIZES = [
    { key:'s1117', label:'11 × 17 in', slug:'11x17', w:1100, h:1700, inW:'11in', inH:'17in', signType:'Standard BOTM Poster 11x17' },
    { key:'s1824', label:'18 × 24 in', slug:'18x24', w:1800, h:2400, inW:'18in', inH:'24in', signType:'Poster 18x24' }
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

  /* Preview uses the guide's web faces ONLY - macOS ships Superclarendon, so naming print
     faces here would make Mac previews render heavier/wider than the guide's specimens.
     Exports swap in the print faces via toPrintFonts(). */
  const SERIF = "'Bitter',Georgia,serif";
  const COND  = "'Barlow Condensed','Barlow Semi Condensed',sans-serif";
  const SANS  = "'Poppins',system-ui,sans-serif";
  /* Type matches the guide page's own specimen CSS: subheads 0.05em at 600, headers serif 600,
     body serif 500, callouts sans 300 at 0.15em. Per-element track/lh come from layout-defaults. */

  /* tonal = the guide's background-art colorway ("keep colorways tonal - Beige on Beer Foam,
     Off-Black Burgundy on Regal Burgundy"); families without one fall back to a faint accent. */
  const FAMILIES = [
    { id:'burgundy',  name:'Regal Burgundy',   bg:'#3E0F23', ink:'#FFF1E4', accent:'#EBCFB8', tonal:'#320C1C', weight:3 },
    { id:'foam',      name:'Beer Foam',        bg:'#FFF1E4', ink:'#3E0F23', accent:'#3E0F23', tonal:'#EBCFB8', weight:1 },
    { id:'miraculum', name:'Miraculum Green',  bg:'#213B1E', ink:'#FFF1E4', accent:'#EBCFB8', weight:1 },
    { id:'beige',     name:'Beige',            bg:'#EBCFB8', ink:'#3E0F23', accent:'#213B1E', weight:1 },
    { id:'offblack',  name:'Off-Black',        bg:'#101019', ink:'#FFF1E4', accent:'#EBCFB8', tonal:'#3E0F23', weight:1 }
  ];
  const IMAGES  = [ {id:'laurel',label:'Laurel field'}, {id:'emblem',label:'Crest emblem'}, {id:'shapes',label:'Shape block'}, {id:'well',label:'Photo well'} ];
  const LAYOUTS = [ {id:'stacked',label:'Stacked'}, {id:'anchored',label:'Anchored'}, {id:'framed',label:'Framed'}, {id:'feature',label:'Featured can'} ];

  const ASSET_URLS = {
    wordmark:    'assets/logos/svg/BEERFOAM/PRYES-WORDMARK-BEERFOAM.svg',
    wordmarktag: 'assets/logos/svg/BEERFOAM/PRYES-WORDMARK+TAGLINE-BEERFOAM.svg',
    lockup:      'assets/logos/svg/BEERFOAM/PRYES-CREST+WORDMARK+TAGLINE-BEERFOAM.svg',
    lockupopen:  'assets/logos/svg/BEERFOAM/PRYES-CREST-NOBORDER+WORDMARK+TAGLINE-BEERFOAM.svg',
    crest:       'assets/logos/svg/BEERFOAM/PRYES-CREST-NOBORDER-BEERFOAM.svg',
    crestcircle: 'assets/logos/svg/BEERFOAM/PRYES-CREST-CIRCLE01-BEERFOAM.svg',
    pmark:       'assets/logos/svg/BEERFOAM/PRYES-P-WATERMARK-BEERFOAM.svg',
    mnicon:      'assets/logos/svg/BEERFOAM/PRYES-MN-ICON-BEERFOAM.svg',
    laurel:      'assets/patterns/svg/BEIGE/PRYES-PATTERN-LAURELS-BEIGE.svg'
  };
  /* Marks the editor can swap between on any asset element */
  const ASSET_OPTIONS = [
    { id: 'wordmark',    label: 'Wordmark - PRYES' },
    { id: 'wordmarktag', label: 'Wordmark + Brewing' },
    { id: 'lockup',      label: 'Crest + wordmark lockup' },
    { id: 'lockupopen',  label: 'Open crest + wordmark' },
    { id: 'crest',       label: 'Crest' },
    { id: 'crestcircle', label: 'Crest circle' },
    { id: 'pmark',       label: 'P watermark' },
    { id: 'mnicon',      label: 'Minnesota icon' }
  ];
  const SHAPE_URLS = [3,5,8,11,14].map(n => 'assets/shapes/svg/BEERFOAM/BEER FOAM SHAPE ' + String(n).padStart(2,'0') + '.svg');
  const A = { shapes: [] };
  const PHOTOS = [];
  let UID = 0;
  let SPEC = window.PRYES_LAYOUT_DEFAULTS;
  function setSpec(s) { SPEC = s; }

  /* ---------- asset parsing + placement ---------- */
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
  function famById(id) { return FAMILIES.find(f => f.id === id) || FAMILIES[0]; }

  function placeAsset(o) {
    const a = A[o.key];
    if (!a) return fallbackAsset(o);
    const p = a.vb.split(/\s+/).map(Number);
    const vw = p[2] || 100, vh = p[3] || 100;
    const w = o.w, h = o.h || w * (vh / vw);
    const x = (o.cx != null) ? o.cx - w / 2 : o.x;
    const op = o.opacity != null ? ' opacity="' + o.opacity + '"' : '';
    const par = o.slice ? 'xMidYMid slice' : 'xMidYMid meet';
    return '<svg x="' + x + '" y="' + o.y + '" width="' + w + '" height="' + h + '" viewBox="' + a.vb + '" preserveAspectRatio="' + par + '"><g fill="' + o.color + '"' + op + '>' + a.body + '</g></svg>';
  }
  function fallbackAsset(o) {
    const w = o.w, x = (o.cx != null) ? o.cx : o.x + w / 2;
    const op = o.opacity != null ? ' opacity="' + o.opacity + '"' : '';
    if (o.key === 'pmark' || o.key === 'crest')
      return '<text x="' + x + '" y="' + (o.y + w * 0.72) + '" text-anchor="middle" font-family="' + SERIF + '" font-size="' + (w * 0.9) + '" fill="' + o.color + '"' + op + '>P</text>';
    return '<text x="' + x + '" y="' + (o.y + (o.h || w * 0.2) * 0.82) + '" text-anchor="middle" font-family="' + SERIF + '" font-size="' + (w * 0.2) + '" fill="' + o.color + '"' + op + '>PRYES</text>';
  }

  /* ---------- element renderers (geometry from the spec) ---------- */
  function nameSize(s) { const n = (s || '').length; return n <= 6 ? 300 : n <= 9 ? 250 : n <= 12 ? 200 : n <= 16 ? 155 : n <= 22 ? 120 : 96; }
  function assetEl(e, color) {
    const o = { key: e.asset, y: e.y * KY, w: e.w * KX, color: color };
    if (e.cx != null) o.cx = e.cx * KX; else o.x = e.x * KX;
    if (e.opacity != null) o.opacity = e.opacity;
    return placeAsset(o);
  }
  function nameEl(e, txt, fill) {
    const fs = nameSize(txt) * (e.scale || 1) * KX;
    const ls = fs * (e.track || 0);
    return '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + SERIF + '" font-size="' + fs + '"' + (ls ? ' letter-spacing="' + ls + '"' : '') + ' font-weight="600" fill="' + fill + '">' + esc(txt) + '</text>';
  }
  function subEl(e, txt, fill) {
    const fs = e.size * KX;
    const open = '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + COND + '" font-weight="600" font-size="' + fs + '" letter-spacing="' + fs * (e.track != null ? e.track : 0.05) + '" fill="' + fill + '">';
    const lines = String(txt || '').split(/\r?\n/).filter(l => l.trim().length);
    if (lines.length <= 1) return open + up(txt) + '</text>';
    /* stacked all-caps condensed lines at the guide's tight 75% subhead leading */
    const lh = fs * (e.lh != null ? e.lh : 0.75);
    return open + lines.map((ln, i) => '<tspan x="' + e.x * KX + '" dy="' + (i === 0 ? 0 : lh) + '">' + up(ln) + '</tspan>').join('') + '</text>';
  }
  function capEl(e, txt, fill) {
    const fs = e.size * KX;
    return '<text x="' + e.x * KX + '" y="' + e.y * KY + '" text-anchor="' + (e.anchor || 'middle') + '" font-family="' + SANS + '" font-weight="300" font-size="' + fs + '" letter-spacing="' + fs * (e.track != null ? e.track : 0.15) + '" fill="' + fill + '"' + (e.opacity != null ? ' fill-opacity="' + e.opacity + '"' : '') + '>' + up(txt) + '</text>';
  }
  function bodyEl(e, t, fill) {
    if (!t) return '';
    const anchor = e.anchor || 'middle';
    const x = e.x * KX, size = e.size * KX;
    const words = t.split(/\s+/), max = anchor === 'middle' ? 32 : 36, lines = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur);
    const lh = size * (e.lh != null ? e.lh : 1.5);
    const ts = lines.slice(0, 3).map((ln, i) => '<tspan x="' + x + '" dy="' + (i === 0 ? 0 : lh) + '">' + esc(ln) + '</tspan>').join('');
    return '<text x="' + x + '" y="' + e.y * KY + '" text-anchor="' + anchor + '" font-family="' + SERIF + '" font-size="' + size + '" font-weight="500" fill="' + fill + '" fill-opacity="0.92">' + ts + '</text>';
  }
  function ruleEl(e, fam, op, sw) {
    return '<line x1="' + e.x1 * KX + '" y1="' + e.y * KY + '" x2="' + e.x2 * KX + '" y2="' + e.y * KY + '" stroke="' + fam.ink + '" stroke-opacity="' + op + '" stroke-width="' + (sw || 2) + '"/>';
  }
  function statsEl(e, c, fam) {
    const vals = [c.abv, c.ibu, c.date];
    const xs = [W * 0.28, W * 0.5, W * 0.72];
    const y = e.y * KY, fs = e.size * KX;
    let s = '';
    xs.forEach((x, i) => { if (vals[i]) s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="' + COND + '" font-weight="600" font-size="' + fs + '" letter-spacing="' + fs * (e.track != null ? e.track : 0.05) + '" fill="' + fam.ink + '">' + up(vals[i]) + '</text>'; });
    s += '<line x1="' + (W * 0.39) + '" y1="' + (y - 50 * KY) + '" x2="' + (W * 0.39) + '" y2="' + (y + 8 * KY) + '" stroke="' + fam.ink + '" stroke-opacity="0.32"/>';
    s += '<line x1="' + (W * 0.61) + '" y1="' + (y - 50 * KY) + '" x2="' + (W * 0.61) + '" y2="' + (y + 8 * KY) + '" stroke="' + fam.ink + '" stroke-opacity="0.32"/>';
    return s;
  }

  /* ---------- hero treatments ---------- */
  function patternCover(r, fam, op) {
    if (!A.laurel) return '';
    return '<svg x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" viewBox="' + A.laurel.vb + '" preserveAspectRatio="xMidYMid slice"><g fill="' + fam.accent + '" opacity="' + op + '">' + A.laurel.body + '</g></svg>';
  }
  function shapeDecor(fam, op, seed, r) {
    r = r || { x: 0, y: 0, w: W, h: H };
    if (!A.shapes.length || !A.shapes[0]) return patternCover(r, fam, op);
    const sh = A.shapes[seed % A.shapes.length];
    const pp = sh.vb.split(/\s+/).map(Number), vw = pp[2], vh = pp[3];
    const w = r.w * 1.25, h = w * (vh / vw);
    return '<svg x="' + (r.x - r.w * 0.12) + '" y="' + (r.y + r.h - h * 0.86) + '" width="' + w + '" height="' + h + '" viewBox="' + sh.vb + '" preserveAspectRatio="xMidYMid meet"><g fill="' + fam.accent + '" opacity="' + op + '">' + sh.body + '</g></svg>';
  }
  function photoWell(r, fam, card) {
    if (PHOTOS.length) {
      const p = PHOTOS[(card && card.ph || 0) % PHOTOS.length];
      return '<image x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" href="assets/photos/' + esc(p.file) + '" preserveAspectRatio="xMidYMid slice"/>';
    }
    const id = 'cbg' + (UID++);
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + fam.ink + '" stop-opacity="0.92"/><stop offset="1" stop-color="' + fam.accent + '" stop-opacity="0.82"/></linearGradient></defs>' +
      '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="url(#' + id + ')"/>' +
      '<text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2) + '" text-anchor="middle" font-family="' + COND + '" font-weight="600" font-size="' + 62 * KX + '" letter-spacing="' + 62 * KX * 0.05 + '" fill="' + fam.bg + '" fill-opacity="0.92">HERO IMAGE</text>' +
      '<text x="' + (r.x + r.w / 2) + '" y="' + (r.y + r.h / 2 + 66 * KY) + '" text-anchor="middle" font-family="' + SANS + '" font-weight="300" font-size="' + 30 * KX + '" letter-spacing="' + 30 * KX * 0.15 + '" fill="' + fam.bg + '" fill-opacity="0.72">CAN RENDER OR LIFESTYLE PHOTO</text>';
  }
  function heroBehind(img, fam, seed, hero, elId, tag) {
    /* tonal families render background art in the guide's tonal colorway at full strength;
       others fall back to a faint accent tint */
    const color = fam.tonal || fam.accent;
    const op = fam.tonal ? 1 : 0.10;
    if (img === 'laurel') return patternCoverColored({ x: 0, y: 0, w: W, h: H }, color, op);
    if (img === 'shapes') return shapeDecorColored(color, op, seed);
    /* positionable background mark (crest emblem or P watermark) driven by the hero element */
    const h = hero || { cx: 900, y: 720, w: 1450 };
    const key = img === 'emblem' ? 'crest' : 'pmark';
    return wrap(elId, placeAsset({ key: key, cx: h.cx * KX, y: h.y * KY, w: h.w * KX, color: color, opacity: fam.tonal ? 1 : (key === 'crest' ? op + 0.02 : op) }), tag);
  }
  function patternCoverColored(r, color, op) {
    if (!A.laurel) return '';
    return '<svg x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" viewBox="' + A.laurel.vb + '" preserveAspectRatio="xMidYMid slice"><g fill="' + color + '" opacity="' + op + '">' + A.laurel.body + '</g></svg>';
  }
  function shapeDecorColored(color, op, seed) {
    const r = { x: 0, y: 0, w: W, h: H };
    if (!A.shapes.length || !A.shapes[0]) return patternCoverColored(r, color, op);
    const sh = A.shapes[seed % A.shapes.length];
    const pp = sh.vb.split(/\s+/).map(Number), vw = pp[2], vh = pp[3];
    const w = r.w * 1.25, h = w * (vh / vw);
    return '<svg x="' + (r.x - r.w * 0.12) + '" y="' + (r.y + r.h - h * 0.86) + '" width="' + w + '" height="' + h + '" viewBox="' + sh.vb + '" preserveAspectRatio="xMidYMid meet"><g fill="' + color + '" opacity="' + op + '">' + sh.body + '</g></svg>';
  }
  function heroBlock(img, fam, seed, r, card) {
    const id = 'cbc' + (UID++);
    let dec;
    if (img === 'laurel') dec = patternCover(r, fam, 0.18);
    else if (img === 'emblem') dec = placeAsset({ key: 'crest', cx: r.x + r.w / 2, y: r.y + r.h * 0.12, w: r.h * 0.92, color: fam.accent, opacity: 0.95 });
    else if (img === 'shapes') dec = shapeDecor(fam, 0.9, seed, r);
    else dec = photoWell(r, fam, card);
    return '<clipPath id="' + id + '"><rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '"/></clipPath>' +
      '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="' + fam.bg + '"/>' +
      '<g clip-path="url(#' + id + ')">' + dec + '</g>';
  }

  /* ---------- layouts (structure in code, geometry from SPEC) ---------- */
  function wrap(id, str, tag) { return (tag && str) ? '<g data-el="' + id + '">' + str + '</g>' : str; }
  const LAY = {
    stacked: function (c, fam, card, tag) {
      const E = SPEC.stacked.elements;
      let s = heroBehind(card.img, fam, card.seed, E.hero, 'stacked.hero', tag);
      s += wrap('stacked.lockup', assetEl(E.lockup, fam.ink), tag);
      s += wrap('stacked.name', nameEl(E.name, c.beer, fam.ink), tag);
      if (c.style) s += wrap('stacked.style', subEl(E.style, c.style, fam.accent), tag);
      s += wrap('stacked.body', bodyEl(E.body, c.tagline, fam.ink), tag);
      if (E.rule) s += wrap('stacked.rule', ruleEl(E.rule, fam, 0.24, 2), tag);
      s += wrap('stacked.stats', statsEl(E.stats, c, fam), tag);
      if (c.cta) s += wrap('stacked.callout2', capEl(E.callout2, c.cta, fam.ink), tag);
      return s;
    },
    anchored: function (c, fam, card, tag) {
      const E = SPEC.anchored.elements;
      let s = heroBlock(card.img, fam, card.seed, { x: 0, y: E.band.y * KY, w: W, h: E.band.h * KY }, card);
      s += wrap('anchored.wordmark', assetEl(E.wordmark, fam.ink), tag);
      if (c.date) s += wrap('anchored.subhead', subEl(E.subhead, c.date, fam.ink), tag);
      s += wrap('anchored.headerRule', ruleEl(E.headerRule, fam, 0.22, 2), tag);
      s += wrap('anchored.splitRule', ruleEl(E.splitRule, fam, 0.2, 2), tag);
      if (c.style) s += wrap('anchored.style', subEl(E.style, c.style, fam.accent), tag);
      s += wrap('anchored.name', nameEl(E.name, c.beer, fam.ink), tag);
      s += wrap('anchored.body', bodyEl(E.body, c.tagline, fam.ink), tag);
      const statTxt = [c.abv, c.ibu].filter(Boolean).join('   ·   ');
      if (statTxt) s += wrap('anchored.statline', subEl(E.statline, statTxt, fam.ink), tag);
      if (c.avail) s += wrap('anchored.callout', capEl(E.callout, c.avail, fam.ink), tag);
      if (c.cta) s += wrap('anchored.callout2', capEl(E.callout2, c.cta, fam.ink), tag);
      return s;
    },
    framed: function (c, fam, card, tag) {
      const E = SPEC.framed.elements;
      let s = heroBehind(card.img, fam, card.seed, E.hero, 'framed.hero', tag);
      const fx = E.frame.x * KX, fy = E.frame.y * KY;
      s += wrap('framed.frame', '<rect x="' + fx + '" y="' + fy + '" width="' + (W - 2 * fx) + '" height="' + (H - 2 * fy) + '" fill="none" stroke="' + fam.ink + '" stroke-width="' + (E.frame.stroke || 4) + '"/>', tag);
      s += wrap('framed.wordmark', assetEl(E.wordmark, fam.ink), tag);
      s += wrap('framed.eyebrow', subEl(E.eyebrow, 'New Release', fam.accent), tag);
      s += wrap('framed.name', nameEl(E.name, c.beer, fam.ink), tag);
      if (c.style) s += wrap('framed.style', subEl(E.style, c.style, fam.ink), tag);
      s += wrap('framed.body', bodyEl(E.body, c.tagline, fam.ink), tag);
      s += wrap('framed.crest', assetEl(E.crest, fam.ink), tag);
      const line = [c.abv, c.ibu, c.date].filter(Boolean).join('    ·    ');
      if (line) s += wrap('framed.statline', subEl(E.statline, line, fam.ink), tag);
      return s;
    },
    feature: function (c, fam, card, tag) {
      const E = SPEC.feature.elements;
      let s = '';
      if (A.laurel) s += patternCover({ x: 0, y: 0, w: W, h: H }, fam, 0.08);
      s += wrap('feature.wordmark', assetEl(E.wordmark, fam.ink), tag);
      if (c.style) s += wrap('feature.style', subEl(E.style, c.style, fam.accent), tag);
      if (PHOTOS.length) {
        const p = PHOTOS[(card.ph || 0) % PHOTOS.length];
        s += wrap('feature.photo', '<image x="' + E.photo.x * KX + '" y="' + E.photo.y * KY + '" width="' + E.photo.w * KX + '" height="' + E.photo.h * KY + '" href="assets/photos/' + esc(p.file) + '" preserveAspectRatio="xMidYMid meet"/>', tag);
      } else {
        s += wrap('feature.crestAlt', assetEl(E.crestAlt, fam.accent), tag);
      }
      s += wrap('feature.name', nameEl(E.name, c.beer, fam.ink), tag);
      const line = [c.date, c.avail].filter(Boolean).join('   ·   ');
      if (line) s += wrap('feature.subline', subEl(E.subline, line, fam.ink), tag);
      if (c.cta) s += wrap('feature.callout2', capEl(E.callout2, c.cta, fam.ink), tag);
      return s;
    }
  };

  function buildPosterSVG(card, c, opts) {
    opts = opts || {};
    const fam = famById(card.fam);
    /* width/height in inches => opens as a true print-size artboard in Illustrator; CSS keeps the on-screen preview at 100%. */
    const inner = '<rect width="' + W + '" height="' + H + '" fill="' + fam.bg + '"/>' + LAY[card.lay](c, fam, card, !!opts.tag);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + SIZE.inW + '" height="' + SIZE.inH + '">' + inner + '</svg>';
    return opts.photoHref ? svg.replace(/href="assets\/photos\/[^"]+"/, 'href="' + opts.photoHref + '"') : svg;
  }

  /* Export translation: name the print faces first so Adobe connects them, and restore the
     print-spec weights (Superclarendon Regular headers, Light body) that the web preview
     renders as Bitter 600/500. */
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
  async function load() {
    await Promise.all(Object.keys(ASSET_URLS).map(async k => { A[k] = await loadOne(ASSET_URLS[k]); }));
    A.shapes = (await Promise.all(SHAPE_URLS.map(loadOne))).filter(Boolean);
    try {
      /* no-store: the photo library must never be served from a stale browser cache */
      const r = await fetch('assets/photos/photos.json', { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); if (Array.isArray(j)) j.filter(p => p && p.file).forEach(p => PHOTOS.push(p)); }
    } catch (e) {}
  }

  return {
    SIZES: SIZES, FAMILIES: FAMILIES, IMAGES: IMAGES, LAYOUTS: LAYOUTS, PHOTOS: PHOTOS, ASSET_OPTIONS: ASSET_OPTIONS,
    get SIZE() { return SIZE; },
    get SPEC() { return SPEC; },
    setSize: setSize, setSpec: setSpec,
    buildPosterSVG: buildPosterSVG, toPrintFonts: toPrintFonts,
    famById: famById, nameSize: nameSize, esc: esc, up: up,
    load: load
  };
})();
