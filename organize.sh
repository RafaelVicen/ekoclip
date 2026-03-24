#!/bin/bash

cd /c/Users/whois/Documents/ekoclip-main

# Mover arquivos HTML para pages/
echo "Movendo arquivos HTML..."
mv /c/Users/whois/Documents/ekoclip-main/*.html /c/Users/whois/Documents/ekoclip-main/pages/ 2>/dev/null

# Mover CSS e JS para src/
echo "Movendo CSS e JavaScript..."
mv /c/Users/whois/Documents/ekoclip-main/style.css /c/Users/whois/Documents/ekoclip-main/src/
mv /c/Users/whois/Documents/ekoclip-main/script.js /c/Users/whois/Documents/ekoclip-main/src/
mv /c/Users/whois/Documents/ekoclip-main/sw.js /c/Users/whois/Documents/ekoclip-main/src/

# Mover documentação para docs/
echo "Movendo documentação..."
mv /c/Users/whois/Documents/ekoclip-main/README.md /c/Users/whois/Documents/ekoclip-main/docs/
mv /c/Users/whois/Documents/ekoclip-main/README2.md /c/Users/whois/Documents/ekoclip-main/docs/
mv /c/Users/whois/Documents/ekoclip-main/DEPLOY_GUIDE.md /c/Users/whois/Documents/ekoclip-main/docs/

# Mover netlify.toml para deployment/
echo "Movendo configuração de deployment..."
mkdir -p /c/Users/whois/Documents/ekoclip-main/deployment
mv /c/Users/whois/Documents/ekoclip-main/netlify.toml /c/Users/whois/Documents/ekoclip-main/deployment/

echo "✅ Organização concluída!"
echo ""
echo "Nova estrutura:"
ls -la /c/Users/whois/Documents/ekoclip-main/ | grep "^d"
