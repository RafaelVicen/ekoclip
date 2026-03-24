# 🔧 Guia de Atualização de Referências

Após a reorganização, você precisa atualizar os caminhos nos seus arquivos HTML que referenciam CSS, JavaScript e recursos.

## Alterações Necessárias

### Nos arquivos HTML em `pages/`

Se os arquivos HTML referenciam recursos que foram movidos, adicione `../` antes do caminho:

#### ❌ Antes (quando CSS/JS estavam na raiz):

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"><\/script>
```

#### ✅ Depois (agora que estão em `src/`):

```html
<link rel="stylesheet" href="../src/style.css">
<script src="../src/script.js"><\/script>
```

---

## Como Verificar e Atualizar

### Opção 1: Usar VS Code Find and Replace

1. Abra Find and Replace (Ctrl+H)
2. **Procurar:** `href="style.css"` → **Substituir por:** `href="../src/style.css"`
3. **Procurar:** `src="script.js"` → **Substituir por:** `src="../src/script.js"`

### Opção 2: Verificar referências em `pages/index.html`

```bash
grep -r "href\|src" /c/Users/whois/Documents/ekoclip-main/pages/ | grep -E "(style|script|sw.js)"
```

---

## Estrutura Final Resumida

```
ekoclip-main/
├── pages/              ← Todos os HTMLs aqui
│   └── *.html
├── src/                ← CSS, JS e Service Worker
│   ├── style.css
│   ├── script.js
│   └── sw.js
├── assets/             ← Imagens e áudio
│   ├── images/
│   └── audio/
├── docs/               ← Documentação
├── deployment/         ← Config de deploy
├── netlify/            ← Funções serverless
└── public/             ← Recursos estáticos (favicon, etc)
```

## Importante: Configurar Netlify

Se está usando Netlify, atualize o arquivo em `deployment/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "pages"  # Aponte para a pasta pages se necessário

[[redirects]]
  from = "/*"
  to = "/pages/index.html"  # Redirecione para o index correto
  status = 200
```

---

## Próximos Passos Recomendados

1. ✅ Verificar todos os links nos arquivos HTML
2. ⭕ Testar localmente: `npx http-server` ou usar Live Server do VS Code
3. ⭕ Atualizar Netlify com nova estrutura
4. ⭕ Fazer commit e push das alterações
