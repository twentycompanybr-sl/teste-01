// ─────────────────────────────────────────────────────────────
// Rafa Boni Aesthetics — site content & configuration
// Edit this file, then run:  node src/build.mjs
// ─────────────────────────────────────────────────────────────

export const config = {
  brand: 'Rafa Boni Aesthetics',
  founder: 'Rafaela Bonifácio',
  // On Netlify, process.env.URL is set automatically to the site's primary URL.
  // SITE_URL (manual) → Netlify's URL → Vercel's production domain → local preview
  siteUrl: (process.env.SITE_URL || process.env.URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    || 'http://localhost:8080').replace(/\/$/, ''),
  whatsapp: '447588723507',
  whatsappDisplay: '+44 7588 723507',
  instagram: 'rafaboni_aesthetics',
  email: 'rafaboni_aesthetics@outlook.com',
  locations: ['Canada Water', 'Mayfair'],
  payments: ['Card', 'Apple Pay', 'PayPal', 'Revolut Pay', 'Klarna', 'Clearpay'],
  year: 2026,

  // Images — drop files into /site/assets/... and set them here. Leave null for a placeholder.
  // Format: { src: base path (files are <src>-<width>.webp), widths: [...], w, h (largest size), pos: CSS object-position }
  // Original logo (transparent background, generated from the client's artwork).
  // null → falls back to the SVG moon-phase mark + wordmark (still used on dark backgrounds).
  logo: { src: '/assets/logo/rafa-boni-logo', widths: [260, 360, 720], w: 794, h: 384 },
  ogImage: '/assets/branding/og-image.jpg',
  portraits: {
    hero: { src: '/assets/portraits/rafaela-treatment-hero', widths: [640, 800, 1035], w: 1035, h: 1520, pos: '50% 22%' },
    about: { src: '/assets/portraits/rafaela-portrait', widths: [700, 1200], w: 1200, h: 1162, pos: '64% 50%' },
    aboutDetail: { src: '/assets/gallery/clinic-room', widths: [640, 1000], w: 1086, h: 1448, pos: '30% 30%' },
    philosophy: { src: '/assets/treatments/prp-hair', widths: [640, 1000], w: 1000, h: 1573, pos: '50% 40%' },
  },

  // Before & After gallery. Each entry in `results` only appears once its image
  // file exists in /site/assets/before-after/ (uploading the file publishes it).
  // Only publish images with the client's written consent, and never results of
  // prescription-only medicines (e.g. botulinum toxin) — UK ASA/CAP rules.
  resultsGalleryEnabled: true,
};

// One photo per category (null → elegant moon-phase placeholder).
export const categories = [
  { id: 'facial', en: 'Facial Skincare', pt: 'Cuidados Faciais',
    enIntro: 'Treatments to cleanse, renew and restore radiance — the foundation of healthy-looking skin.',
    ptIntro: 'Tratamentos para limpar, renovar e devolver o viço — a base de uma pele com aparência saudável.',
    img: { src: '/assets/treatments/microneedling-studio', widths: [640, 1000], w: 1024, h: 1280, pos: '50% 40%' } },
  { id: 'rejuvenation', en: 'Skin Rejuvenation & Injectables', pt: 'Rejuvenescimento & Injetáveis',
    enIntro: 'Injectable, collagen-supporting and non-invasive treatments, planned for subtle and natural-looking refinement.',
    ptIntro: 'Tratamentos injetáveis, bioestimuladores e não invasivos, planejados para um refinamento sutil e natural.',
    img: null },
  { id: 'prp', en: 'PRP — Platelet-Rich Plasma', pt: 'PRP — Plasma Rico em Plaquetas',
    enIntro: 'Treatments using your own platelet-rich plasma to support skin and hair quality.',
    ptIntro: 'Tratamentos com o seu próprio plasma rico em plaquetas para favorecer a qualidade da pele e dos fios.',
    img: { src: '/assets/treatments/prp-hair', widths: [640, 1000], w: 1000, h: 1573, pos: '50% 45%' } },
  { id: 'body', en: 'Body & Specialised Treatments', pt: 'Corporal & Tratamentos Especializados',
    enIntro: 'Targeted treatments for texture, scars, pigmentation and wellbeing.',
    ptIntro: 'Tratamentos direcionados para textura, cicatrizes, pigmentação e bem-estar.',
    img: null },
];

// consultationOnly: true → prescription-only medicines (POMs) must not be
// promoted to the public in the UK. These cards use neutral, consultation-led
// wording, never name the product and have no direct booking/promo button.
export const treatments = [
  // A. FACIAL SKINCARE
  { id: 'hydrofacial', cat: 'facial',
    img: { src: '/assets/treatments/hydrofacial-device', widths: [640, 1000], w: 1170, h: 1555, pos: '50% 45%' },
    en: { name: 'Hydrofacial', desc: 'Deep skin cleansing, hydration and revitalisation to help improve the overall appearance of the skin.' },
    pt: { name: 'Hydrofacial', desc: 'Limpeza profunda, hidratação e revitalização para ajudar a melhorar a aparência geral da pele.' } },
  { id: 'microneedling-pdrn', cat: 'facial',
    img: { src: '/assets/treatments/microneedling-studio', widths: [640, 1000], w: 1024, h: 1280, pos: '50% 40%' },
    en: { name: 'Microneedling with PDRN', desc: 'A skin treatment designed to support skin renewal and improve the appearance of skin texture.' },
    pt: { name: 'Microagulhamento com PDRN', desc: 'Tratamento pensado para estimular a renovação da pele e melhorar a aparência da sua textura.' } },
  { id: 'dermaplaning', cat: 'facial', img: null,
    en: { name: 'Dermaplaning', desc: 'A gentle exfoliation treatment designed to leave the skin feeling smoother and looking more radiant.' },
    pt: { name: 'Dermaplaning', desc: 'Esfoliação suave que deixa a pele com toque mais macio e aspecto mais luminoso.' } },
  { id: 'chemical-peels', cat: 'facial', img: null,
    en: { name: 'Chemical Peels', desc: 'Professional skin exfoliation treatments, including options designed for concerns such as uneven skin tone and pigmentation.' },
    pt: { name: 'Peelings Químicos', desc: 'Esfoliações profissionais da pele, com opções indicadas para questões como tom irregular e manchas.' } },
  { id: 'carbon-peel', cat: 'facial', img: null,
    en: { name: 'Carbon Peel', desc: 'A laser-based skin treatment designed to improve the appearance and texture of the skin.' },
    pt: { name: 'Carbon Peel', desc: 'Tratamento com laser pensado para melhorar a aparência e a textura da pele.' } },

  { id: 'lash-lift', cat: 'facial',
    img: { src: '/assets/before-after/lash-lift-1', widths: [640, 1000], w: 1184, h: 1190, pos: '50% 50%' },
    en: { name: 'Lash Lift', desc: 'A semi-permanent treatment that lifts and curls your natural lashes from the root, for a wide-awake, defined look without extensions.' },
    pt: { name: 'Lash Lift', desc: 'Tratamento semipermanente que levanta e curva os cílios naturais desde a raiz, para um olhar mais aberto e definido, sem extensões.' } },

  // B. SKIN REJUVENATION & INJECTABLES
  { id: 'lines-consultation', cat: 'rejuvenation', img: null, consultationOnly: true,
    en: { name: 'Lines & Wrinkles Consultation', desc: 'Concerned about expression lines? We will talk through your goals and the options that may be appropriate for you. Any prescription treatment is only considered after a face-to-face assessment by an appropriately qualified prescriber.' },
    pt: { name: 'Consulta para Linhas de Expressão', desc: 'Incomodada com as linhas de expressão? Conversamos sobre seus objetivos e as opções que podem ser adequadas para você. Qualquer tratamento sujeito a prescrição só é considerado após avaliação presencial por um prescritor devidamente qualificado.' } },
  { id: 'profhilo', cat: 'rejuvenation', img: null,
    en: { name: 'Profhilo®', desc: 'An injectable hyaluronic acid treatment designed to improve skin hydration and support skin quality.' },
    pt: { name: 'Profhilo®', desc: 'Tratamento injetável à base de ácido hialurônico, pensado para melhorar a hidratação e a qualidade da pele.' } },
  { id: 'skin-boosters', cat: 'rejuvenation', img: null,
    en: { name: 'Skin Boosters', desc: 'Treatments designed to improve skin hydration and overall skin appearance.' },
    pt: { name: 'Skin Boosters', desc: 'Tratamentos pensados para melhorar a hidratação e a aparência geral da pele.' } },
  { id: 'radiesse', cat: 'rejuvenation', img: null,
    en: { name: 'Radiesse®', desc: 'A collagen-stimulating injectable treatment designed to support skin firmness and improve the appearance of facial ageing.' },
    pt: { name: 'Radiesse®', desc: 'Tratamento injetável bioestimulador de colágeno, pensado para favorecer a firmeza da pele e suavizar os sinais do envelhecimento facial.' } },

  { id: 'hifu', cat: 'rejuvenation', img: null,
    en: { name: 'HIFU', desc: 'A non-invasive, focused-ultrasound treatment designed to support skin firmness and improve the appearance of laxity on the face and neck.' },
    pt: { name: 'HIFU', desc: 'Tratamento não invasivo com ultrassom microfocado, pensado para favorecer a firmeza da pele e suavizar a aparência da flacidez no rosto e no pescoço.' } },

  // C. PRP
  { id: 'prp-facial', cat: 'prp', img: null,
    en: { name: 'PRP Facial', desc: 'A treatment using platelet-rich plasma, designed to support skin regeneration and skin quality.' },
    pt: { name: 'PRP Facial', desc: 'Tratamento com plasma rico em plaquetas, pensado para favorecer a regeneração e a qualidade da pele.' } },
  { id: 'prp-hair', cat: 'prp',
    img: { src: '/assets/treatments/prp-hair', widths: [640, 1000], w: 1000, h: 1573, pos: '50% 52%' },
    en: { name: 'PRP Hair', desc: 'A treatment intended to support hair health, which may be considered for certain types of hair loss following a consultation.' },
    pt: { name: 'PRP Capilar', desc: 'Tratamento voltado à saúde dos fios, que pode ser considerado para alguns tipos de queda de cabelo após avaliação.' } },

  // D. BODY & SPECIALISED
  { id: 'body-microneedling', cat: 'body', img: null,
    en: { name: 'Body Microneedling', desc: 'A treatment targeting the appearance of stretch marks and scars.' },
    pt: { name: 'Microagulhamento Corporal', desc: 'Tratamento voltado a suavizar a aparência de estrias e cicatrizes.' } },
  { id: 'tattoo-pigmentation-removal', cat: 'body', img: null,
    en: { name: 'Tattoo & Pigmentation Removal', desc: 'Laser treatments designed to target unwanted tattoo ink and pigmentation.' },
    pt: { name: 'Remoção de Tatuagem & Pigmentação', desc: 'Tratamentos a laser pensados para atuar sobre a tinta de tatuagens e pigmentações indesejadas.' } },
  { id: 'wellbeing-consultation', cat: 'body', img: null, consultationOnly: true,
    en: { name: 'Vitamin & Wellbeing Consultation', desc: 'Interested in nutritional wellbeing support? We will discuss your needs during a consultation. Any prescription-only option requires an individual assessment by an appropriately qualified prescriber.' },
    pt: { name: 'Consulta de Vitaminas & Bem-estar', desc: 'Tem interesse em suporte nutricional para o seu bem-estar? Conversamos sobre suas necessidades em consulta. Qualquer opção sujeita a prescrição exige avaliação individual por um prescritor devidamente qualificado.' } },
];

// BEFORE & AFTER — only real, consented, unretouched pairs of the SAME client.
// Example entry (do not publish without consent):
// { treatment: 'hydrofacial', before: '/assets/before-after/hydrofacial-01-before.jpg',
//   after: '/assets/before-after/hydrofacial-01-after.jpg',
//   en: { caption: 'Hydrofacial — after 1 session', alt: 'Client skin before and after a hydrofacial' },
//   pt: { caption: 'Hydrofacial — após 1 sessão', alt: 'Pele da cliente antes e depois do hydrofacial' } }
// Two layouts: { before, after } → drag-to-compare slider (same framing required);
// { file } → the client's own composite image shown unaltered (base name, any of .jpg/.jpeg/.png/.webp).
export const results = [
  { treatment: 'microneedling-pdrn', file: 'microneedling-pdrn-acne',
    en: { caption: 'Microneedling with PDRN — before and after treatment', alt: 'Client’s cheek with active acne before treatment and with calmer, more even skin after microneedling with PDRN' },
    pt: { caption: 'Microagulhamento com PDRN — antes e depois do tratamento', alt: 'Bochecha da cliente com acne ativa antes e com pele mais calma e uniforme após o microagulhamento com PDRN' } },
  { treatment: 'skin-boosters', file: 'skinbooster-vitaran',
    en: { caption: 'Skin booster (Vitaran®) — immediately after treatment and 2 days later', alt: 'Client’s cheek immediately after a Vitaran skin booster and the same skin two days later' },
    pt: { caption: 'Skin booster (Vitaran®) — logo após o tratamento e 2 dias depois', alt: 'Bochecha da cliente logo após o skin booster Vitaran e a mesma pele dois dias depois' } },
  { treatment: 'hifu', file: 'hifu-neck',
    en: { caption: 'HIFU — face and neck, before and after treatment', alt: 'Client’s jawline and neck before and after HIFU treatment' },
    pt: { caption: 'HIFU — rosto e pescoço, antes e depois do tratamento', alt: 'Mandíbula e pescoço da cliente antes e depois do HIFU' } },
  { treatment: 'lash-lift', file: 'lash-lift-2',
    en: { caption: 'Lash Lift — before and after', alt: 'Client’s eye before and after a lash lift, with lashes lifted and more defined afterwards' },
    pt: { caption: 'Lash Lift — antes e depois', alt: 'Olho da cliente antes e depois do lash lift, com os cílios mais curvados e definidos' } },
  { treatment: 'lash-lift', file: 'lash-lift-1',
    en: { caption: 'Lash Lift — before (top) and after (bottom)', alt: 'Client’s eye area before and after a lash lift' },
    pt: { caption: 'Lash Lift — antes (em cima) e depois (embaixo)', alt: 'Região dos olhos da cliente antes e depois do lash lift' } },
  { treatment: 'prp-hair', file: 'prp-hair',
    en: { caption: 'PRP for hair — before and after treatment', alt: 'Client’s hairline before and after PRP hair treatment' },
    pt: { caption: 'PRP capilar — antes e depois do tratamento', alt: 'Linha do cabelo da cliente antes e depois do PRP capilar' } },
];

// CLIENT REVIEWS — copy text exactly as written by the client; never edit meaning.
// Either `text` (with optional `name`, only if authorised) or `image` (screenshot).
// { lang: 'en', text: '…', name: 'S.', source: 'Google', image: null, rating: 5 }
export const reviews = [
  // Transcribed exactly from client WhatsApp messages supplied by the business (names not shown).
  { lang: 'pt', source: 'WhatsApp',
    text: 'Boa tarde, Rafa!\n\nComo você comentou, meu nariz tinha muitos cravos e a pele dessa região é bem fininha, então poderia até descamar — mas não descamou! Minha pele ficou perfeita, macia e com um brilho lindo. Estou usando o filtro solar direitinho, como você me orientou.\n\nAmei o resultado — suas mãos são abençoadas! ❤️❤️❤️❤️🙏🙏🙏',
    en: 'Good afternoon, Rafa! As you mentioned, my nose had a lot of blackheads and the skin there is very thin, so it could even have peeled — but it didn’t! My skin looked perfect, soft and with a beautiful glow. I’m using my sunscreen properly, just as you advised. I loved the result — you have blessed hands!' },
  { lang: 'pt', source: 'WhatsApp',
    text: 'Não tenho palavras para agradecer o resultado incrível que você vem me proporcionando com seu atendimento personalizado Rafa, eu estou tão feliz 🤩🥰, obrigada por cuidar da minha pele com tanto carinho, por me ajudar com dicas de como usar cada produto, proporcionando assim um resultado ainda melhor 😍🤍 Muuuito obrigadaaaa ❤️',
    en: 'I have no words to thank you for the amazing results you’ve been giving me with your personalised care, Rafa. I’m so happy! Thank you for looking after my skin with so much care and for helping me with tips on how to use each product, making the results even better. Thank you sooo much!' },
  { lang: 'pt', source: 'WhatsApp',
    text: 'Ficou ótimo\nE fora todo o cuidado q vc teve c a gente\n\nVc está de parabéns\nQ todas profissionais fossem assim como vc\n\nDa até gosto de pagar\n\nEu fico imaginando o seu cuidado c a cliente no seu estúdio\n\n🥰',
    en: 'It turned out great. And on top of that, all the care you took with us. Well done — I wish every professional were like you. It actually feels good to pay. I can only imagine the care you give your clients in your studio.' },
];
