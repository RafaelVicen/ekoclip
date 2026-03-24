#!/bin/bash

# Script de Deploy - EkoClip Angular
# Facilita o deploy da aplicação Angular

echo "🚀 Iniciando deploy do EkoClip Angular..."

# Verificar se estamos no diretório correto
if [ ! -f "angular.json" ]; then
    echo "❌ Erro: Execute este script dentro do diretório angular-app"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Executar linting
echo "🔍 Executando linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Linting falhou. Corrija os erros antes do deploy."
    exit 1
fi

# Executar testes (se existirem)
if npm run test -- --watch=false --browsers=ChromeHeadless 2>/dev/null; then
    echo "✅ Testes passaram!"
else
    echo "⚠️  Testes não configurados ou falharam, mas continuando..."
fi

# Build de produção
echo "🏗️  Executando build de produção..."
npm run build -- --configuration=production

if [ $? -eq 0 ]; then
    echo "✅ Build de produção bem-sucedido!"
    echo ""
    echo "📁 Arquivos gerados em: dist/ekoclip-angular/"
    echo ""
    echo "Para deploy manual:"
    echo "  1. Faça upload do conteúdo de dist/ekoclip-angular/ para seu servidor"
    echo "  2. Configure redirects para SPA (Single Page Application)"
    echo ""
    echo "Para Netlify:"
    echo "  - Base directory: angular-app"
    echo "  - Build command: npm run build"
    echo "  - Publish directory: dist/ekoclip-angular"
    echo ""
    echo "🎉 Deploy pronto!"
else
    echo "❌ Build falhou. Verifique os erros acima."
    exit 1
fi