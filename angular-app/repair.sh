#!/bin/bash

# Script de Reparo - EkoClip Angular Build
# Resolve problemas comuns de build

set -e

echo "🔧 Iniciando reparo do projeto Angular..."

# Limpar cache e node_modules
echo "🧹 Limpando cache..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install

# Limpar build anteriores
echo "🗑️  Limpando builds anteriores..."
rm -rf dist/

# Tentar build novamente
echo "🏗️  Executando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build bem-sucedido!"
    ls -la dist/
else
    echo "❌ Build falhou, verifique os erros acima"
    exit 1
fi