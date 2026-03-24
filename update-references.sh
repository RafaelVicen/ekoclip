#!/bin/bash

# Script para atualizar referências nos arquivos HTML
cd /c/Users/whois/Documents/ekoclip-main/pages/

echo "Atualizando referências nos arquivos HTML..."
echo ""

# Função para atualizar um arquivo
update_file() {
    local file="$1"
    local updated=0
    
    if grep -q 'href="style.css"' "$file"; then
        sed -i 's|href="style.css"|href="../src/style.css"|g' "$file"
        ((updated++))
    fi
    
    if grep -q 'src="script.js"' "$file"; then
        sed -i 's|src="script.js"|src="../src/script.js"|g' "$file"
        ((updated++))
    fi
    
    if grep -q 'href="manifest.json"' "$file"; then
        sed -i 's|href="manifest.json"|href="../manifest.json"|g' "$file"
        ((updated++))
    fi
    
    if grep -q 'src="sw.js"' "$file"; then
        sed -i 's|src="sw.js"|src="../src/sw.js"|g' "$file"
        ((updated++))
    fi
    
    # Atualizar referências de assets
    if grep -q 'src="assets/' "$file"; then
        sed -i 's|src="assets/|src="../assets/|g' "$file"
        ((updated++))
    fi
    
    if grep -q 'src=.assets/' "$file"; then
        sed -i "s|src='assets/|src='../assets/|g" "$file"
        ((updated++))
    fi
    
    if [ $updated -gt 0 ]; then
        echo "✅ Atualizado: $file ($updated mudança(s))"
    fi
}

# Processar cada arquivo HTML
for html_file in *.html; do
    if [ -f "$html_file" ]; then
        update_file "$html_file"
    fi
done

echo ""
echo "✨ Atualizações concluídas!"
echo ""
echo "Verificando atualizações..."
echo ""
echo "=== CSS ===" 
grep -l "style.css" *.html | head -3
echo "=== JS ===" 
grep -l "script.js" *.html | head -3
echo "=== Manifest ===" 
grep -l "manifest.json" *.html
