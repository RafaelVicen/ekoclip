#!/usr/bin/env python3
"""
EkoClip - Atualização Automática do Google Analytics
Script para adicionar Google Analytics 4 em todas as páginas que ainda não têm
"""

import os
import re
from pathlib import Path

class AnalyticsUpdater:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)

    def add_ga4_to_file(self, file_path):
        """Adiciona Google Analytics 4 ao arquivo se não existir"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Verificar se já tem GA4
            if 'G-XXXXXXXXXX' in content:
                return False, "GA4 já existe"

            # Procurar onde inserir o GA4 (depois do GTM)
            gtm_pattern = r'<!-- Google Tag Manager -->\s*<script>.*?</script>'
            ga4_script = '''

    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX', {
        'page_path': window.location.pathname,
        'anonymize_ip': true
      });
    </script>'''

            if re.search(gtm_pattern, content, re.DOTALL):
                # Inserir depois do GTM
                new_content = re.sub(gtm_pattern, lambda m: m.group() + ga4_script, content, flags=re.DOTALL)
            else:
                # Se não tem GTM, procurar o final do head
                head_end_pattern = r'</head>'
                if re.search(head_end_pattern, content):
                    new_content = re.sub(head_end_pattern, ga4_script + '\n  </head>', content)
                else:
                    return False, "Não encontrou tag </head>"

            # Salvar arquivo
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            return True, "GA4 adicionado com sucesso"

        except Exception as e:
            return False, f"Erro: {str(e)}"

    def update_all_pages(self):
        """Atualiza todas as páginas HTML que precisam de GA4"""
        html_files = []

        # Procurar em todas as pastas
        for root, dirs, files in os.walk(self.root_dir):
            for file in files:
                if file.endswith('.html'):
                    html_files.append(Path(root) / file)

        print("🔄 Atualizando Google Analytics 4 em todas as páginas...")
        print(f"Encontrados {len(html_files)} arquivos HTML\n")

        updated = 0
        skipped = 0
        errors = 0

        for html_file in html_files:
            relative_path = html_file.relative_to(self.root_dir)

            # Pular páginas que já têm GA4 completo
            if str(relative_path) in ['components/welcome-angular.html', 'components/welcome-pro.html', 'src/google-analytics.html']:
                print(f"⏭️  {relative_path} - Já tem GA4 completo")
                skipped += 1
                continue

            success, message = self.add_ga4_to_file(html_file)

            if success:
                print(f"✅ {relative_path} - {message}")
                updated += 1
            else:
                print(f"❌ {relative_path} - {message}")
                if "Erro:" in message:
                    errors += 1
                else:
                    skipped += 1

        print(f"\n📊 RESUMO DA ATUALIZAÇÃO")
        print(f"✅ Páginas atualizadas: {updated}")
        print(f"⏭️  Páginas puladas: {skipped}")
        print(f"❌ Erros: {errors}")

        return updated, skipped, errors

def main():
    print("🚀 EkoClip - Atualização Automática do Google Analytics 4")
    print("=" * 60)

    # Diretório raiz do projeto
    root_dir = Path(__file__).parent.parent

    # Inicializar atualizador
    updater = AnalyticsUpdater(root_dir)

    # Atualizar todas as páginas
    updated, skipped, errors = updater.update_all_pages()

    if updated > 0:
        print("\n🎉 Atualização concluída!")
        print("💡 Execute novamente o script de verificação para confirmar:")
        print("   python scripts/verify-analytics.py")
    else:
        print("\nℹ️  Nenhuma página precisava de atualização.")

if __name__ == "__main__":
    main()