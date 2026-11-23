// ─────────────────────────────────────────────────────────────
// Rafa Boni Aesthetics — site content & configuration
// Edit this file, then run:  node src/build.mjs
// ─────────────────────────────────────────────────────────────

export const config = {
  brand: 'Rafa Boni Aesthetics',
  founder: 'Rafaela Bonifácio',
  // On Netlify, process.env.URL is set automatically to the site's primary URL.
  siteUrl: (process.env.SITE_URL || process.env.URL || 'http://localhost:8080').replace(/\/$/, ''),
  whatsapp: '447588723507',
  whatsappDisplay: '+44 7588 723507',
  instagram: 'rafaboni_aesthetics',
  email: 'rafaboni_aesthetics@outlook.com',
  locations: ['Canada Water', 'Mayfair'],
  year: 2026,

  // Images — drop files into /site/assets/... and set them here. Leave null for a placeholder.
  // Format: { src: base path (files are <src>-<width>.webp), widths: [...], w, h (largest size), pos: CSS object-position }
  // logo: null → uses the built-in moon-phase mark + wordmark (recreated from the clinic wall logo).
  // To use the original artwork instead: '/assets/logo/rafa-boni-logo.svg'
  logo: null,
  ogImage: '/assets/branding/og-image.jpg',
  portraits: {
    hero: { src: '/assets/portraits/rafaela-treatment-hero', widths: [640, 1035], w: 1035, h: 1520, pos: '50% 22%' },
    about: { src: '/assets/portraits/rafaela-portrait', widths: [700, 1200], w: 1200, h: 1162, pos: '64% 50%' },
    aboutDetail: { src: '/assets/treatments/microneedling-logo-wall', widths: [560, 825], w: 825, h: 1600, pos: '50% 10%' },
    philosophy: { src: '/assets/treatments/prp-hair', widths: [640, 1000], w: 1000, h: 1573, pos: '50% 40%' },
  },

  // Before & After gallery: keep false until every image has written client
  // consent and the content has been checked against the ASA/CAP Code.
  resultsGalleryEnabled: false,
};

export const categories = [
  { id: 'facial', en: 'Facial Skincare', pt: 'Cuidados Faciais' },
  { id: 'rejuvenation', en: 'Skin Rejuvenation & Injectables', pt: 'Rejuvenescimento & Injetáveis' },
  { id: 'prp', en: 'PRP — Platelet-Rich Plasma', pt: 'PRP — Plasma Rico em Plaquetas' },
  { id: 'body', en: 'Body & Specialised Treatments', pt: 'Corporal & Tratamentos Especializados' },
];

// consultationOnly: true → prescription-only medicines (POMs) must not be
// promoted to the public in the UK. These cards use neutral, consultation-led
// wording, never name the product and have no direct booking/promo button.
export const treatments = [
  // A. FACIAL SKINCARE
  { id: 'hydrofacial', cat: 'facial', img: null,
    en: { name: 'Hydrofacial', desc: 'Deep skin cleansing, hydration and revitalisation to help improve the overall appearance of the skin.' },
    pt: { name: 'Hydrofacial', desc: 'Limpeza profunda, hidratação e revitalização para ajudar a melhorar a aparência geral da pele.' } },
  { id: 'microneedling-pdrn', cat: 'facial',
    img: { src: '/assets/treatments/microneedling-logo-wall', widths: [560, 825], w: 825, h: 1600, pos: '50% 63%' },
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
export const results = [];

// CLIENT REVIEWS — copy text exactly as written by the client; never edit meaning.
// Either `text` (with optional `name`, only if authorised) or `image` (screenshot).
// { lang: 'en', text: '…', name: 'S.', source: 'Google', image: null, rating: 5 }
export const reviews = [];
