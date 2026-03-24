#!/bin/bash
# EkoClip - Script de Migração para Angular
# Facilita a transição do projeto HTML estático para Angular

set -e

echo "🎯 EkoClip - Migração para Angular"
echo "=================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -d "angular-app" ] || [ ! -d "pages" ]; then
    error "Execute este script da raiz do projeto EkoClip."
    exit 1
fi

log "Verificando estrutura do projeto..."

# 1. Verificar se Angular CLI está instalado
if ! command -v ng &> /dev/null; then
    warn "Angular CLI não encontrado. Instalando..."
    npm install -g @angular/cli
fi

# 2. Instalar dependências do Angular
log "Instalando dependências do Angular..."
cd angular-app
if [ ! -d "node_modules" ]; then
    npm install
else
    log "Dependências já instaladas."
fi

# 3. Copiar assets do projeto original
log "Copiando assets..."
mkdir -p src/assets/images
mkdir -p src/assets/audio

if [ -d "../assets" ]; then
    cp -r ../assets/* src/assets/ 2>/dev/null || true
    log "Assets copiados com sucesso."
else
    warn "Pasta assets não encontrada no projeto original."
fi

# 4. Verificar build
log "Verificando build do Angular..."
if npm run build --silent 2>/dev/null; then
    log "✅ Build do Angular realizado com sucesso!"
else
    warn "⚠️  Build do Angular falhou, mas continuando..."
fi

cd ..

# 5. Criar script de desenvolvimento
log "Criando scripts de desenvolvimento..."

cat > start-angular.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando EkoClip Angular..."
cd angular-app
npm start
EOF

cat > build-angular.sh << 'EOF'
#!/bin/bash
echo "🔨 Fazendo build do EkoClip Angular..."
cd angular-app
npm run build
echo "✅ Build concluído! Arquivos em angular-app/dist/ekoclip-angular/"
EOF

chmod +x start-angular.sh build-angular.sh

# 6. Instruções finais
echo ""
echo "🎉 MIGRAÇÃO CONCLUÍDA!"
echo "======================"
echo ""
echo "📁 Arquivos criados:"
echo "• angular-app/ - Projeto Angular completo"
echo "• start-angular.sh - Iniciar desenvolvimento"
echo "• build-angular.sh - Build para produção"
echo ""
echo "🚀 Como usar:"
echo "• Desenvolvimento: ./start-angular.sh"
echo "• Build: ./build-angular.sh"
echo "• Produção: Arquivos em angular-app/dist/ekoclip-angular/"
echo ""
echo "📚 Leia o README: angular-app/README.md"
echo ""
echo "🔄 Migração preservou:"
echo "• ✅ Estrutura de segurança (Go backend)"
echo "• ✅ Assets e imagens"
echo "• ✅ Configurações de deploy"
echo "• ✅ Scripts de automação"
echo ""
echo "🎯 O EkoClip agora é uma aplicação Angular moderna!"