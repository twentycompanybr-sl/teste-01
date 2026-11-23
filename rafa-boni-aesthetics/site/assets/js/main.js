/* Rafa Boni Aesthetics — interactions (no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var lang = document.body.getAttribute('data-lang') || 'en';
    store.set('rb-lang', lang);

    /* language switch: remember choice and keep the current section */
    $$('.lang-opt[data-lang]').forEach(function (a) {
      a.addEventListener('click', function () {
        store.set('rb-lang', a.getAttribute('data-lang'));
        if (location.hash && a.getAttribute('href').indexOf('#') < 0) a.setAttribute('href', a.getAttribute('href') + location.hash);
      });
    });

    /* header */
    var hdr = $('[data-hdr]');
    var wa = $('.wa-float');
    var bar = $('[data-progress]'), lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      if (bar) { var max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')'; }
      if (hdr && !document.body.classList.contains('menu-open')) {
        hdr.classList.toggle('is-hidden', y > lastY && y > 700);
      }
      lastY = y;
      if (hdr) hdr.classList.toggle('is-solid', y > 24 || document.body.classList.contains('page-legal'));
      if (wa) wa.classList.toggle('is-hidden', y < 300 && !!$('.hero'));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (hdr) hdr.addEventListener('focusin', function () { hdr.classList.remove('is-hidden'); });

    /* mobile menu */
    var burger = $('.burger'), mnav = $('[data-mnav]');
    function setMenu(open) {
      if (!burger || !mnav) return;
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', burger.getAttribute(open ? 'data-close' : 'data-open'));
      mnav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) { hdr.classList.add('is-solid'); var f = $('a', mnav); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 350); }
      else onScroll();
    }
    if (burger) {
      burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
      $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
      window.addEventListener('resize', function () { if (window.innerWidth >= 1100) setMenu(false); });
    }

    /* split headings into words for a soft reveal */
    $$('[data-split]').forEach(function (el) {
      var i = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var w = document.createElement('span'); w.className = 'w';
              var s = document.createElement('span'); s.textContent = part; s.style.setProperty('--wi', i++);
              w.appendChild(s); frag.appendChild(w);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      })(el);
    });

    /* reveal on scroll */
    var revealEls = $$('[data-reveal], [data-clip], [data-moons]');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else revealEls.forEach(function (el) { el.classList.add('is-in'); });

    /* active nav item */
    var navLinks = $$('.nav a');
    if ('IntersectionObserver' in window && navLinks.length) {
      var map = {};
      navLinks.forEach(function (a) { var id = a.hash.slice(1); if (id) map[id] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && map[e.target.id]) { navLinks.forEach(function (a) { a.classList.remove('is-current'); }); map[e.target.id].classList.add('is-current'); }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    }

    // parallax for [data-parallax] (factor of distance from viewport centre)
    var pars = $$('[data-parallax]');
    if (pars.length && !reduce) {
      var pt = false;
      var runPar = function () {
        var vh = window.innerHeight;
        pars.forEach(function (el) {
          var host = el.parentNode.getBoundingClientRect();
          if (host.bottom < -200 || host.top > vh + 200) return;
          var mid = host.top + host.height / 2 - vh / 2;
          el.style.transform = 'translate3d(0,' + (mid * parseFloat(el.getAttribute('data-parallax'))).toFixed(1) + 'px,0)';
        });
        pt = false;
      };
      window.addEventListener('scroll', function () { if (!pt) { pt = true; requestAnimationFrame(runPar); } }, { passive: true });
      window.addEventListener('resize', runPar); runPar();
    }

    // count-up numbers
    var counters = $$('[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !reduce) {
      counters.forEach(function (el) { el.textContent = '0'; });
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target, to = parseInt(el.getAttribute('data-count'), 10), t0 = null;
          var tick = function (t) {
            if (!t0) t0 = t;
            var k = Math.min(1, (t - t0) / 1400), eased = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(to * eased);
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }

    // magnetic buttons (fine pointers only)
    if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.btn, .round, .ftr-social a').forEach(function (b) {
        b.classList.add('is-magnet');
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.28;
          b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
      });
    }

    /* treatment filters */
    var chips = $$('[data-filter]'), groups = $$('[data-tlist] [data-group]'), tlist = $('[data-tlist]');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-filter');
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
        groups.forEach(function (g) { g.hidden = f !== 'all' && g.getAttribute('data-group') !== f; });
        if (tlist) tlist.classList.toggle('is-filtered', f !== 'all');
        $$('[data-tlist] [data-reveal], [data-tlist] [data-clip]').forEach(function (el) { el.classList.add('is-in'); });
        if (f !== 'all' && tlist) { var top = tlist.getBoundingClientRect().top + window.scrollY - 160; if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' }); }
      });
    });

    /* treatment → preselect in consultation form */
    var sel = $('#f-treatment');
    $$('[data-treatment]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!sel) return;
        var opt = $('option[data-id="' + a.getAttribute('data-treatment') + '"]', sel);
        if (opt) sel.value = opt.value;
        setTimeout(function () { var n = $('#f-name'); if (n) n.focus({ preventScroll: true }); }, reduce ? 0 : 700);
      });
    });

    /* before / after */
    function initBA(stage) {
      var range = $('.ba-range', stage);
      if (!range) return;
      var set = function (v) { stage.style.setProperty('--pos', v + '%'); };
      range.addEventListener('input', function () { set(range.value); });
      set(range.value);
    }
    $$('[data-ba]').forEach(initBA);
    var rchips = $$('[data-rfilter]'), figs = $$('.ba');
    rchips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-rfilter');
        rchips.forEach(function (x) { var on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
        figs.forEach(function (fg) { fg.hidden = f !== 'all' && fg.getAttribute('data-cat') !== f; fg.classList.add('is-in'); });
      });
    });
    var lb = $('[data-lightbox]');
    if (lb && typeof lb.showModal === 'function') {
      var stageHost = $('[data-lb-stage]', lb), cap = $('[data-lb-cap]', lb), cur = 0;
      var visible = function () { return figs.filter(function (f) { return !f.hidden; }); };
      var show = function (fig) {
        var list = visible(); cur = list.indexOf(fig);
        var clone = $('.ba-stage', fig).cloneNode(true);
        stageHost.innerHTML = ''; stageHost.appendChild(clone); initBA(clone);
        cap.textContent = $('figcaption span', fig).textContent;
      };
      var step = function (d) { var list = visible(); if (!list.length) return; show(list[(cur + d + list.length) % list.length]); };
      $$('[data-zoom]').forEach(function (b) {
        b.addEventListener('click', function () { show(b.closest('.ba')); lb.showModal(); });
      });
      $$('.ba-stage--single').forEach(function (st) {
        st.addEventListener('click', function () { show(st.closest('.ba')); lb.showModal(); });
      });
      $('[data-lb-close]', lb).addEventListener('click', function () { lb.close(); });
      $('[data-lb-prev]', lb).addEventListener('click', function () { step(-1); });
      $('[data-lb-next]', lb).addEventListener('click', function () { step(1); });
      lb.addEventListener('keydown', function (e) {
        if (e.target.classList && e.target.classList.contains('ba-range')) return;
        if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1);
      });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
      var sx = null;
      lb.addEventListener('touchstart', function (e) { if (!e.target.closest('.ba-stage')) sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); sx = null; });
    }

    /* reviews carousel */
    var track = $('[data-rv-track]');
    if (track) {
      var by = function (d) { var card = track.firstElementChild; var w = card ? card.getBoundingClientRect().width + 20 : 300; track.scrollBy({ left: d * w, behavior: reduce ? 'auto' : 'smooth' }); };
      $('[data-rv-prev]').addEventListener('click', function () { by(-1); });
      $('[data-rv-next]').addEventListener('click', function () { by(1); });
    }

    /* consultation form */
    var form = $('[data-form]');
    if (form) initForm(form);

    /* page transitions for browsers without cross-document View Transitions */
    if (!reduce && !('onpagereveal' in window)) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a');
        if (!a || a.target || a.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        var url = new URL(a.href, location.href);
        if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
        if (url.pathname === location.pathname && url.search === location.search) return;
        e.preventDefault();
        document.body.style.transition = 'opacity .3s ease';
        document.body.style.opacity = '0';
        setTimeout(function () { location.href = a.href; }, 280);
      });
      window.addEventListener('pageshow', function () { document.body.style.opacity = ''; });
    }
  });

  function initForm(form) {
    var M = JSON.parse(form.getAttribute('data-msgs'));
    var card = form.parentNode;
    var done = $('[data-done]', card);
    var alertBox = $('[data-alert]', form);
    var submit = $('[data-submit]', form);
    var date = $('#f-date', form);
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var todayStr = today.toISOString().slice(0, 10);
    if (date) date.min = todayStr;

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : M.required; },
      email: function (v) { return !v.trim() ? M.required : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : M.email); },
      whatsapp: function (v) { var d = v.replace(/[^\d]/g, ''); return !v.trim() ? M.required : (/^[+\d\s().-]+$/.test(v.trim()) && d.length >= 9 && d.length <= 15 ? '' : M.phone); },
      date: function (v) { return !v || v >= todayStr ? '' : M.date; },
    };
    var errIds = { name: 'e-name', email: 'e-email', whatsapp: 'e-phone', date: 'e-date', location: 'e-location', consent: 'e-consent' };

    function setErr(name, msg) {
      var el = document.getElementById(errIds[name]);
      var field = el && el.closest('.field');
      if (el) el.textContent = msg || '';
      if (field) field.classList.toggle('is-invalid', !!msg);
      var input = form.elements[name];
      if (input && input.setAttribute && !input.length) {
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (el) input.setAttribute('aria-describedby', errIds[name]);
      }
    }
    function check(name) {
      var msg = '';
      if (rules[name]) msg = rules[name](form.elements[name].value);
      else if (name === 'location') msg = form.querySelector('input[name=location]:checked') ? '' : M.required;
      else if (name === 'consent') msg = form.elements.consent.checked ? '' : M.consent;
      setErr(name, msg);
      return !msg;
    }
    Object.keys(errIds).forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var list = el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
      list.forEach(function (x) {
        x.addEventListener('blur', function () { if (x.value || x.type === 'checkbox' || x.type === 'radio') check(n); });
        x.addEventListener('change', function () { if (x.closest('.is-invalid')) check(n); });
        x.addEventListener('input', function () { if (x.closest('.is-invalid')) check(n); });
      });
    });

    function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return k in o ? o[k] : m; }); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company && form.elements.company.value) return; // spam honeypot
      var names = Object.keys(errIds), ok = true, first = null;
      names.forEach(function (n) { if (!check(n)) { ok = false; if (!first) first = n; } });
      if (!ok) {
        alertBox.textContent = M.summary; alertBox.hidden = false;
        var f = form.elements[first]; (f.length && !f.tagName ? f[0] : f).focus();
        return;
      }
      alertBox.hidden = true;

      var data = new FormData(form);
      var v = function (k) { return (data.get(k) || '').toString().trim(); };
      var dateTxt = v('date') ? new Date(v('date') + 'T12:00:00').toLocaleDateString(document.documentElement.lang, { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
      var waText = fill(M.wa, {
        name: v('name'), email: v('email'), phone: v('whatsapp'), location: v('location'),
        treatment: v('treatment'), date: dateTxt,
        message: v('message') ? fill(M.waMessage, { message: v('message') }) : ''
      }).trim();
      var waHref = 'https://wa.me/' + M.number + '?text=' + encodeURIComponent(waText);
      var first_ = v('name').split(/\s+/)[0];

      submit.disabled = true;
      var label = $('span', submit); label.textContent = M.sending;

      var body = new URLSearchParams();
      data.forEach(function (val, key) { body.append(key, val); });
      var finish = function (received) {
        submit.disabled = false; label.textContent = M.submit;
        $('[data-done-title]', done).textContent = fill(received ? M.okTitle : M.pendingTitle, { name: first_ });
        $('[data-done-text]', done).textContent = received ? M.okText : M.pendingText;
        $('[data-done-wa]', done).href = waHref;
        form.hidden = true; done.hidden = false; done.focus();
        done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      };
      var timeout = new Promise(function (r) { setTimeout(function () { r(false); }, 8000); });
      Promise.race([
        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(function (r) { return r.ok; }).catch(function () { return false; }),
        timeout
      ]).then(finish);
    });

    $('[data-done-again]', done).addEventListener('click', function () {
      form.reset(); done.hidden = true; form.hidden = false;
      Object.keys(errIds).forEach(function (n) { setErr(n, ''); });
      form.elements.name.focus();
    });
  }
})();
