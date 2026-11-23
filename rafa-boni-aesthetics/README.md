# Rafa Boni Aesthetics — website

Site estático bilíngue (EN/PT), gerado por um script Node sem dependências.

```
src/data.mjs     ← configuração, tratamentos, antes & depois, reviews, caminhos das fotos
src/i18n.mjs     ← todos os textos da interface em inglês e português
src/legal.mjs    ← Privacy Policy e Terms & Conditions (EN/PT)
src/build.mjs    ← gerador (templates)
site/            ← pasta publicada (HTML gerado + assets)
```

## Gerar e testar localmente

```bash
node src/build.mjs
cd site && python3 -m http.server 8080   # abra http://localhost:8080
```

Páginas: `/en/`, `/pt/`, `/en/privacy-policy/`, `/pt/politica-de-privacidade/`,
`/en/terms-and-conditions/`, `/pt/termos-e-condicoes/`. A raiz `/` redireciona
para o idioma salvo ou o do navegador (padrão: inglês).

## Publicar no Netlify

- Base directory: `rafa-boni-aesthetics` (o `netlify.toml` já define build e publish).
- O domínio de canonical/sitemap vem automaticamente da variável `URL` do Netlify
  (ou defina `SITE_URL`).
- Formulário: usa **Netlify Forms** (`consultation`). Ative notificações por e-mail em
  *Site settings → Forms → Form notifications*. Fora do Netlify, o formulário
  encaminha a solicitação pelo WhatsApp.

## Adicionar os materiais da cliente

1. Coloque os arquivos em `site/assets/` (`logo/`, `portraits/`, `treatments/`,
   `before-after/`, `reviews/`, `gallery/`, `branding/`).
2. Informe os caminhos em `src/data.mjs` (`config.logo`, `config.portraits.*`,
   `treatments[].img`, `config.ogImage`).
3. Antes & depois: adicione os pares em `results` e só então mude
   `resultsGalleryEnabled` para `true` — **somente com consentimento por escrito de
   cada cliente e após revisão das regras ASA/CAP**.
4. Reviews: adicione em `reviews`, com o texto exatamente como a cliente escreveu.
5. Rode `node src/build.mjs` novamente.

Prefira fotos em WebP/AVIF ou JPG otimizado (retratos ~1600px no lado maior).

## Conformidade (Reino Unido)

- Toxina botulínica e vitaminas injetáveis (POMs) aparecem apenas como **consultas
  neutras**, sem citar o produto e sem botão promocional.
- Nenhum resultado garantido; aviso de "results vary" e de 18+.
- Sem cookies de análise. Se adicionar analytics, implemente banner de consentimento.
- Revise Privacy Policy e Terms com a cliente antes de publicar.
