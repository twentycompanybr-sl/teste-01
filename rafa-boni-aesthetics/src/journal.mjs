// Journal / blog articles (EN + PT). Educational, non-promissory content.
// Review with Rafaela before relying on specifics. Body is trusted HTML written here.

export const journalUi = {
  en: { base: '/en/journal/', name: 'Journal', eyebrow: 'Journal', title: 'Skin notes from <em>London</em>',
    intro: 'Practical, honest guidance on skin health and advanced aesthetics — to help you make informed choices.',
    read: 'Read article', mins: 'min read', related: 'Related treatments', back: 'All articles', more: 'From the journal',
    metaTitle: 'Journal | Skin & Aesthetics Advice in London | Rafa Boni Aesthetics',
    metaDesc: 'Articles on skin health, facial treatments and skin rejuvenation from Rafa Boni Aesthetics in London.',
    note: 'This article is for general information only and does not replace an individual consultation. Individual results vary.',
    ctaTitle: 'Have a question about your skin?', ctaText: 'Book a consultation and we will create a plan tailored to you.' },
  pt: { base: '/pt/blog/', name: 'Blog', eyebrow: 'Blog', title: 'Notas de pele, direto de <em>Londres</em>',
    intro: 'Orientações práticas e honestas sobre saúde da pele e estética avançada — para você fazer escolhas bem informadas.',
    read: 'Ler artigo', mins: 'min de leitura', related: 'Tratamentos relacionados', back: 'Todos os artigos', more: 'Do blog',
    metaTitle: 'Blog | Dicas de Pele e Estética em Londres | Rafa Boni Aesthetics',
    metaDesc: 'Artigos sobre saúde da pele, tratamentos faciais e rejuvenescimento da Rafa Boni Aesthetics, em Londres.',
    note: 'Este artigo tem caráter informativo e não substitui uma consulta individual. Os resultados variam de pessoa para pessoa.',
    ctaTitle: 'Tem alguma dúvida sobre a sua pele?', ctaText: 'Agende uma consulta e criamos um plano pensado para você.' },
};

export const articles = [
  {
    id: 'what-is-pdrn', date: '2026-11-23', mins: 4, related: ['microneedling-pdrn', 'skin-boosters'],
    slugs: { en: 'what-is-pdrn', pt: 'o-que-e-pdrn' },
    en: {
      title: 'What is PDRN? A simple guide to polynucleotide skin treatments',
      desc: 'PDRN and polynucleotides are among the most talked-about ingredients in aesthetics. Here is what they are, how they are used and what to expect.',
      body: `
<p>If you follow skincare on social media, you have probably heard of <strong>PDRN</strong> — sometimes called “salmon DNA” treatments. It is one of the most talked-about ingredients in aesthetics right now, so it is worth understanding what it is, and what it is not.</p>
<h2>What does PDRN stand for?</h2>
<p>PDRN means <em>polydeoxyribonucleotide</em>: fragments of DNA, usually purified from salmon or trout, that are highly compatible with human tissue. A closely related family of ingredients is known as <strong>polynucleotides</strong>. Both have been used in medicine and dermatology for some years, particularly in the context of tissue repair.</p>
<h2>How is it used in aesthetics?</h2>
<p>In aesthetic treatments, PDRN is mainly used in two ways:</p>
<ul>
<li><strong>With microneedling</strong>, where tiny, controlled micro-channels help the product reach the skin while also stimulating its natural renewal process.</li>
<li><strong>As an injectable skin booster</strong>, placed in small amounts across the treatment area.</li>
</ul>
<p>In both cases, the aim is to <strong>support skin repair and quality</strong> — rather than to add volume or change the shape of the face.</p>
<h2>Who might consider it?</h2>
<p>PDRN-based treatments are often considered by people who want to improve the appearance of:</p>
<ul>
<li>skin texture and post-acne marks;</li>
<li>dull, tired-looking or dehydrated skin;</li>
<li>fine lines and overall skin quality.</li>
</ul>
<p>It is not suitable for everyone. Allergies (including to fish), pregnancy, active skin infections and some medical conditions may mean another option is more appropriate — which is exactly why a consultation comes first.</p>
<h2>What to expect</h2>
<p>After microneedling with PDRN, redness similar to mild sunburn is common for one to three days. After injectable treatments, small bumps at the injection points usually settle within a day or two. Most people see a gradual improvement in skin quality over the following weeks, and a course of sessions is often recommended. As with any treatment, results vary from person to person.</p>
<h2>The bottom line</h2>
<p>PDRN is a promising ingredient for skin quality, but it works best as part of a plan built around <strong>your</strong> skin. At Rafa Boni Aesthetics, every treatment starts with a consultation where we look at your goals, your history and whether PDRN — or something else — is the right choice for you.</p>` },
    pt: {
      title: 'O que é PDRN? Um guia simples sobre os tratamentos com polinucleotídeos',
      desc: 'PDRN e polinucleotídeos estão entre os ativos mais comentados da estética. Veja o que são, como são usados e o que esperar.',
      body: `
<p>Se você acompanha skincare nas redes sociais, provavelmente já ouviu falar do <strong>PDRN</strong> — às vezes chamado de tratamento com “DNA de salmão”. É um dos ativos mais comentados da estética hoje, por isso vale entender o que ele é — e o que ele não é.</p>
<h2>O que significa PDRN?</h2>
<p>PDRN quer dizer <em>polidesoxirribonucleotídeo</em>: fragmentos de DNA, geralmente purificados de salmão ou truta, muito compatíveis com os tecidos humanos. Uma família de ativos bem próxima é a dos <strong>polinucleotídeos</strong>. Ambos são usados há alguns anos na medicina e na dermatologia, principalmente no contexto da reparação dos tecidos.</p>
<h2>Como é usado na estética?</h2>
<p>Nos tratamentos estéticos, o PDRN é usado principalmente de duas formas:</p>
<ul>
<li><strong>Com microagulhamento</strong>, em que microcanais controlados ajudam o ativo a chegar à pele e, ao mesmo tempo, estimulam a renovação natural.</li>
<li><strong>Como skin booster injetável</strong>, aplicado em pequenas quantidades na área tratada.</li>
</ul>
<p>Nos dois casos, o objetivo é <strong>favorecer a reparação e a qualidade da pele</strong> — e não dar volume nem mudar o formato do rosto.</p>
<h2>Para quem pode ser indicado?</h2>
<p>Os tratamentos com PDRN costumam ser considerados por quem quer melhorar a aparência de:</p>
<ul>
<li>textura da pele e marcas de acne;</li>
<li>pele opaca, cansada ou desidratada;</li>
<li>linhas finas e qualidade geral da pele.</li>
</ul>
<p>Não é indicado para todo mundo. Alergias (inclusive a peixe), gestação, infecções ativas na pele e algumas condições de saúde podem tornar outra opção mais adequada — e é justamente por isso que tudo começa com uma consulta.</p>
<h2>O que esperar</h2>
<p>Depois do microagulhamento com PDRN, é comum uma vermelhidão parecida com a de um sol leve por um a três dias. Depois dos injetáveis, pequenas elevações nos pontos de aplicação costumam sumir em um ou dois dias. A maioria das pessoas nota uma melhora gradual da qualidade da pele nas semanas seguintes, e muitas vezes é indicado um protocolo de sessões. Como em qualquer tratamento, os resultados variam de pessoa para pessoa.</p>
<h2>Resumindo</h2>
<p>O PDRN é um ativo promissor para a qualidade da pele, mas funciona melhor dentro de um plano pensado para a <strong>sua</strong> pele. Na Rafa Boni Aesthetics, todo tratamento começa com uma consulta, em que avaliamos seus objetivos, seu histórico e se o PDRN — ou outra opção — é a melhor escolha para você.</p>` },
  },
  {
    id: 'winter-skin-london', date: '2026-11-23', mins: 4, related: ['hydrofacial', 'skin-boosters', 'profhilo'],
    slugs: { en: 'winter-skincare-london', pt: 'cuidados-pele-inverno-londres' },
    en: {
      title: 'Winter skincare in London: how to protect your skin barrier',
      desc: 'Cold wind, central heating and grey days can leave skin dry and dull. Simple, practical steps to keep your skin comfortable through a London winter.',
      body: `
<p>A London winter is hard on the skin. Cold, windy days outside and dry central heating inside can leave it <strong>tight, flaky, sensitive or dull</strong> — even if your skin behaves perfectly the rest of the year. The good news: a few simple adjustments make a real difference.</p>
<h2>Why skin struggles in winter</h2>
<p>Your skin barrier is the outer layer that keeps moisture in and irritants out. Low humidity, temperature changes and hot showers all make it easier for water to escape, so the barrier becomes weaker and the skin feels drier and more reactive.</p>
<h2>1. Cleanse gently</h2>
<p>Swap foaming or stripping cleansers for a gentle cream, milk or gel cleanser, and use lukewarm rather than hot water. If your skin feels tight after cleansing, your cleanser is probably too strong.</p>
<h2>2. Layer hydration, then seal it in</h2>
<p>Hydrating ingredients such as hyaluronic acid or glycerin help draw water into the skin; a moisturiser with ceramides or fatty acids then helps keep it there. In winter, many people benefit from a slightly richer moisturiser than in summer.</p>
<h2>3. Don’t skip sunscreen</h2>
<p>UV rays are still present on cloudy days, and they contribute to pigmentation and visible ageing. A broad-spectrum SPF every morning remains one of the most effective habits for healthy-looking skin — all year round.</p>
<h2>4. Go easy on exfoliation</h2>
<p>Exfoliation can help with dullness, but over-exfoliating a compromised barrier often leads to redness and sensitivity. In winter, one or two gentle sessions a week is usually plenty — and pause strong actives if your skin starts to sting.</p>
<h2>5. Think about your environment</h2>
<p>A humidifier at home, drinking enough water and protecting your skin from wind with a scarf all help. Small, consistent habits matter more than any single product.</p>
<h2>When a professional treatment can help</h2>
<p>Winter is also a popular time for treatments focused on <strong>hydration and skin quality</strong>. A hydrofacial can deep-cleanse and rehydrate without downtime, while skin boosters or Profhilo® are designed to improve hydration from within. The right option depends on your skin — and some treatments are better suited to the colder months, when sun exposure is lower.</p>
<p>If your skin is feeling the effects of the season, a consultation is a good place to start: we will look at your routine, your skin and your goals, and suggest what makes sense for you.</p>` },
    pt: {
      title: 'Cuidados com a pele no inverno de Londres: como proteger a barreira da pele',
      desc: 'Vento frio, aquecimento e dias cinzentos podem deixar a pele seca e sem viço. Passos simples e práticos para manter a pele confortável no inverno de Londres.',
      body: `
<p>O inverno de Londres é duro com a pele. O frio e o vento lá fora e o aquecimento seco dentro de casa podem deixá-la <strong>repuxando, descamando, sensível ou sem viço</strong> — mesmo que ela se comporte muito bem no resto do ano. A boa notícia: alguns ajustes simples fazem muita diferença.</p>
<h2>Por que a pele sofre no inverno</h2>
<p>A barreira da pele é a camada mais externa, que segura a hidratação e protege contra agentes irritantes. Umidade baixa, mudanças de temperatura e banhos quentes facilitam a perda de água, deixando a barreira mais fraca e a pele mais seca e reativa.</p>
<h2>1. Limpe com delicadeza</h2>
<p>Troque sabonetes que fazem muita espuma ou ressecam por um limpador suave em creme, leite ou gel, e use água morna em vez de quente. Se a pele repuxa depois da limpeza, o produto provavelmente está forte demais.</p>
<h2>2. Hidrate em camadas e sele a hidratação</h2>
<p>Ativos hidratantes, como ácido hialurônico ou glicerina, ajudam a atrair água para a pele; um hidratante com ceramidas ou ácidos graxos ajuda a mantê-la ali. No inverno, muitas pessoas se beneficiam de um hidratante um pouco mais nutritivo do que no verão.</p>
<h2>3. Não abandone o protetor solar</h2>
<p>Os raios UV continuam presentes em dias nublados e contribuem para manchas e sinais de envelhecimento. Um protetor de amplo espectro todas as manhãs continua sendo um dos hábitos mais eficazes para uma pele saudável — o ano inteiro.</p>
<h2>4. Vá com calma na esfoliação</h2>
<p>A esfoliação ajuda na falta de viço, mas exagerar com a barreira fragilizada costuma causar vermelhidão e sensibilidade. No inverno, uma ou duas vezes por semana, de forma suave, geralmente basta — e pause ativos fortes se a pele começar a arder.</p>
<h2>5. Cuide do ambiente</h2>
<p>Um umidificador em casa, beber água suficiente e proteger o rosto do vento com um cachecol ajudam. Pequenos hábitos constantes importam mais do que qualquer produto isolado.</p>
<h2>Quando um tratamento profissional pode ajudar</h2>
<p>O inverno também é uma época procurada para tratamentos focados em <strong>hidratação e qualidade da pele</strong>. O hydrofacial limpa em profundidade e reidrata sem tempo de recuperação, enquanto os skin boosters ou o Profhilo® são pensados para melhorar a hidratação de dentro para fora. A melhor opção depende da sua pele — e alguns tratamentos combinam mais com os meses frios, quando a exposição ao sol é menor.</p>
<p>Se a sua pele está sentindo os efeitos da estação, uma consulta é um ótimo começo: avaliamos sua rotina, sua pele e seus objetivos e sugerimos o que faz sentido para você.</p>` },
  },
  {
    id: 'which-facial', date: '2026-11-23', mins: 5, related: ['hydrofacial', 'dermaplaning', 'chemical-peels'],
    slugs: { en: 'hydrofacial-dermaplaning-or-chemical-peel', pt: 'hydrofacial-dermaplaning-ou-peeling' },
    en: {
      title: 'Hydrofacial, dermaplaning or chemical peel: which facial is right for you?',
      desc: 'Three popular facial treatments, explained simply — how they work, who they suit and what to expect afterwards.',
      body: `
<p>Hydrofacial, dermaplaning and chemical peels are three of the most popular facial treatments — and three of the most confused. All of them help the skin look fresher, but they work in different ways and suit different needs. Here is a simple comparison.</p>
<h2>Hydrofacial: cleanse, extract, hydrate</h2>
<p>A hydrofacial combines deep cleansing, gentle exfoliation, extraction and intense hydration in one treatment, with no needles.</p>
<ul>
<li><strong>Often chosen for:</strong> congested pores, dullness and dehydrated skin.</li>
<li><strong>Downtime:</strong> usually none — many people go straight back to their day.</li>
<li><strong>Good to know:</strong> it is gentle enough for most skin types and a popular choice before an event.</li>
</ul>
<h2>Dermaplaning: smooth and bright</h2>
<p>Dermaplaning uses a sterile blade to gently remove dead skin cells and fine facial hair (“peach fuzz”).</p>
<ul>
<li><strong>Often chosen for:</strong> rough texture, dull skin and make-up that doesn’t sit smoothly.</li>
<li><strong>Downtime:</strong> usually none, but skin can be more sensitive to the sun afterwards.</li>
<li><strong>Good to know:</strong> it may not be the best option during an active acne breakout.</li>
</ul>
<h2>Chemical peel: renewal and tone</h2>
<p>A professional peel uses carefully selected acids to exfoliate the outer layers of the skin and encourage renewal. Peels range from very light to more intensive.</p>
<ul>
<li><strong>Often chosen for:</strong> uneven tone and pigmentation, congestion and texture.</li>
<li><strong>Downtime:</strong> from none to a few days of light flaking, depending on the peel.</li>
<li><strong>Good to know:</strong> strict sun protection is essential, and some peels are better suited to the autumn and winter months.</li>
</ul>
<h2>So, which one?</h2>
<p>As a very general guide: if your main concern is <strong>congestion or dehydration</strong>, a hydrofacial is often a good starting point; if it is <strong>texture and glow</strong>, dermaplaning may suit you; and if it is <strong>tone and pigmentation</strong>, a peel is frequently considered. In practice, the best results usually come from a plan that combines treatments over time with a good home routine.</p>
<p>Your skin type, history, medication and lifestyle all affect which option is safest and most effective — which is why we never choose a treatment without seeing your skin first. A consultation lets us recommend what is genuinely right for you.</p>` },
    pt: {
      title: 'Hydrofacial, dermaplaning ou peeling químico: qual tratamento facial escolher?',
      desc: 'Três tratamentos faciais muito procurados, explicados de forma simples — como funcionam, para quem são indicados e o que esperar depois.',
      body: `
<p>Hydrofacial, dermaplaning e peeling químico estão entre os tratamentos faciais mais procurados — e também entre os que mais geram dúvidas. Todos ajudam a pele a ficar com aspecto mais fresco, mas funcionam de formas diferentes e atendem necessidades diferentes. Veja uma comparação simples.</p>
<h2>Hydrofacial: limpar, extrair, hidratar</h2>
<p>O hydrofacial combina limpeza profunda, esfoliação suave, extração e hidratação intensa em um só tratamento, sem agulhas.</p>
<ul>
<li><strong>Costuma ser escolhido para:</strong> poros obstruídos, falta de viço e pele desidratada.</li>
<li><strong>Recuperação:</strong> geralmente nenhuma — muita gente volta à rotina na hora.</li>
<li><strong>Bom saber:</strong> é suave o bastante para a maioria dos tipos de pele e muito procurado antes de eventos.</li>
</ul>
<h2>Dermaplaning: pele lisa e luminosa</h2>
<p>O dermaplaning usa uma lâmina estéril para remover com delicadeza as células mortas e a penugem fina do rosto.</p>
<ul>
<li><strong>Costuma ser escolhido para:</strong> textura áspera, pele opaca e maquiagem que não assenta bem.</li>
<li><strong>Recuperação:</strong> geralmente nenhuma, mas a pele pode ficar mais sensível ao sol depois.</li>
<li><strong>Bom saber:</strong> pode não ser a melhor opção durante uma crise de acne ativa.</li>
</ul>
<h2>Peeling químico: renovação e uniformidade</h2>
<p>O peeling profissional usa ácidos cuidadosamente escolhidos para esfoliar as camadas mais superficiais da pele e estimular a renovação. Existem desde peelings bem leves até os mais intensos.</p>
<ul>
<li><strong>Costuma ser escolhido para:</strong> tom irregular e manchas, oleosidade e textura.</li>
<li><strong>Recuperação:</strong> de nenhuma a alguns dias de descamação leve, dependendo do peeling.</li>
<li><strong>Bom saber:</strong> a proteção solar rigorosa é essencial, e alguns peelings combinam mais com o outono e o inverno.</li>
</ul>
<h2>Então, qual escolher?</h2>
<p>Como orientação bem geral: se a sua principal queixa é <strong>oleosidade ou desidratação</strong>, o hydrofacial costuma ser um bom começo; se é <strong>textura e viço</strong>, o dermaplaning pode ser indicado; e se é <strong>tom e manchas</strong>, o peeling costuma ser considerado. Na prática, os melhores resultados geralmente vêm de um plano que combina tratamentos ao longo do tempo com uma boa rotina em casa.</p>
<p>Seu tipo de pele, histórico, medicamentos e estilo de vida influenciam qual opção é mais segura e eficaz — por isso nunca escolhemos um tratamento sem antes avaliar a sua pele. A consulta permite indicar o que realmente faz sentido para você.</p>` },
  },
];
