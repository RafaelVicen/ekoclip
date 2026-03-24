# 📚 Guia de Deploy do EkoClip

## ✅ Código Já Preparado Localmente

Todo o código está commitado e pronto. Apenas falta fazer o push para GitHub e aí Netlify faz o resto automaticamente.

---

## 🚀 Opção 1: Push via GitHub Desktop (MAIS FÁCIL)

1. Baixa [GitHub Desktop](https://desktop.github.com/)
2. Abre GitHub Desktop e faz login com a tua conta GitHub
3. Clica em "File" → "Clone repository"
4. Procura por `RafaelVicen/ekoclip`
5. Clica em "Clone"
6. Em GitHub Desktop, vais ver que há ficheiros "Uncommitted":
   - Faz commit clicando em "Commit to main"
   - Depois clica em "Push origin" no topo

Pronto! O código está no GitHub. ✅

---

## 🚀 Opção 2: Push via Terminal com Token (ALTERNATIVA)

Se preferires terminal, segue estes passos:

### 1️⃣ Cria um GitHub Personal Access Token

- Vai a https://github.com/settings/tokens
- Clica "Generate new token" → "Generate new token (classic)"
- Seleciona as permissões: `repo` e `workflow`
- Copia o token (só aparece uma vez!)

### 2️⃣ No Terminal, faz o push com HTTPS + Token

```bash
cd c:\Users\whois\Documents\ekoclip-main
git remote set-url origin https://SEU_USERNAME:SEU_TOKEN@github.com/RafaelVicen/ekoclip.git
git push -u origin main
```

Substitui `SEU_USERNAME` e `SEU_TOKEN` pelo teu username e o token que copiaste.

---

## 🌐 Opção 3: Deploy Direto no Netlify (SEM GitHub)

Se não quiseres usar GitHub, podes fazer deploy direto:

1. Va a [Netlify](https://app.netlify.com/)
2. Faz login ou cria conta
3. Clica "Add new site" → "Deploy manually"
4. Arrasta a pasta `c:\Users\whois\Documents\ekoclip-main` para a área de drag-and-drop
5. Deploy feito! Netlify dá-te um URL

⚠️ **Nota**: Se usares esta opção, as **funções serverless (notícias) podem não funcionar 100%** porque Netlify precisa de arquivo de funções. Mas o site fica 99% funcional.

---

## ✨ Depois do Deploy

Após o código estar no GitHub/Netlify:

✅ Site estará em produção  
✅ Notícias vão carregar (se em Netlify com funções)  
✅ Modo escuro vai sincronizar entre abas  
✅ PWA instalável  
✅ SEO otimizado

---

## 📝 Próximos Passos Recomendados

1. **Deploy no Netlify** (escolhe Opção 1 ou 2 acima)
2. **Submete o sitemap no Google Search Console** para melhor SEO
3. **Testa o PWA** instalando como app
4. **Verifica as notícias** carregam corretamente

---

## 🆘 Problemas?

Se tiveres problemas com SSH ou tokens:

- **SSH**: Configura chaves SSH em https://github.com/settings/keys
- **HTTPS**: Usa um Personal Access Token (Opção 2)
- **Dúvidas**: Manda uma mensagem!
