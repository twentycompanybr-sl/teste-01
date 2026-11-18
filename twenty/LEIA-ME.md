# Site Twenty Company

Página única em HTML/CSS puro (sem build). Arquivos:
- index.html  -> a página inteira
- assets/     -> logos (branca e monograma TW, PNG transparente)

Identidade: fundo #070b1a, dourado #c9a24b, destaque amarelo #f5d442, fonte Poppins.
Contato: WhatsApp (31) 97140-9639, Instagram @twentycompany, twentycompanybr@gmail.com

Pendências: seção de portfólio, domínio próprio, deploy (Netlify), SEO e analytics/pixel.

## Atualizações (nov/2026)
- **Portfólio**: seção removida por enquanto (a pedido). Para recriar, ver o commit anterior no Git.
- **SEO**: título e descrição com palavras-chave, canonical, Open Graph/Twitter (imagem `assets/og-image.png`), favicon, dados estruturados Schema.org (`ProfessionalService`), `robots.txt`, `sitemap.xml`, `<main>` semântico, links de telefone/e-mail clicáveis.
- **Efeitos visuais**: título com entrada animada e palavra que troca (resultados/clientes/vendas/crescimento), linhas douradas que se desenham com brilho correndo, "20" vazado com parallax, brilho que segue o mouse, faixas de serviços correndo, serviços em lista que pinta de amarelo no hover, "twenty company" gigante que desliza com a rolagem, texto do "Sobre" que acende palavra por palavra, borda dourada girando no contato, botões com brilho e efeito magnético, barra de progresso, header fixo com desfoque, botão flutuante do WhatsApp e textura de grão. Tudo em CSS/JS puro, sem bibliotecas; quem usa "reduzir movimento" no sistema vê o site sem animações.
- **Deploy**: Netlify, projeto `twentycompany` → https://twentycompany.netlify.app (config em `netlify.toml`, sem build).
- Ao trocar para domínio próprio: substituir `https://twentycompany.netlify.app` em `index.html`, `robots.txt` e `sitemap.xml`.

Pendências: seção de portfólio, domínio próprio, analytics/pixel, cadastrar o sitemap no Google Search Console.
