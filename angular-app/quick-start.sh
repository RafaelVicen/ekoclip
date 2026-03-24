#!/bin/bash

# Script de Inicialização Rápida - EkoClip Angular
# Este script configura e testa rapidamente o projeto Angular

echo "🚀 Iniciando configuração do EkoClip Angular..."

# Verificar se estamos no diretório correto
if [ ! -f "angular.json" ]; then
    echo "❌ Erro: Execute este script dentro do diretório angular-app"
    exit 1
fi

echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
else
    echo "✅ Dependências já instaladas"
fi

echo "🔍 Verificando configuração..."
if [ ! -f "src/environments/environment.ts" ]; then
    echo "📝 Criando arquivo de ambiente..."
    cp src/environments/environment.example.ts src/environments/environment.ts 2>/dev/null || echo "⚠️  Arquivo de exemplo não encontrado"
fi

echo "🧪 Executando linting..."
npm run lint 2>/dev/null || echo "⚠️  Linting falhou, mas continuando..."

echo "🏗️  Testando build de desenvolvimento..."
npm run build -- --configuration=development

if [ $? -eq 0 ]; then
    echo "✅ Build de desenvolvimento bem-sucedido!"
    echo ""
    echo "🎉 Projeto pronto para desenvolvimento!"
    echo ""
    echo "Para iniciar o servidor de desenvolvimento:"
    echo "  npm start"
    echo ""
    echo "Para build de produção:"
    echo "  npm run build"
    echo ""
    echo "Para deploy no Netlify:"
    echo "  Configure o repositório no Netlify com:"
    echo "  - Base directory: angular-app"
    echo "  - Build command: npm run build"
    echo "  - Publish directory: dist/ekoclip-angular"
else
    echo "❌ Build falhou. Verifique os erros acima."
    exit 1
fi