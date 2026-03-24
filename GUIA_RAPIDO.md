# 🚀 GUIA RÁPIDO - Estrutura EkoClip

## 📍 Onde Está Cada Tipo de Arquivo?

### 🌐 Páginas Web

```
pages/
├── index.html              ← Home (start here!)
├── livros.html
├── musicas.html
├── podcasts.html
├── sobre-nos.html
├── contato.html
└── download-*.html         ← Páginas de download
```

### 🎨 Estilos e Scripts

```
src/
├── style.css               ← Todos os estilos
├── script.js               ← JavaScript principal
└── sw.js                   ← Service Worker (PWA)
```

### 🖼️ Imagens e Áudio

```
assets/
├── images/                 ← Logos, backgrounds, etc
└── audio/                  ← Podcasts, músicas
```

### 📚 Documentação

```
docs/
├── README.md               ← Sobre o projeto
├── DEPLOY_GUIDE.md         ← Como fazer deploy
├── ORGANIZATION_PLAN.md    ← Plano de organização
├── GUIDES_ATUALIZACAO.md   ← Como atualizar referências
└── RELATORIO_REORGANIZACAO.md ← Relatório do que foi feito
```

### 🚀 Deploy e Config

```
deployment/
└── netlify.toml            ← Configuração Netlify

netlify/
└── functions/
    └── get-news.js         ← Funções serverless
```

---

## 🔗 Links Importantes no Código

### No `pages/index.html` (e outros HTMLs):

```html
<!-- CSS está em src/ -->
<link rel="stylesheet" href="../src/style.css" />

<!-- JS está em src/ -->
<script src="../src/script.js"></script>

<!-- Manifest está na raiz -->
<link rel="manifest" href="../manifest.json" />

<!-- Assets estão em assets/ -->
<img src="../assets/images/logo.png" alt="Logo" />
```

---

## 📝 Tarefas Comuns

### ✏️ Editar Estilos

1. Abra `src/style.css`
2. Faça suas mudanças
3. Salve e recarregue a página no navegador

### 📄 Criar Nova Página

1. Copie um arquivo de `pages/` (ex: `sobre-nos.html`)
2. Renomeie (ex: `novo-conteudo.html`)
3. Edite o conteúdo
4. Certifique-se que os links para CSS/JS estão corretos: `../src/style.css`

### 🖼️ Adicionar Imagem

1. Coloque a imagem em `assets/images/`
2. No HTML, referencie assim:
   ```html
   <img src="../assets/images/minha-imagem.png" alt="Descrição" />
   ```

### 🎵 Adicionar Áudio

1. Coloque o arquivo em `assets/audio/`
2. No HTML, referencie assim:
   ```html
   <audio src="../assets/audio/meu-audio.mp3" controls></audio>
   ```

---

## 🧪 Testar Localmente

### Opção 1: Live Server (VS Code)

1. Instale a extensão "Live Server"
2. Clique com botão direito em `pages/index.html`
3. Selecione "Open with Live Server"

### Opção 2: HTTP Server

```bash
npm install -g http-server
cd c:\Users\whois\Documents\ekoclip-main
http-server
```

Depois abra: `http://localhost:8080/pages/`

---

## 📤 Fazer Deploy no Netlify

1. Certificar que `deployment/netlify.toml` está correto
2. Push no GitHub
3. Netlify detecta mudanças automaticamente
4. Seu site é atualizado!

---

## 🎯 Checklist de Manutenção

- [ ] CSS e JS referenciam corretamente (`../src/...`)
- [ ] Imagens existem em `assets/images/`
- [ ] Links internos estão corretos
- [ ] HTML está bem formatado e validado
- [ ] Testar em diferentes navegadores
- [ ] Testar no celular (responsivo)

---

## 📧 Precisa de Ajuda?

Confira estes arquivos:

- `docs/GUIDES_ATUALIZACAO.md` - Como atualizar referências
- `docs/RELATORIO_REORGANIZACAO.md` - O que foi feito
- `ORGANIZATION_PLAN.md` - Plano completo

---

**Versão:** 1.0 | **Data:** 23 de março de 2026 | **Status:** ✅ Operacional
