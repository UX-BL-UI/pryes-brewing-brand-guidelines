/* ============================================================
   PRYES UI - shared page furniture for the concept tools
   Password gate, toast, brand-styled dropdown menus. One copy,
   loaded by concept-board.html and concept-editor.html after the
   page markup. Exposes window.checkPassword and window.showToast.
   ============================================================ */
(function () {
  /* ---------- password gate (one session key shared with the brand guide) ---------- */
  var CORRECT_PASSWORD = 'pryes2026';
  function checkPassword() {
    var input = document.getElementById('password-input');
    var error = document.getElementById('password-error');
    var overlay = document.getElementById('password-overlay');
    if (!input || !overlay) return;
    if (input.value.trim().toLowerCase() === CORRECT_PASSWORD) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      try { sessionStorage.setItem('pryes_auth', '1'); } catch (e) {}
    } else {
      if (error) error.classList.add('show');
      input.value = '';
      input.focus();
    }
  }
  window.checkPassword = checkPassword;
  (function () {
    var overlay = document.getElementById('password-overlay');
    if (!overlay) return;
    var authed = false;
    try { authed = sessionStorage.getItem('pryes_auth') === '1'; } catch (e) {}
    if (authed) {
      overlay.classList.add('hidden');
    } else {
      document.body.style.overflow = 'hidden';
      var pi = document.getElementById('password-input');
      if (pi) { pi.focus(); pi.addEventListener('keypress', function (e) { if (e.key === 'Enter') checkPassword(); }); }
    }
  })();

  /* ---------- toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  window.showToast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1500);
  };

  /* ---------- custom dropdowns ----------
     The OS paints native select menus and ignores the brand, so each
     select gets a styled twin. The real select stays in the DOM (all
     existing logic keeps working); a button + menu render it. */
  var CHECK = '<svg class="csel-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var proto = HTMLSelectElement.prototype;
  var valueD = Object.getOwnPropertyDescriptor(proto, 'value');
  var indexD = Object.getOwnPropertyDescriptor(proto, 'selectedIndex');
  /* one page-level listener closes whichever menu is open - per-select
     listeners would pile up as panels rebuild their selects */
  var openMenu = null;
  document.addEventListener('pointerdown', function (e) { if (openMenu && !openMenu.wrap.contains(e.target)) openMenu.close(); });
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function enhance(sel) {
    if (sel.closest('.csel')) return;
    var wrap = document.createElement('span'); wrap.className = 'csel';
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
    var trig = document.createElement('button');
    trig.type = 'button'; trig.className = 'csel-trigger';
    trig.setAttribute('aria-haspopup', 'listbox'); trig.setAttribute('aria-expanded', 'false');
    var menu = document.createElement('div');
    menu.className = 'csel-menu'; menu.hidden = true; menu.setAttribute('role', 'listbox');
    wrap.appendChild(trig); wrap.appendChild(menu);
    function sync() {
      var o = sel.options[sel.selectedIndex];
      trig.textContent = o ? o.textContent : '';
      menu.innerHTML = Array.prototype.map.call(sel.options, function (op, i) {
        return '<button type="button" class="csel-opt" role="option" data-i="' + i + '" aria-selected="' + (i === sel.selectedIndex) + '"><span>' + esc(op.textContent) + '</span>' + CHECK + '</button>';
      }).join('');
    }
    function close() { menu.hidden = true; trig.setAttribute('aria-expanded', 'false'); menu.classList.remove('csel-menu--up'); if (openMenu && openMenu.wrap === wrap) openMenu = null; }
    trig.addEventListener('click', function () {
      if (!menu.hidden) return close();
      if (openMenu) openMenu.close();
      openMenu = { wrap: wrap, close: close };
      sync(); menu.hidden = false; trig.setAttribute('aria-expanded', 'true');
      var r = menu.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 8) menu.classList.add('csel-menu--up');
    });
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('.csel-opt'); if (!b) return;
      indexD.set.call(sel, +b.dataset.i); sync(); close();
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
    trig.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    sel.addEventListener('change', sync);
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, attributes: true });
    Object.defineProperty(sel, 'value', { get: function () { return valueD.get.call(this); }, set: function (v) { valueD.set.call(this, v); sync(); } });
    Object.defineProperty(sel, 'selectedIndex', { get: function () { return indexD.get.call(this); }, set: function (v) { indexD.set.call(this, v); sync(); } });
    sync();
  }
  document.querySelectorAll('select').forEach(enhance);
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'SELECT') enhance(n);
        else if (n.querySelectorAll) n.querySelectorAll('select').forEach(enhance);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
