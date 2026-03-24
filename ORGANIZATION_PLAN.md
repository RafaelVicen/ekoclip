# 📁 Plano de Organização - EkoClip

## Estrutura Proposta

```
ekoclip-main/
├── 📄 index.html                 [Homepage principal - manter na raiz ou em pages/]
├── 📄 package.json              [Dependências do projeto]
├── 📄 manifest.json             [PWA manifest]
├── 📄 netlify.toml              [Configuração Netlify]
├── 📄 robots.txt                [SEO robots]
├── 📄 sitemap.xml               [XML sitemap]
├── 📄 ads.txt                   [Configuração de anúncios]
│
├── 📁 pages/                    [Todas as páginas HTML]
│   ├── index.html               (ou manter na raiz)
│   ├── livros.html
│   ├── musicas.html
│   ├── podcasts.html
│   ├── sobre-nos.html
│   ├── contato.html
│   ├── politica-privacidade.html
│   ├── obrigado.html
│   ├── pedido.html
│   ├── template-download.html
│   └── download-*.html          [Páginas de download de músicas]
│
├── 📁 src/                      [Código-fonte (CSS, JavaScript)]
│   ├── style.css                (estilos principais)
│   ├── script.js                (scripts principais)
│   └── sw.js                    (Service Worker)
│
├── 📁 assets/                   [Arquivos estáticos - JÁ ORGANIZADO]
│   ├── audio/                   (arquivos de áudio)
│   └── images/                  (imagens do site)
│
├── 📁 public/                   [Arquivos públicos estáticos]
│   └── [Ícones, favicons, etc]
│
├── 📁 docs/                     [Documentação]
│   ├── README.md
│   ├── README2.md
│   ├── DEPLOY_GUIDE.md
│   └── ORGANIZATION_PLAN.md
│
├── 📁 netlify/                  [Funções Netlify - JÁ ORGANIZADO]
│   └── functions/
│       └── get-news.js
│
├── 📁 deployment/               [Configurações de deploy]
│   └── netlify.toml
│
├── 📁 .github/                  [Workflows GitHub - JÁ ORGANIZADO]
└── 📁 .git/                     [Repositório Git - JÁ ORGANIZADO]
```

## Próximos Passos

1. ✅ Criar pastas: `pages/`, `src/`, `docs/`, `public/`, `deployment/`
2. Mover arquivos HTML para `pages/`
3. Mover CSS/JS para `src/`
4. Mover documentação para `docs/`
5. Mover `netlify.toml` para `deployment/`
6. Atualizar referências de paths em arquivos HTML
