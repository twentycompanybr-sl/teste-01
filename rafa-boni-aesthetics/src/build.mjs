// Static site generator for Rafa Boni Aesthetics (no dependencies).
// Usage: node src/build.mjs   → writes HTML, sitemap.xml and robots.txt into /site
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as C, categories, treatments, results, reviews } from './data.mjs';
import { t as T, routes } from './i18n.mjs';
import { legal } from './legal.mjs';
import { PAY } from './payment-icons.mjs';
import { pages as TP, pageUi as TPU, slugs as TSLUG } from './treatment-pages.mjs';
import { articles as ART, journalUi as JU } from './journal.mjs';
const artUrl = (lang, a) => JU[lang].base + a.slugs[lang] + '/';
const fmtDate = (lang, d) => new Date(d + 'T12:00:00Z').toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const tpUrl = (lang, id) => (TSLUG[id] ? TPU[lang].base + TSLUG[id][lang] + '/' : null);

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const LANGS = ['en', 'pt'];
const VERSION = Date.now().toString(36);
function minifyCss(css) {
  const out = []; let i = 0;
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g; let m; let last = 0;
  const squash = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');
  while ((m = re.exec(css))) { out.push(squash(css.slice(last, m.index)), m[0]); last = re.lastIndex; }
  out.push(squash(css.slice(last)));
  return out.join('').trim();
}
const JS_FLAG = "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('rb-seen'))d.classList.add('seen');else sessionStorage.setItem('rb-seen','1')}catch(e){d.classList.add('seen')}";
const sha = (s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;

// ── helpers ──────────────────────────────────────────────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s = '') => String(s).replace(/<[^>]+>/g, '');
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
const wa = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
const ig = `https://www.instagram.com/${C.instagram}/`;
const abs = (p) => C.siteUrl + p;
const pad = (n) => String(n).padStart(2, '0');
const write = (rel, html) => { const f = join(OUT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };

const I = {
  wa: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/></svg>',
  ig: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r=".6" fill="currentColor"/></svg>',
  mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6l8.5 7 8.5-7"/></svg>',
  arrow: '<svg class="i i-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 7l5 5-5 5"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
  clock: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  chevL: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  chevR: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  expand: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',
  close: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  // why-choose icons
  w1: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="7"/><path d="M10 41c1.5-8 7.3-12 14-12s12.5 4 14 12"/><path d="M33 9.5l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"/></svg>',
  w2: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 41V22"/><path d="M24 24c0-8 5.5-13 13-13 0 8-5.5 13-13 13z"/><path d="M24 30c0-6.5-4.5-10.5-11-10.5 0 6.5 4.5 10.5 11 10.5z"/></svg>',
  w3: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 18l18-9 18 9-18 9z"/><path d="M13 21.5V31c0 3 5 6 11 6s11-3 11-6v-9.5"/><path d="M42 18v10"/></svg>',
  w4: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L24 30.6l-9.3 4.9 1.8-10.3L9 17.9l10.4-1.5z"/></svg>',
};
const CAT_ICON = {
  facial: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8c-11 0-18 9-18 21 0 13 8 27 18 27s18-14 18-27C50 17 43 8 32 8z"/><path d="M25 30h3M36 30h3M29 43c2 1.5 4 1.5 6 0"/></svg>',
  rejuvenation: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="8"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="24" stroke-dasharray="2 5"/></svg>',
  prp: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8C24 20 18 28 18 37a14 14 0 0 0 28 0c0-9-6-17-14-29z"/><path d="M26 39a6 6 0 0 0 6 6"/></svg>',
  body: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 8c0 10 4 14 4 22s-6 12-6 26M42 8c0 10-4 14-4 22s6 12 6 26"/><path d="M27 30h10"/></svg>',
};

// Moon-phase mark recreated from the clinic's wall logo (light → gold → full → gold → light).
const MOONS_SPRITE = (() => {
  const xs = [14, 46, 80, 116, 152, 186, 218];
  // offset of the "shadow" circle per phase (negative = lit on the left)
  const off = [-9, -7, -4, null, 4, 7, 9];
  const fill = ['url(#rbL)', 'url(#rbG)', 'url(#rbG)', 'url(#rbG)', 'url(#rbG)', 'url(#rbG)', 'url(#rbL)'];
  const r = [11, 13, 14.5, 15, 14.5, 13, 11];
  const masks = xs.map((x, i) => off[i] === null ? '' : `<mask id="rbm${i}"><rect x="0" y="0" width="232" height="40" fill="#fff"/><circle cx="${x - off[i] * 1.0}" cy="20" r="${r[i]}" fill="#000"/></mask>`).join('');
  const shapes = xs.map((x, i) => `<circle cx="${x}" cy="20" r="${r[i]}" fill="${fill[i]}"${off[i] === null ? '' : ` mask="url(#rbm${i})"`}/>`).join('');
  const star = (x, y, s) => `<path d="M${x} ${y - s}L${x + s * .22} ${y - s * .22}L${x + s} ${y}L${x + s * .22} ${y + s * .22}L${x} ${y + s}L${x - s * .22} ${y + s * .22}L${x - s} ${y}L${x - s * .22} ${y - s * .22}Z" fill="url(#rbG)"/>`;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="rbG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2A089"/><stop offset="1" stop-color="#A07E66"/></linearGradient>
<linearGradient id="rbL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEADB"/><stop offset="1" stop-color="#EED6C0"/></linearGradient>
${masks}
<symbol id="rb-moons" viewBox="0 0 232 40">${shapes}${star(134, 4, 4)}${star(98, 37, 2.6)}${star(229, 8, 2.6)}${star(3, 30, 2.2)}</symbol>
</defs></svg>`;
})();

function logoImg(cls = '', sizes = '130px', eager = true) {
  const L = C.logo;
  return `<img class="logo-img ${cls}" src="${L.src}-${L.widths[0]}.png" srcset="${L.widths.map((w) => `${L.src}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="${L.w}" height="${L.h}" alt="${C.brand}"${eager ? '' : ' loading="lazy"'} decoding="async">`;
}

function wordmark(cls = '') {
  // the original artwork is dark-on-light; on dark backgrounds use the light SVG version
  if (C.logo && !cls.includes('light')) return logoImg(cls);
  return `<span class="wordmark ${cls}"><svg class="wm-moons" viewBox="0 0 232 40" aria-hidden="true"><use href="#rb-moons"/></svg><span class="wm-main">Rafa Boni</span> <span class="wm-sub">Aesthetics</span></span>`;
}

// image or elegant placeholder
function img(m, alt, cls = '', { eager = false, sizes = '100vw' } = {}) {
  if (typeof m === 'string') m = { src: m.replace(/\.[a-z]+$/, ''), raw: m };
  const src = m.raw || `${m.src}-${m.widths[m.widths.length - 1]}.webp`;
  const srcset = m.widths ? ` srcset="${m.widths.map((w) => `${m.src}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}"` : '';
  const dims = m.w ? ` width="${m.w}" height="${m.h}"` : '';
  const pos = m.pos ? ` style="object-position:${m.pos}"` : '';
  return `<img class="${cls}" src="${src}"${srcset}${dims}${pos} alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function picture(src, alt, cls = '', { eager = false, variant = 'portrait', sizes } = {}) {
  if (src) return img(src, alt, cls, { eager, sizes });
  return `<div class="ph ph--${variant} ${cls}" role="img" aria-label="${esc(alt)}" data-placeholder><span class="ph-mono">RB</span></div>`;
}

// ── layout ───────────────────────────────────────────────────
function head(lang, { title, desc, path, alt, home = false, noindex = false, ld = '' }) {
  const L = T[lang];
  const altLang = lang === 'en' ? 'pt' : 'en';
  const og = C.ogImage ? `<meta property="og:image" content="${abs(C.ogImage)}">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">';
  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${abs(path)}">
${alt ? `<link rel="alternate" hreflang="${T.en.htmlLang}" href="${abs(lang === 'en' ? path : alt)}">
<link rel="alternate" hreflang="${T.pt.htmlLang}" href="${abs(lang === 'pt' ? path : alt)}">
<link rel="alternate" hreflang="x-default" href="${abs(lang === 'en' ? path : alt)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${C.brand}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:locale" content="${L.ogLocale}">
<meta property="og:locale:alternate" content="${T[altLang].ogLocale}">
${og}
<meta name="theme-color" content="#F8F5F0">
<link rel="icon" href="/assets/branding/favicon-64.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/assets/branding/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/bodoni-moda-latin-standard-normal.woff2" as="font" type="font/woff2" crossorigin>
<script>${JS_FLAG}</script>
<link rel="stylesheet" href="/assets/css/main.min.css?v=${VERSION}">
${home ? jsonLd(lang) + faqJsonLd(T[lang]) : ''}${ld}
<script src="/assets/js/main.js?v=${VERSION}" defer></script>
</head>`;
}

function jsonLd(lang) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: C.brand,
    slogan: 'Enhancing Your Natural Beauty.',
    description: T[lang].meta.desc,
    url: abs(routes[lang].home),
    telephone: '+' + C.whatsapp,
    email: C.email,
    sameAs: [ig],
    founder: { '@type': 'Person', name: C.founder },
    areaServed: C.locations.map((l) => ({ '@type': 'Place', name: `${l}, London` })),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:30', closes: '18:00' }],
    ...(C.logo ? { logo: abs(`${C.logo.src}-${C.logo.widths[1]}.png`) } : {}),
    ...(C.ogImage ? { image: abs(C.ogImage) } : {}),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function header(lang, altPath) {
  const L = T[lang], N = L.nav, h = routes[lang].home;
  const links = [['home', '#home'], ['about', '#about'], ['treatments', '#treatments'], ['results', '#results'], ['reviews', '#reviews'], ['contact', '#contact']];
  const items = links.map(([k, a]) => `<li><a href="${h}${a}">${N[k]}</a></li>`).join('');
  const langSwitch = (cls) => `<div class="lang ${cls}" role="group" aria-label="${N.language}">
      ${LANGS.map((l) => l === lang
        ? `<span class="lang-opt is-active" aria-current="true" lang="${T[l].htmlLang}">${l.toUpperCase()}</span>`
        : `<a class="lang-opt" href="${altPath}" hreflang="${T[l].htmlLang}" lang="${T[l].htmlLang}" data-lang="${l}" title="${T[l].langName}">${l.toUpperCase()}</a>`).join('<span class="lang-sep" aria-hidden="true">/</span>')}
    </div>`;
  return `${MOONS_SPRITE}
<a class="skip" href="#main">${L.skip}</a>
<header class="hdr" data-hdr>
  <span class="progress" data-progress aria-hidden="true"></span>
  <div class="container hdr-in">
    <a class="brand" href="${h}#home">${wordmark()}</a>
    <nav class="nav" aria-label="Main"><ul>${items}</ul></nav>
    <div class="hdr-actions">
      ${langSwitch('lang--hdr')}
      <a class="btn btn--sm btn--dark hdr-book" href="${h}#consultation"><span>${N.book}</span></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" data-open="${esc(N.menu)}" data-close="${esc(N.close)}" aria-label="${N.menu}"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" data-mnav>
  <div class="mnav-in container">
    <nav aria-label="Mobile"><ol>${links.map(([k, a], i) => `<li style="--i:${i}"><a href="${h}${a}"><small>${pad(i + 1)}</small>${N[k]}</a></li>`).join('')}</ol></nav>
    <div class="mnav-foot">
      <a class="btn btn--dark" href="${h}#consultation"><span>${N.book}</span></a>
      ${langSwitch('lang--mnav')}
      <div class="mnav-social"><a href="${ig}" target="_blank" rel="noopener">${I.ig} @${C.instagram}</a><a href="${wa(L.contact.waText)}" target="_blank" rel="noopener">${I.wa} WhatsApp</a></div>
    </div>
  </div>
</div>`;
}

function footer(lang, bookHref) {
  const L = T[lang], F = L.footer, N = L.nav, h = routes[lang].home, Ct = L.contact;
  return `<footer class="ftr">
  <div class="container">
    <div class="ftr-top">
      <div class="ftr-brand">
        <a href="${h}#home" aria-label="${C.brand}">${wordmark('wordmark--light')}</a>
        <p class="ftr-slogan">${F.slogan}</p>
        <div class="ftr-social">
          <a href="${ig}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
          <a href="${wa(Ct.waText)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
          <a href="mailto:${C.email}" aria-label="Email">${I.mail}</a>
        </div>
      </div>
      <div class="ftr-col"><h2>${F.explore}</h2><ul>
        ${['about', 'treatments', 'results', 'reviews', 'contact'].map((k) => `<li><a href="${h}#${k}">${N[k]}</a></li>`).join('')}
        <li><a href="${h}#faq">FAQ</a></li>
        <li><a href="${JU[lang].base}">${JU[lang].name}</a></li>
        <li><a href="${h}#consultation">${N.book}</a></li></ul></div>
      <div class="ftr-col"><h2>${F.contact}</h2><ul>
        <li><a href="${wa(Ct.waText)}" target="_blank" rel="noopener">${C.whatsappDisplay}</a></li>
        <li><a href="mailto:${C.email}">${C.email}</a></li>
        <li><a href="${ig}" target="_blank" rel="noopener">@${C.instagram}</a></li></ul></div>
      <div class="ftr-col"><h2>${F.visit}</h2><ul>
        <li>${C.locations.join(' · ')}<br>${L.hero.city}</li>
        <li>${Ct.weekdays}<br>09:30 – 18:00</li>
        <li>${Ct.sunday}: ${Ct.closed}</li></ul></div>
    </div>
    <p class="ftr-disc">${F.disclaimer}</p>
    <div class="ftr-bottom">
      <p>${fill(F.rights, { year: C.year })}</p>
      <p><a href="${routes[lang].privacy}">${F.privacy}</a><span aria-hidden="true">·</span><a href="${routes[lang].terms}">${F.terms}</a></p>
    </div>
  </div>
</footer>
<a class="wa-float" href="${wa(Ct.waText)}" target="_blank" rel="noopener" aria-label="${L.waFloat}">${I.wa}</a>
<div class="mbar" data-mbar>
  <a class="mbar-book" href="${bookHref || h + '#consultation'}"><span>${N.book}</span>${I.arrow}</a>
  <a class="mbar-wa" href="${wa(Ct.waText)}" target="_blank" rel="noopener" aria-label="${L.waFloat}">${I.wa}<span>WhatsApp</span></a>
</div>`;
}

const sectionHead = (eyebrow, title, intro = '', cls = '') => `<div class="sec-head ${cls}">
  <p class="eyebrow" data-reveal>${eyebrow}</p>
  <h2 class="h2" data-reveal data-split>${title}</h2>
  ${intro ? `<p class="lead" data-reveal>${intro}</p>` : ''}
</div>`;

// ── home sections ────────────────────────────────────────────
function badge(text) {
  return `<div class="spin-badge" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="spinPath" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#spinPath" textLength="285">${text}</textPath></text></svg><span class="spin-moon"></span></div>`;
}

function hero(L) {
  const H = L.hero;
  // twinkling sparkles (positions in % of the hero)
  const sparks = [[8, 18, 11, 0], [22, 74, 8, 1.6], [43, 10, 7, 3.1], [55, 86, 10, .8], [64, 8, 13, 2.2], [90, 30, 9, 3.8], [95, 78, 7, 1.1], [36, 48, 6, 4.4], [78, 60, 8, 2.9]];
  const star = '<svg viewBox="0 0 20 20"><path d="M10 0L11.6 8.4 20 10 11.6 11.6 10 20 8.4 11.6 0 10 8.4 8.4Z"/></svg>';
  return `<section class="hero hero--lux" id="home" aria-labelledby="hero-title" data-hero>
  <div class="hero-bg" aria-hidden="true">
    <span class="aurora a1"></span><span class="aurora a2"></span><span class="aurora a3"></span>
    <span class="hero-glow"></span>
    <div class="hero-logo-bg"><picture><source media="(min-width: 900px)" srcset="/assets/logo/rafa-boni-logo-800.webp 800w, /assets/logo/rafa-boni-logo-1600.webp 1586w" sizes="62vw"><img src="/assets/logo/rafa-boni-logo-800.webp" width="1586" height="768" alt="" decoding="async" fetchpriority="low"></picture></div>
    ${sparks.map(([x, y, s, d]) => `<span class="spark" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--sd:${d}s">${star}</span>`).join('')}
    <span class="grain"></span>
  </div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow hero-in" style="--d:.1s">${H.eyebrow}</p>
      <h1 class="h1 hero-in" id="hero-title" style="--d:.2s">${H.h1}</h1>
      <p class="hero-tag hero-in" style="--d:.35s">${H.tagline}</p>
      <p class="hero-body hero-in" style="--d:.45s">${H.body}</p>
      <div class="btn-row hero-in" style="--d:.55s">
        <a class="btn btn--dark" href="#treatments"><span>${H.cta1}</span></a>
        <a class="btn btn--line" href="#consultation"><span>${H.cta2}</span>${I.arrow}</a>
      </div>
    </div>
    <div class="hero-media" data-parallax="0.06">
      <div class="hero-arch"><div class="hero-frame">${picture(C.portraits.hero, H.photo, 'hero-img', { eager: true, sizes: '(min-width: 900px) 480px, 100vw' })}</div></div>
      ${badge(H.badge)}
      <p class="hero-loc"><span>${H.locations}</span><span>${H.city}</span></p>
    </div>
  </div>
  <a class="scroll-cue" href="#about" aria-label="${H.scroll}"><span>${H.scroll}</span><i></i></a>
</section>
<div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => `<span>${treatments.filter((x) => !x.consultationOnly).map((x) => `<em>${x.en.name}</em><b>✦</b>`).join('')}</span>`).join('')}</div></div>`;
}

function featureSec(lang, L) {
  const F = L.feature;
  const r = LIVE_RESULTS.find((x) => x.file === 'lash-lift-2');
  if (!r) return '';
  const url = tpUrl(lang, r.treatment);
  return `<section class="feature" aria-labelledby="feature-title">
  <div class="container feature-grid">
    <figure class="feature-media" data-clip>
      <div class="feature-img"><img src="${r.image}"${baSrcset(r.image, '(min-width: 900px) 640px, 100vw')} width="1206" height="1185" alt="${esc(r[lang].alt)}" loading="lazy" decoding="async"></div>
      <span class="feature-tag feature-tag--b">${F.before}</span><span class="feature-tag feature-tag--a">${F.after}</span>
    </figure>
    <div class="feature-copy">
      <p class="eyebrow" data-reveal>${F.eyebrow}</p>
      <h2 class="h2" id="feature-title" data-reveal data-split>${F.title}</h2>
      <p class="lead" data-reveal>${F.text}</p>
      <div class="btn-row" data-reveal>
        ${url ? `<a class="btn btn--dark" href="${url}"><span>${F.learn}</span>${I.arrow}</a>` : ''}
        <a class="btn btn--line" href="#results"><span>${F.more}</span></a>
      </div>
      <p class="fineprint" data-reveal>${F.note}</p>
    </div>
  </div>
</section>`;
}

function about(L) {
  const A = L.about;
  return `<section class="sec about" id="about" aria-labelledby="about-title">
  <div class="container about-grid">
    <div class="about-media">
      <div class="about-main" data-clip>${picture(C.portraits.about, A.photo, 'about-img', { sizes: '(min-width: 900px) 40vw, 90vw' })}</div>
      <div class="about-detail" data-clip data-parallax="-0.07">${picture(C.portraits.aboutDetail, A.photo2, 'about-img', { variant: 'detail', sizes: '(min-width: 900px) 18vw, 40vw' })}</div>
      <span class="about-badge" aria-hidden="true">Est.<br>London</span>
    </div>
    <div class="about-copy">
      <p class="eyebrow" data-reveal>${A.eyebrow}</p>
      <h2 class="h2" id="about-title" data-reveal data-split>${A.title}</h2>
      ${A.p.map((p, i) => `<p class="${i === 0 ? 'lead' : ''}" data-reveal>${p}</p>`).join('')}
      <p class="signature" data-reveal><span class="sig-name">Rafaela Bonifácio</span><span>${A.signature}</span></p>
      <ul class="highlights" data-reveal>${A.highlights.map(([a, b], i) => `<li><span class="hl-n">${pad(i + 1)}</span><strong>${a}</strong><span>${b}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>`;
}

function treatmentsSec(lang, L) {
  const R = L.treatments;
  const chips = [`<button type="button" class="chip is-active" data-filter="all" aria-pressed="true">${R.all}</button>`]
    .concat(categories.map((c) => `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="false">${c[lang]}</button>`)).join('');
  const groups = categories.map((c, ci) => {
    const list = treatments.filter((x) => x.cat === c.id);
    const rows = list.map((x, i) => {
      const d = x[lang];
      const actions = x.consultationOnly
        ? `<a class="tlink" href="#consultation" data-treatment="${x.id}"><span>${R.book}</span>${I.arrow}</a>`
        : `<a class="tlink tlink--wa" href="${wa(fill(R.wa, { t: d.name }))}" target="_blank" rel="noopener">${I.wa}<span>${R.enquire}</span></a>
           <a class="tlink" href="#consultation" data-treatment="${x.id}"><span>${R.book}</span>${I.arrow}</a>`;
      return `<li class="trow${x.consultationOnly ? ' trow--consult' : ''}" id="t-${x.id}" data-reveal style="--d:${i * 0.06}s">
          <span class="trow-n">${pad(i + 1)}</span>
          <div class="trow-main">
            <h4 class="trow-title">${tpUrl(lang, x.id) ? `<a href="${tpUrl(lang, x.id)}">${d.name}</a>` : d.name}${x.consultationOnly ? `<span class="trow-flag">${R.consultOnly}</span>` : ''}</h4>
            <p class="trow-desc">${d.desc}</p>
            <div class="trow-actions">${actions}${tpUrl(lang, x.id) ? `<a class="tlink tlink--more" href="${tpUrl(lang, x.id)}"><span>${TPU[lang].learn}</span>${I.arrow}</a>` : ''}</div>
          </div>
        </li>`;
    }).join('');
    const letter = String.fromCharCode(65 + ci);
    const media = c.img
      ? img(c.img, `${c[lang]} — Rafa Boni Aesthetics`, 'tcat-img', { sizes: '(min-width: 900px) 42vw, 100vw' })
      : `<div class="tcat-art" role="img" aria-label="${esc(c[lang])}" data-placeholder><svg viewBox="0 0 232 40" aria-hidden="true"><use href="#rb-moons"/></svg></div>`;
    return `<div class="tcat${ci % 2 ? ' tcat--flip' : ''}" data-group="${c.id}" id="cat-${c.id}">
      <div class="tcat-media" data-clip><div class="tcat-par" data-parallax="-0.05">${media}</div><span class="tcat-letter" aria-hidden="true">${letter}</span></div>
      <div class="tcat-body">
        <p class="tcat-meta" data-reveal><span>${letter}</span>${pad(list.length)} ${R.count}</p>
        <h3 class="tcat-title" data-reveal data-split>${c[lang]}</h3>
        <p class="tcat-intro" data-reveal>${c[lang + 'Intro']}</p>
        <ol class="trows">${rows}</ol>
      </div>
    </div>`;
  }).join('');
  return `<section class="sec treatments" id="treatments" aria-labelledby="treatments-title">
  <div class="container">
    ${sectionHead(R.eyebrow, R.title, R.intro).replace('<h2 class="h2"', '<h2 class="h2" id="treatments-title"')}
    <div class="chips" role="toolbar" aria-label="${R.eyebrow}" data-reveal>${chips}</div>
    <div class="tlist" data-tlist>${groups}</div>
    <p class="fineprint" data-reveal>${R.note}</p>
  </div>
</section>`;
}

// keep only results whose image files exist; resolve composite file extensions
const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];
const LIVE_RESULTS = results.map((r) => {
  if (r.file) {
    const ext = EXTS.find((e) => existsSync(join(OUT, 'assets/before-after', `${r.file}.${e}`)));
    return ext ? { ...r, image: `/assets/before-after/${r.file}.${ext}` } : null;
  }
  return [r.before, r.after].every((p) => p && existsSync(join(OUT, p))) ? r : null;
}).filter(Boolean);

function baSrcset(src, sizes) {
  const base = src.replace(/\.[a-zA-Z]+$/, '');
  const ws = [640, 1000].filter((w) => existsSync(join(OUT, `${base}-${w}.webp`)));
  return ws.length ? ` srcset="${ws.map((w) => `${base}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}"` : '';
}

function resultsSec(lang, L) {
  const R = L.results;
  const results = LIVE_RESULTS;
  const enabled = C.resultsGalleryEnabled && results.length > 0;
  let body;
  if (enabled) {
    const cats = [...new Set(results.map((r) => r.treatment))];
    const tName = (id) => (treatments.find((x) => x.id === id) || { [lang]: { name: id } })[lang].name;
    body = `<div class="chips" role="toolbar" aria-label="${R.eyebrow}" data-reveal>
      <button type="button" class="chip is-active" data-rfilter="all" aria-pressed="true">${R.all}</button>
      ${cats.map((c) => `<button type="button" class="chip" data-rfilter="${c}" aria-pressed="false">${tName(c)}</button>`).join('')}
    </div>
    <div class="ba-grid" data-ba-grid>
      ${results.map((r, i) => r.image ? `<figure class="ba ba--single" data-cat="${r.treatment}" data-index="${i}" data-reveal>
        <div class="ba-stage ba-stage--single"><img src="${r.image}"${baSrcset(r.image, '(min-width: 900px) 600px, 92vw')} alt="${esc(r[lang].alt)}" loading="lazy" decoding="async"></div>
        <figcaption><span>${r[lang].caption}</span><button type="button" class="ba-zoom" data-zoom="${i}">${I.expand}<span class="sr">${R.enlarge}</span></button></figcaption>
      </figure>` : `<figure class="ba" data-cat="${r.treatment}" data-index="${i}" data-reveal>
        <div class="ba-stage" data-ba style="--pos:50%">
          <img class="ba-after" src="${r.after}" alt="${esc(R.after)}: ${esc(r[lang].alt)}" loading="lazy" decoding="async">
          <div class="ba-before"><img src="${r.before}" alt="${esc(R.before)}: ${esc(r[lang].alt)}" loading="lazy" decoding="async"></div>
          <span class="ba-tag ba-tag--b">${R.before}</span><span class="ba-tag ba-tag--a">${R.after}</span>
          <span class="ba-handle" aria-hidden="true"><i>${I.chevL}${I.chevR}</i></span>
          <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="${R.drag}">
        </div>
        <figcaption><span>${r[lang].caption}</span><button type="button" class="ba-zoom" data-zoom="${i}">${I.expand}<span class="sr">${R.enlarge}</span></button></figcaption>
      </figure>`).join('')}
    </div>
    <dialog class="lightbox" data-lightbox aria-label="${R.eyebrow}">
      <div class="lb-stage" data-lb-stage></div>
      <p class="lb-cap" data-lb-cap></p>
      <button type="button" class="lb-btn lb-close" autofocus data-lb-close aria-label="${R.close}">${I.close}</button>
      <button type="button" class="lb-btn lb-prev" data-lb-prev aria-label="${R.prev}">${I.chevL}</button>
      <button type="button" class="lb-btn lb-next" data-lb-next aria-label="${R.next}">${I.chevR}</button>
    </dialog>
    <p class="fineprint" data-reveal>${R.intro}</p>`;
  } else {
    body = `<div class="pending" data-reveal>
      <div class="pending-art" aria-hidden="true"><span>${R.before}</span><i></i><span>${R.after}</span></div>
      <div class="pending-copy">
        <h3>${R.phTitle}</h3>
        <p>${R.phText}</p>
        <ul>${R.phList.map((x) => `<li>${I.check}${x}</li>`).join('')}</ul>
        <a class="btn btn--line" href="${ig}" target="_blank" rel="noopener">${I.ig}<span>${R.phBtn}</span></a>
      </div>
    </div>`;
  }
  return `<section class="sec results" id="results" aria-labelledby="results-title">
  <div class="container">
    ${sectionHead(R.eyebrow, R.title, enabled ? '' : '').replace('<h2 class="h2"', '<h2 class="h2" id="results-title"')}
    ${body}
  </div>
</section>`;
}

function reviewsSec(lang, L) {
  const R = L.reviews;
  let body;
  if (reviews.length) {
    body = `<div class="rv-wrap" data-reveal>
      <div class="rv-track" data-rv-track tabindex="0" aria-label="${R.eyebrow}">
        ${reviews.map((r, i) => `<figure class="rv-card" data-reveal style="--d:${i * 0.08}s">
          <span class="rv-mark" aria-hidden="true">“</span>
          ${r.rating ? `<p class="rv-stars" aria-label="${r.rating}/5">${'★'.repeat(r.rating)}</p>` : ''}
          ${r.image ? `<img src="${r.image}" alt="${esc(R.original)}${r.name ? ' — ' + esc(r.name) : ''}" loading="lazy" decoding="async">` : ''}
          ${r.text ? `<blockquote lang="${T[r.lang || 'en'].htmlLang}"><p>${esc(r.text)}</p></blockquote>` : ''}
          ${r.en && lang !== r.lang ? `<p class="rv-tr"><small>${R.translated}</small>${esc(r.en)}</p>` : ''}
          <figcaption>${r.name ? esc(r.name) : R.client}${r.source ? `<span>${esc(r.source)}</span>` : ''}</figcaption>
        </figure>`).join('')}
      </div>
      <div class="rv-nav${reviews.length <= 3 ? ' rv-nav--few' : ''}"><button type="button" class="round" data-rv-prev aria-label="${R.prev}">${I.chevL}</button><button type="button" class="round" data-rv-next aria-label="${R.next}">${I.chevR}</button></div>
    </div>`;
  } else {
    body = `<div class="pending pending--quote" data-reveal>
      <p class="pending-mark" aria-hidden="true">“</p>
      <div class="pending-copy">
        <h3>${R.phTitle}</h3>
        <p>${R.phText}</p>
        <a class="btn btn--line" href="${ig}" target="_blank" rel="noopener">${I.ig}<span>${R.phBtn}</span></a>
      </div>
    </div>`;
  }
  return `<section class="sec reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="container">
    ${sectionHead(R.eyebrow, R.title, R.intro, 'sec-head--center').replace('<h2 class="h2"', '<h2 class="h2" id="reviews-title"')}
    ${body}
  </div>
</section>`;
}

function whySec(L) {
  const W = L.why;
  return `<section class="sec why" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(W.eyebrow, W.title, '', 'sec-head--center').replace('<h2 class="h2"', '<h2 class="h2" id="why-title"')}
    <ul class="why-grid">${W.items.map(([h, p], i) => `<li data-reveal style="--d:${i * 0.08}s"><span class="why-ic">${I['w' + (i + 1)]}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
    <blockquote class="big-quote" data-reveal><p>“${W.quote}”</p></blockquote>
  </div>
</section>`;
}

function payChips() {
  const svg = (k, fill) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${fill || '#' + PAY[k].hex}" d="${PAY[k].path}"/></svg>`;
  const card = '<svg class="pay-card" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="2" fill="none" stroke="#292522" stroke-width="1.5"/><rect x="2.5" y="8.6" width="19" height="2.6" fill="#292522"/></svg>';
  const chips = [
    `<li class="pay-chip pay-chip--card">${card}<span>Card</span><span class="pay-marks">${['visa', 'mastercard', 'amex', 'discover'].map((k) => `<span class="pm">${svg(k)}</span>`).join('')}</span></li>`,
    `<li class="pay-chip"><span class="pay-ic">${svg('paypal')}</span><span>PayPal</span></li>`,
    `<li class="pay-chip"><span class="pay-badge pay-badge--clearpay">${svg('clearpay', '#000')}</span><span>Clearpay</span></li>`,
    `<li class="pay-chip"><span class="pay-badge pay-badge--apple">${svg('applepay', '#000')}</span><span>Apple Pay</span></li>`,
    `<li class="pay-chip"><span class="pay-badge pay-badge--klarna">${svg('klarna', '#000')}</span><span>Klarna</span></li>`,
    `<li class="pay-chip"><span class="pay-badge pay-badge--revolut">${svg('revolut', '#fff')}</span><span>Revolut Pay</span></li>`,
  ];
  return `<ul class="pay">${chips.join('')}</ul>`;
}

function faqSec(L) {
  const F = L.faq;
  return `<section class="sec faq" id="faq" aria-labelledby="faq-title">
  <div class="container faq-grid">
    ${sectionHead(F.eyebrow, F.title, F.intro).replace('<h2 class="h2"', '<h2 class="h2" id="faq-title"')}
    <div class="faq-list">${F.items.map(([q, a], i) => `<details class="faq-item" data-reveal style="--d:${Math.min(i, 5) * 0.05}s"${i === 0 ? ' open' : ''}>
      <summary><span class="faq-n">${pad(i + 1)}</span><span class="faq-q">${q}</span><span class="faq-plus" aria-hidden="true"></span></summary>
      <div class="faq-a"><p>${a}</p></div>
    </details>`).join('')}</div>
  </div>
</section>`;
}

function faqJsonLd(L) {
  const data = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: L.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function philosophySec(L) {
  const P = L.philosophy;
  return `<section class="philo" aria-labelledby="philo-title">
  <div class="philo-moons" data-moons aria-hidden="true"><svg viewBox="0 0 232 40"><use href="#rb-moons"/></svg></div>
  <div class="container philo-in">
    <p class="eyebrow eyebrow--light" data-reveal>${P.eyebrow}</p>
    <h2 class="display" id="philo-title" data-reveal data-split>${P.title}</h2>
    <div class="philo-copy">${P.p.map((p) => `<p data-reveal>${p}</p>`).join('')}</div>
  </div>
</section>`;
}

function statsSec(L) {
  const count = String(treatments.filter((x) => !x.consultationOnly).length);
  return `<section class="stats" aria-label="${esc(L.stats.label)}">
  <div class="container"><ul class="stats-grid">${L.stats.items.map(([n0, t], i) => {
    const n = n0.replace('{count}', count);
    const num = /^\d+$/.test(n) ? `<strong data-count="${n}">${n}</strong>` : `<strong>${n}</strong>`;
    return `<li data-reveal style="--d:${i * 0.08}s">${num}<span>${t}</span></li>`;
  }).join('')}</ul></div>
</section>`;
}

function preloader() {
  return `<div class="preload" aria-hidden="true"><div class="preload-in">${C.logo ? logoImg('preload-logo', '280px') : '<svg class="preload-moons" viewBox="0 0 232 40"><use href="#rb-moons"/></svg><span class="preload-word">Rafa Boni</span><span class="preload-sub">Aesthetics</span>'}</div></div>`;
}

function formSec(lang, L) {
  const F = L.form;
  const msgs = { ...F.err, sending: F.sending, submit: F.submit, okTitle: F.okTitle, okText: F.okText, pendingTitle: F.pendingTitle, pendingText: F.pendingText, wa: F.wa, waMessage: F.waMessage, number: C.whatsapp };
  const today = '';
  return `<section class="sec consult" id="consultation" aria-labelledby="consult-title">
  <div class="container consult-grid">
    <div class="consult-intro">
      ${sectionHead(F.eyebrow, F.title, F.intro).replace('<h2 class="h2"', '<h2 class="h2" id="consult-title"')}
      <ol class="steps">${F.steps.map(([h, p], i) => `<li data-reveal><span>${pad(i + 1)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol>
    </div>
    <div class="form-card" data-reveal>
      <form class="cform" name="consultation" method="POST" action="${routes[lang].home}#consultation" data-netlify="true" netlify-honeypot="company" novalidate data-form data-msgs="${esc(JSON.stringify(msgs))}">
        <input type="hidden" name="form-name" value="consultation">
        <input type="hidden" name="language" value="${lang}">
        <p class="hp" aria-hidden="true"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
        <p class="form-alert" role="alert" data-alert hidden></p>
        <div class="field"><label for="f-name">${F.name}</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100"><span class="err" id="e-name"></span></div>
        <div class="field-row">
          <div class="field"><label for="f-email">${F.email}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="150"><span class="err" id="e-email"></span></div>
          <div class="field"><label for="f-phone">${F.phone}</label><input id="f-phone" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+44" maxlength="25"><span class="err" id="e-phone"></span></div>
        </div>
        <fieldset class="field seg">
          <legend>${F.location}</legend>
          <div class="seg-opts">
            ${C.locations.map((l) => `<label><input type="radio" name="location" value="${l}" required><span>${l}</span></label>`).join('')}
            <label><input type="radio" name="location" value="${esc(F.locationAny)}"><span>${F.locationAny}</span></label>
          </div>
          <span class="err" id="e-location"></span>
        </fieldset>
        <div class="field-row">
          <div class="field"><label for="f-treatment">${F.treatment}</label>
            <div class="select"><select id="f-treatment" name="treatment">
              <option value="${esc(F.treatmentAny)}">${F.treatmentAny}</option>
              ${categories.map((c) => `<optgroup label="${esc(c[lang])}">${treatments.filter((x) => x.cat === c.id).map((x) => `<option value="${esc(x[lang].name)}" data-id="${x.id}">${x[lang].name}</option>`).join('')}</optgroup>`).join('')}
            </select></div></div>
          <div class="field"><label for="f-date">${F.date} <small>(${F.optional})</small></label><input id="f-date" name="date" type="date"${today}><span class="err" id="e-date"></span></div>
        </div>
        <div class="field"><label for="f-msg">${F.message} <small>(${F.optional})</small></label><textarea id="f-msg" name="message" rows="4" maxlength="1000" placeholder="${esc(F.messagePh)}"></textarea></div>
        <div class="field check"><label><input type="checkbox" name="consent" value="yes" required><span>${fill(F.consent, { privacy: routes[lang].privacy })}</span></label><span class="err" id="e-consent"></span></div>
        <button class="btn btn--dark btn--block" type="submit" data-submit><span>${F.submit}</span>${I.arrow}</button>
        <p class="form-note">${F.notice}</p>
      </form>
      <div class="form-done" data-done hidden tabindex="-1">
        <span class="done-ic">${I.check}</span>
        <h3 data-done-title></h3>
        <p data-done-text></p>
        <a class="btn btn--dark" data-done-wa href="#" target="_blank" rel="noopener">${I.wa}<span>${F.okBtn}</span></a>
        <button type="button" class="textbtn" data-done-again>${F.again}</button>
      </div>
    </div>
  </div>
</section>`;
}

function contactSec(lang, L) {
  const Ct = L.contact;
  const mail = `mailto:${C.email}?subject=${encodeURIComponent(Ct.mailSubject + ' — ' + C.brand)}`;
  return `<section class="sec contact" id="contact" aria-labelledby="contact-title">
  <div class="container">
    <div class="contact-top">
      ${sectionHead(Ct.eyebrow, Ct.title, Ct.intro).replace('<h2 class="h2"', '<h2 class="h2" id="contact-title"')}
      <div class="contact-btns" data-reveal>
        <a class="cbtn" href="${wa(Ct.waText)}" target="_blank" rel="noopener">${I.wa}<span><strong>${Ct.wa}</strong><small>${C.whatsappDisplay}</small></span>${I.arrow}</a>
        <a class="cbtn" href="${ig}" target="_blank" rel="noopener">${I.ig}<span><strong>${Ct.ig}</strong><small>@${C.instagram}</small></span>${I.arrow}</a>
        <a class="cbtn" href="${mail}">${I.mail}<span><strong>${Ct.mail}</strong><small>${C.email}</small></span>${I.arrow}</a>
      </div>
    </div>
    <div class="loc-grid">
      ${C.locations.map((l, i) => `<div class="loc" data-reveal style="--d:${i * 0.1}s"><span class="loc-n">${pad(i + 1)}</span><h3>${l}</h3><p>${L.hero.city}</p></div>`).join('')}
      <div class="loc loc--info" data-reveal style="--d:.2s">
        <p class="loc-row">${I.clock}<span><strong>${Ct.hours}</strong>${Ct.weekdays}: 09:30 – 18:00<br>${Ct.sunday}: ${Ct.closed}</span></p>
        <p class="loc-row">${I.pin}<span><strong>${Ct.locations}</strong>${Ct.locNote}</span></p>
        <div class="loc-row loc-pay"><span><strong>${Ct.payment}</strong>${payChips()}</span></div>
      </div>
    </div>
  </div>
</section>`;
}

// ── pages ────────────────────────────────────────────────────
function homePage(lang) {
  const L = T[lang];
  const other = lang === 'en' ? 'pt' : 'en';
  return `${head(lang, { title: L.meta.title, desc: L.meta.desc, path: routes[lang].home, alt: routes[other].home, home: true })}
<body data-lang="${lang}" class="page-home">
${header(lang, routes[other].home)}
${preloader()}
<main id="main">
${hero(L)}
${featureSec(lang, L)}
${about(L)}
${resultsSec(lang, L)}
${statsSec(L)}
${treatmentsSec(lang, L)}
${whySec(L)}
${reviewsSec(lang, L)}
${faqSec(L)}
${philosophySec(L)}
${formSec(lang, L)}
${contactSec(lang, L)}
</main>
${footer(lang)}
</body>
</html>
`;
}

function treatmentPage(lang, id) {
  const L = T[lang], U = TPU[lang], P = TP[id][lang];
  const x = treatments.find((t) => t.id === id);
  const d = x[lang];
  const cat = categories.find((c) => c.id === x.cat);
  const other = lang === 'en' ? 'pt' : 'en';
  const h = routes[lang].home;
  const path = tpUrl(lang, id);
  const book = `${h}?t=${id}#consultation`;
  const waHref = wa(fill(L.treatments.wa, { t: d.name }));
  const media = x.img || cat.img
    ? img(x.img || cat.img, `${d.name} — Rafa Boni Aesthetics`, 'tp-img', { eager: true, sizes: '(min-width: 900px) 44vw, 100vw' })
    : `<div class="tcat-art tp-art" role="img" aria-label="${esc(d.name)}"><svg viewBox="0 0 232 40" aria-hidden="true"><use href="#rb-moons"/></svg></div>`;
  const result = LIVE_RESULTS.find((r) => r.treatment === id);
  const related = treatments.filter((t) => t.cat === x.cat && t.id !== id && TSLUG[t.id]);
  const steps = U.steps.map(([t, p], i) => `<li data-reveal><span>${pad(i + 1)}</span><div><h3>${t}</h3><p>${i === 2 ? P.after : p}</p></div></li>`).join('');
  const title = `${d.name} ${U.titleSuffix}`;
  const desc = P.lead.length > 158 ? P.lead.slice(0, P.lead.lastIndexOf(' ', 155)) + '…' : P.lead;
  const ld = `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Service', name: d.name, serviceType: d.name, description: P.lead, url: abs(path),
      areaServed: C.locations.map((l) => ({ '@type': 'Place', name: `${l}, London` })),
      provider: { '@type': 'HealthAndBeautyBusiness', name: C.brand, url: abs(h), telephone: '+' + C.whatsapp } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: U.crumbHome, item: abs(h) },
      { '@type': 'ListItem', position: 2, name: U.crumbTreatments, item: abs(h) + '#treatments' },
      { '@type': 'ListItem', position: 3, name: d.name, item: abs(path) }] },
  ])}</script>`;
  return `${head(lang, { title, desc, path, alt: tpUrl(other, id), ld })}
<body data-lang="${lang}" class="page-treatment">
${header(lang, tpUrl(other, id))}
<main id="main" class="tp">
  <section class="tp-hero" data-hero>
    <div class="hero-bg" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span><span class="hero-glow"></span><span class="grain"></span></div>
    <div class="container tp-hero-grid">
      <div class="tp-hero-copy">
        <nav class="crumbs hero-in" style="--d:.05s" aria-label="Breadcrumb"><a href="${h}">${U.crumbHome}</a><span aria-hidden="true">/</span><a href="${h}#treatments">${U.crumbTreatments}</a><span aria-hidden="true">/</span><span aria-current="page">${d.name}</span></nav>
        <p class="eyebrow hero-in" style="--d:.1s">${cat[lang]}</p>
        <h1 class="h1 tp-title hero-in" style="--d:.2s">${d.name}</h1>
        <p class="lead tp-lead hero-in" style="--d:.32s">${P.lead}</p>
        <div class="btn-row hero-in" style="--d:.44s">
          <a class="btn btn--dark" href="${book}"><span>${U.book}</span>${I.arrow}</a>
          <a class="btn btn--line" href="${waHref}" target="_blank" rel="noopener">${I.wa}<span>${U.wa}</span></a>
        </div>
      </div>
      <div class="tp-media hero-in" style="--d:.3s">${media}</div>
    </div>
  </section>

  <section class="sec tp-body">
    <div class="container tp-grid">
      <div class="tp-main">
        <h2 class="tp-h" data-reveal>${U.concerns}</h2>
        <ul class="tp-concerns">${P.concerns.map((c, i) => `<li data-reveal style="--d:${i * 0.06}s">${I.check}<span>${c}</span></li>`).join('')}</ul>
        <h2 class="tp-h" data-reveal>${U.how}</h2>
        <ol class="steps tp-steps">${steps}</ol>
        ${result ? `<h2 class="tp-h" data-reveal>${U.results}</h2>
        <figure class="tp-result" data-reveal><img src="${result.image}"${baSrcset(result.image, '(min-width: 600px) 520px, 92vw')} alt="${esc(result[lang].alt)}" loading="lazy" decoding="async"><figcaption>${result[lang].caption}</figcaption></figure>` : ''}
        ${(() => { const rel = ART.filter((a) => a.related.includes(id)); return rel.length ? `<h2 class="tp-h" data-reveal>${JU[lang].more}</h2>
        <ul class="tp-articles">${rel.map((a) => `<li data-reveal><a href="${artUrl(lang, a)}"><strong>${a[lang].title}</strong><span>${JU[lang].read} ${I.arrow}</span></a></li>`).join('')}</ul>` : ''; })()}
        <p class="fineprint" data-reveal>${U.note}</p>
      </div>
      <aside class="tp-aside">
        <div class="tp-card" data-reveal>
          <h2 class="tp-h tp-h--sm">${U.facts}</h2>
          <dl class="tp-facts">
            <div><dt>${U.downtime}</dt><dd>${P.downtime}</dd></div>
            <div><dt>${U.sessions}</dt><dd>${U.sessionsText}</dd></div>
            <div><dt>${U.suitable}</dt><dd>${U.suitableText}</dd></div>
            <div><dt>${U.locations}</dt><dd>${U.locationsText}</dd></div>
          </dl>
          <a class="btn btn--dark btn--block" href="${book}"><span>${U.book}</span>${I.arrow}</a>
          <a class="tp-wa" href="${waHref}" target="_blank" rel="noopener">${I.wa}<span>${U.wa}</span></a>
        </div>
      </aside>
    </div>
  </section>

  ${related.length ? `<section class="sec tp-related" aria-labelledby="rel-title">
    <div class="container">
      <div class="tp-related-head"><h2 class="h2" id="rel-title" data-reveal>${U.related}</h2><a class="tlink" href="${h}#treatments" data-reveal><span>${U.viewAll}</span>${I.arrow}</a></div>
      <ul class="tp-rel-grid">${related.map((t, i) => `<li data-reveal style="--d:${i * 0.06}s"><a href="${tpUrl(lang, t.id)}"><span class="tp-rel-n">${pad(i + 1)}</span><strong>${t[lang].name}</strong><span class="tp-rel-desc">${t[lang].desc}</span><span class="tp-rel-go">${U.learn} ${I.arrow}</span></a></li>`).join('')}</ul>
    </div>
  </section>` : ''}

  <section class="band tp-cta">
    <div class="container" data-reveal>
      <h2 class="h2">${fill(U.ctaTitle, { t: `<em>${d.name}</em>` })}</h2>
      <p>${U.ctaText}</p>
      <div class="btn-row tp-cta-btns"><a class="btn btn--fill-light" href="${book}"><span>${U.book}</span>${I.arrow}</a><a class="btn btn--ghost-l" href="${waHref}" target="_blank" rel="noopener">${I.wa}<span>${U.wa}</span></a></div>
    </div>
  </section>
</main>
${footer(lang, book)}
</body>
</html>
`;
}

function articleCard(lang, a, i = 0) {
  const J = JU[lang];
  return `<li data-reveal style="--d:${i * 0.06}s"><a class="jcard" href="${artUrl(lang, a)}">
    <span class="jcard-meta">${fmtDate(lang, a.date)} · ${a.mins} ${J.mins}</span>
    <strong class="jcard-title">${a[lang].title}</strong>
    <span class="jcard-desc">${a[lang].desc}</span>
    <span class="jcard-go">${J.read} ${I.arrow}</span></a></li>`;
}

function journalIndex(lang) {
  const J = JU[lang], other = lang === 'en' ? 'pt' : 'en';
  return `${head(lang, { title: J.metaTitle, desc: J.metaDesc, path: J.base, alt: JU[other].base })}
<body data-lang="${lang}" class="page-journal">
${header(lang, JU[other].base)}
<main id="main" class="journal">
  <section class="tp-hero j-hero" data-hero>
    <div class="hero-bg" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span><span class="hero-glow"></span><span class="grain"></span></div>
    <div class="container">
      <p class="eyebrow hero-in" style="--d:.1s">${J.eyebrow}</p>
      <h1 class="h1 tp-title hero-in" style="--d:.2s">${J.title}</h1>
      <p class="lead hero-in" style="--d:.32s">${J.intro}</p>
    </div>
  </section>
  <section class="sec"><div class="container"><ul class="jgrid">${ART.map((a, i) => articleCard(lang, a, i)).join('')}</ul></div></section>
</main>
${footer(lang)}
</body>
</html>
`;
}

function articlePage(lang, a) {
  const J = JU[lang], A = a[lang], other = lang === 'en' ? 'pt' : 'en', h = routes[lang].home;
  const path = artUrl(lang, a);
  const ld = `<script type="application/ld+json">${JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: A.title, description: A.desc, datePublished: a.date, dateModified: a.date,
      inLanguage: T[lang].htmlLang, mainEntityOfPage: abs(path),
      author: { '@type': 'Organization', name: C.brand, url: abs(h) }, publisher: { '@type': 'Organization', name: C.brand, url: abs(h) },
      ...(C.ogImage ? { image: abs(C.ogImage) } : {}) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: TPU[lang].crumbHome, item: abs(h) },
      { '@type': 'ListItem', position: 2, name: J.name, item: abs(J.base) },
      { '@type': 'ListItem', position: 3, name: A.title, item: abs(path) }] },
  ])}</script>`;
  const rel = a.related.filter((id) => TSLUG[id]).map((id) => treatments.find((t) => t.id === id));
  const more = ART.filter((x) => x.id !== a.id);
  return `${head(lang, { title: `${A.title} | ${C.brand}`, desc: A.desc, path, alt: artUrl(other, a), ld })}
<body data-lang="${lang}" class="page-article">
${header(lang, artUrl(other, a))}
<main id="main" class="article">
  <section class="tp-hero a-hero" data-hero>
    <div class="hero-bg" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span><span class="hero-glow"></span><span class="grain"></span></div>
    <div class="container a-hero-in">
      <nav class="crumbs hero-in" style="--d:.05s" aria-label="Breadcrumb"><a href="${h}">${TPU[lang].crumbHome}</a><span aria-hidden="true">/</span><a href="${J.base}">${J.name}</a></nav>
      <p class="eyebrow hero-in" style="--d:.1s">${fmtDate(lang, a.date)} · ${a.mins} ${J.mins}</p>
      <h1 class="h1 a-title hero-in" style="--d:.2s">${A.title}</h1>
      <p class="lead hero-in" style="--d:.32s">${A.desc}</p>
    </div>
  </section>
  <section class="sec a-body">
    <div class="container a-grid">
      <article class="prose a-prose">${A.body}
        <p class="fineprint">${J.note}</p>
      </article>
      <aside class="a-aside">
        ${rel.length ? `<div class="tp-card"><h2 class="tp-h tp-h--sm">${J.related}</h2><ul class="a-rel">${rel.map((t) => `<li><a href="${tpUrl(lang, t.id)}"><span>${t[lang].name}</span>${I.arrow}</a></li>`).join('')}</ul>
        <a class="btn btn--dark btn--block" href="${h}#consultation"><span>${T[lang].nav.book}</span>${I.arrow}</a></div>` : ''}
      </aside>
    </div>
  </section>
  <section class="sec tp-related"><div class="container">
    <div class="tp-related-head"><h2 class="h2" data-reveal>${J.more}</h2><a class="tlink" href="${J.base}" data-reveal><span>${J.back}</span>${I.arrow}</a></div>
    <ul class="jgrid">${more.map((x, i) => articleCard(lang, x, i)).join('')}</ul>
  </div></section>
  <section class="band tp-cta"><div class="container" data-reveal>
    <h2 class="h2">${J.ctaTitle}</h2><p>${J.ctaText}</p>
    <div class="btn-row tp-cta-btns"><a class="btn btn--fill-light" href="${h}#consultation"><span>${T[lang].nav.book}</span>${I.arrow}</a><a class="btn btn--ghost-l" href="${wa(T[lang].contact.waText)}" target="_blank" rel="noopener">${I.wa}<span>WhatsApp</span></a></div>
  </div></section>
</main>
${footer(lang)}
</body>
</html>
`;
}

function legalPage(lang, kind) {
  const other = lang === 'en' ? 'pt' : 'en';
  const D = legal[lang][kind];
  const body = D.sections.map(([h, html]) => `<section><h2>${h}</h2>${fill(html, { email: C.email, phone: C.whatsappDisplay })}</section>`).join('');
  return `${head(lang, { title: `${D.title} | ${C.brand}`, desc: D.desc, path: routes[lang][kind], alt: routes[other][kind] })}
<body data-lang="${lang}" class="page-legal">
${header(lang, routes[other][kind])}
<main id="main" class="legal">
  <div class="container legal-in">
    <p class="eyebrow">${C.brand}</p>
    <h1 class="h1">${D.title}</h1>
    <p class="legal-date">${legal[lang].updated}</p>
    <div class="prose">${body}</div>
  </div>
</main>
${footer(lang)}
</body>
</html>
`;
}

function notFoundPage() {
  return `${head('en', { title: `Page not found | ${C.brand}`, desc: T.en.meta.desc, path: '/404.html', noindex: true })}
<body data-lang="en" class="page-legal">
${header('en', routes.pt.home)}
<main id="main" class="legal nf">
  <div class="container legal-in">
    <p class="eyebrow">404</p>
    <h1 class="h1">${T.en.notFound.title}</h1>
    <p class="lead">${T.en.notFound.text}</p>
    <p class="lead" lang="pt-BR">${T.pt.notFound.title}. ${T.pt.notFound.text}</p>
    <div class="btn-row"><a class="btn btn--dark" href="/en/"><span>${T.en.notFound.btn}</span></a><a class="btn btn--line" href="/pt/" lang="pt-BR"><span>${T.pt.notFound.btn}</span></a></div>
  </div>
</main>
${footer('en')}
</body>
</html>
`;
}

function rootPage() {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${C.brand} — Enhancing Your Natural Beauty</title>
<meta name="description" content="${esc(T.en.meta.desc)}">
<link rel="canonical" href="${abs('/en/')}">
<link rel="alternate" hreflang="en-GB" href="${abs('/en/')}">
<link rel="alternate" hreflang="pt-BR" href="${abs('/pt/')}">
<link rel="alternate" hreflang="x-default" href="${abs('/en/')}">
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/assets/branding/favicon-64.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="/assets/branding/apple-touch-icon.png">
<script src="/assets/js/lang-redirect.js"></script>
<noscript><meta http-equiv="refresh" content="0; url=/en/"></noscript>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F8F5F0;color:#292522;font:15px/1.6 system-ui,sans-serif;text-align:center}a{color:inherit;margin:0 .6rem}</style>
</head>
<body>
<p>${C.brand}<br><a href="/en/" hreflang="en-GB">English</a> · <a href="/pt/" hreflang="pt-BR">Português</a></p>
</body>
</html>
`;
}

function sitemap() {
  const pairs = [['home', 'weekly', '1.0'], ['privacy', 'yearly', '0.3'], ['terms', 'yearly', '0.3']];
  const today = new Date().toISOString().slice(0, 10);
  const urls = pairs.flatMap(([k, freq, prio]) => LANGS.map((l) => `  <url>
    <loc>${abs(routes[l][k])}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="en-GB" href="${abs(routes.en[k])}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${abs(routes.pt[k])}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(routes.en[k])}"/>
  </url>`)).join('\n');
  const tUrls = Object.keys(TSLUG).flatMap((id) => LANGS.map((l) => `  <url>
    <loc>${abs(tpUrl(l, id))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en-GB" href="${abs(tpUrl('en', id))}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${abs(tpUrl('pt', id))}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(tpUrl('en', id))}"/>
  </url>`)).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
${tUrls}
${[{ en: JU.en.base, pt: JU.pt.base, f: 'weekly', p: '0.6' }, ...ART.map((a) => ({ en: artUrl('en', a), pt: artUrl('pt', a), f: 'monthly', p: '0.6' }))].flatMap((u) => LANGS.map((l) => `  <url>
    <loc>${abs(u[l])}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.f}</changefreq>
    <priority>${u.p}</priority>
    <xhtml:link rel="alternate" hreflang="en-GB" href="${abs(u.en)}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${abs(u.pt)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(u.en)}"/>
  </url>`)).join('\n')}
</urlset>
`;
}

// ── write ────────────────────────────────────────────────────
for (const l of LANGS) {
  write(routes[l].home + 'index.html', homePage(l));
  write(routes[l].privacy + 'index.html', legalPage(l, 'privacy'));
  write(routes[l].terms + 'index.html', legalPage(l, 'terms'));
  for (const id of Object.keys(TSLUG)) write(tpUrl(l, id) + 'index.html', treatmentPage(l, id));
  write(JU[l].base + 'index.html', journalIndex(l));
  for (const a of ART) write(artUrl(l, a) + 'index.html', articlePage(l, a));
}
write('index.html', rootPage());
write('404.html', notFoundPage());
write('sitemap.xml', sitemap());
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
writeFileSync(join(OUT, 'assets/css/main.min.css'), minifyCss(readFileSync(join(OUT, 'assets/css/main.css'), 'utf8')));
const csp = [
  "default-src 'self'",
  `script-src 'self' ${sha(JS_FLAG)}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');
const ALL = '/' + '*';
write('_headers', `${ALL}
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/css${ALL}
  Cache-Control: public, max-age=31536000, immutable

/assets/js/main.js
  Cache-Control: public, max-age=31536000, immutable
`);
// Same headers for Vercel (vercel.json is read before the build, so it is committed too)
const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  buildCommand: 'node src/build.mjs',
  outputDirectory: 'site',
  framework: null,
  trailingSlash: true,
  headers: [
    { source: '/(.*)', headers: [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    ] },
    { source: '/assets/(css|js)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
};
writeFileSync(join(OUT, '..', 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
console.log(`Built ${LANGS.length * (4 + Object.keys(TSLUG).length + ART.length) + 2} pages for ${C.siteUrl}`);
