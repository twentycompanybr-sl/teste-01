// Static site generator for Rafa Boni Aesthetics (no dependencies).
// Usage: node src/build.mjs   → writes HTML, sitemap.xml and robots.txt into /site
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as C, categories, treatments, results, reviews } from './data.mjs';
import { t as T, routes } from './i18n.mjs';
import { legal } from './legal.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const LANGS = ['en', 'pt'];
const VERSION = Date.now().toString(36);
const JS_FLAG = "document.documentElement.classList.add('js')";
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

function wordmark(cls = '') {
  if (C.logo) return `<img class="logo-img ${cls}" src="${C.logo}" alt="${C.brand}" width="160" height="48">`;
  return `<span class="wordmark ${cls}"><span class="wm-main">Rafa Boni</span><span class="wm-sub">Aesthetics</span></span>`;
}

// image or elegant placeholder
function picture(src, alt, cls = '', { eager = false, variant = 'portrait' } = {}) {
  if (src) return `<img class="${cls}" src="${src}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  return `<div class="ph ph--${variant} ${cls}" role="img" aria-label="${esc(alt)}" data-placeholder><span class="ph-mono">RB</span></div>`;
}

// ── layout ───────────────────────────────────────────────────
function head(lang, { title, desc, path, alt, home = false, noindex = false }) {
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
<link rel="icon" href="/assets/branding/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Manrope:wght@300;400;500;600&display=swap">
<script>${JS_FLAG}</script>
<link rel="stylesheet" href="/assets/css/main.css?v=${VERSION}">
${home ? jsonLd(lang) : ''}
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
    ...(C.logo ? { logo: abs(C.logo) } : {}),
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
  return `<a class="skip" href="#main">${L.skip}</a>
<header class="hdr" data-hdr>
  <div class="container hdr-in">
    <a class="brand" href="${h}#home" aria-label="${C.brand} — ${N.home}">${wordmark()}</a>
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

function footer(lang) {
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
<a class="wa-float" href="${wa(Ct.waText)}" target="_blank" rel="noopener" aria-label="${L.waFloat}">${I.wa}</a>`;
}

const sectionHead = (eyebrow, title, intro = '', cls = '') => `<div class="sec-head ${cls}">
  <p class="eyebrow" data-reveal>${eyebrow}</p>
  <h2 class="h2" data-reveal data-split>${title}</h2>
  ${intro ? `<p class="lead" data-reveal>${intro}</p>` : ''}
</div>`;

// ── home sections ────────────────────────────────────────────
function hero(L) {
  const H = L.hero;
  return `<section class="hero" id="home" aria-labelledby="hero-title">
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
    <div class="hero-media">
      <div class="hero-frame">${picture(C.portraits.hero, H.photo, 'hero-img', { eager: true })}</div>
      <p class="hero-loc"><span>${H.locations}</span><span>${H.city}</span></p>
    </div>
  </div>
  <a class="scroll-cue" href="#about" aria-label="${H.scroll}"><span>${H.scroll}</span><i></i></a>
</section>
<div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map(() => `<span>${treatments.map((x) => `<em>${x.en.name.replace(' Consultation', '')}</em><b>✦</b>`).join('')}</span>`).join('')}</div></div>`;
}

function about(L) {
  const A = L.about;
  return `<section class="sec about" id="about" aria-labelledby="about-title">
  <div class="container about-grid">
    <div class="about-media" data-reveal>
      <div class="about-main">${picture(C.portraits.about, A.photo, 'about-img')}</div>
      <div class="about-detail">${picture(C.portraits.aboutDetail, A.photo2, 'about-img', { variant: 'detail' })}</div>
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
  let n = 0;
  const groups = categories.map((c) => {
    const items = treatments.filter((x) => x.cat === c.id).map((x) => {
      n++;
      const d = x[lang];
      const actions = x.consultationOnly
        ? `<a class="tlink" href="#consultation" data-treatment="${x.id}"><span>${R.book}</span>${I.arrow}</a>`
        : `<a class="tlink tlink--wa" href="${wa(fill(R.wa, { t: d.name }))}" target="_blank" rel="noopener">${I.wa}<span>${R.enquire}</span></a>
           <a class="tlink" href="#consultation" data-treatment="${x.id}"><span>${R.book}</span>${I.arrow}</a>`;
      const media = x.img
        ? `<img src="${x.img}" alt="${esc(d.name)}" loading="lazy" decoding="async">`
        : `<div class="tcard-art tcard-art--${c.id}" role="img" aria-label="${esc(d.name)} — ${esc(R.photo)}" data-placeholder>${CAT_ICON[c.id]}</div>`;
      return `<article class="tcard${x.consultationOnly ? ' tcard--consult' : ''}" data-cat="${c.id}" id="t-${x.id}" data-reveal>
        <div class="tcard-media">${media}<span class="tcard-n">${pad(n)}</span>${x.consultationOnly ? `<span class="tcard-flag">${R.consultOnly}</span>` : ''}</div>
        <div class="tcard-body">
          <p class="tcard-cat">${c[lang]}</p>
          <h4 class="tcard-title">${d.name}</h4>
          <p class="tcard-desc">${d.desc}</p>
          <div class="tcard-actions">${actions}</div>
        </div>
      </article>`;
    }).join('');
    return `<div class="tgroup" data-group="${c.id}">
      <h3 class="tgroup-title" data-reveal><span>${String.fromCharCode(65 + categories.indexOf(c))}</span>${c[lang]}</h3>
      <div class="tgrid">${items}</div>
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

function resultsSec(lang, L) {
  const R = L.results;
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
      ${results.map((r, i) => `<figure class="ba" data-cat="${r.treatment}" data-index="${i}" data-reveal>
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
        ${reviews.map((r) => `<figure class="rv-card">
          ${r.rating ? `<p class="rv-stars" aria-label="${r.rating}/5">${'★'.repeat(r.rating)}</p>` : ''}
          ${r.image ? `<img src="${r.image}" alt="${esc(R.original)}${r.name ? ' — ' + esc(r.name) : ''}" loading="lazy" decoding="async">` : ''}
          ${r.text ? `<blockquote lang="${T[r.lang || 'en'].htmlLang}"><p>“${esc(r.text)}”</p></blockquote>` : ''}
          <figcaption>${r.name ? esc(r.name) : ''}${r.source ? `<span>${esc(r.source)}</span>` : ''}</figcaption>
        </figure>`).join('')}
      </div>
      <div class="rv-nav"><button type="button" class="round" data-rv-prev aria-label="${R.prev}">${I.chevL}</button><button type="button" class="round" data-rv-next aria-label="${R.next}">${I.chevR}</button></div>
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

function philosophySec(L) {
  const P = L.philosophy;
  const bg = C.portraits.philosophy ? `<img class="philo-bg" src="${C.portraits.philosophy}" alt="" loading="lazy" decoding="async">` : '<div class="philo-bg philo-bg--ph" aria-hidden="true"></div>';
  return `<section class="philo" aria-labelledby="philo-title">
  ${bg}
  <div class="container philo-in">
    <p class="eyebrow eyebrow--light" data-reveal>${P.eyebrow}</p>
    <h2 class="display" id="philo-title" data-reveal data-split>${P.title}</h2>
    <div class="philo-copy">${P.p.map((p) => `<p data-reveal>${p}</p>`).join('')}</div>
  </div>
</section>`;
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
<body data-lang="${lang}">
${header(lang, routes[other].home)}
<main id="main">
${hero(L)}
${about(L)}
${treatmentsSec(lang, L)}
${resultsSec(lang, L)}
${whySec(L)}
${reviewsSec(lang, L)}
${philosophySec(L)}
${formSec(lang, L)}
${contactSec(lang, L)}
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
<link rel="icon" href="/assets/branding/favicon.svg" type="image/svg+xml">
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

// ── write ────────────────────────────────────────────────────
for (const l of LANGS) {
  write(routes[l].home + 'index.html', homePage(l));
  write(routes[l].privacy + 'index.html', legalPage(l, 'privacy'));
  write(routes[l].terms + 'index.html', legalPage(l, 'terms'));
}
write('index.html', rootPage());
write('404.html', notFoundPage());
write('sitemap.xml', sitemap());
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
const csp = [
  "default-src 'self'",
  `script-src 'self' ${sha(JS_FLAG)}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
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
console.log(`Built ${LANGS.length * 3 + 2} pages for ${C.siteUrl}`);
