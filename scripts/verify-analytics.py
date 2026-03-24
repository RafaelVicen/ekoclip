#!/usr/bin/env python3
"""
EkoClip - Verificação de Google Analytics
Script para verificar se o Google Analytics está integrado em todas as páginas
"""

import os
import re
from pathlib import Path

class AnalyticsVerifier:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.results = {}

    def check_google_analytics(self, file_path):
        """Verifica se o arquivo contém Google Analytics"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            checks = {
                'gtm': 'GTM-N5PGM4G6' in content,
                'ga4': 'G-XXXXXXXXXX' in content,
                'adsense': 'ca-pub-2985352769426087' in content,
                'meta_description': 'description' in content and 'EkoClip' in content,
                'open_graph': 'og:title' in content,
                'twitter_cards': 'twitter:card' in content,
                'manifest': 'manifest.json' in content
            }

            return checks
        except Exception as e:
            return {'error': str(e)}

    def scan_html_files(self):
        """Escaneia todos os arquivos HTML no projeto"""
        print(f"Diretório raiz: {self.root_dir}")
        print(f"Diretório existe: {self.root_dir.exists()}")

        html_files = []

        # Procurar em todas as pastas
        for root, dirs, files in os.walk(self.root_dir):
            for file in files:
                if file.endswith('.html'):
                    html_files.append(Path(root) / file)

        print(f"Arquivos encontrados no walk: {len(html_files)}")
        for f in html_files:
            print(f"  - {f}")

        print("\n🔍 Verificando Google Analytics em todas as páginas HTML...")
        print(f"Encontrados {len(html_files)} arquivos HTML\n")

        for html_file in html_files:
            relative_path = html_file.relative_to(self.root_dir)
            checks = self.check_google_analytics(html_file)
            self.results[str(relative_path)] = checks

            # Status do arquivo
            status = "✅" if all(checks.values()) else "⚠️" if any(checks.values()) else "❌"
            print(f"{status} {relative_path}")

            # Detalhes dos checks
            for check_name, passed in checks.items():
                if check_name != 'error':
                    icon = "✅" if passed else "❌"
                    print(f"   {icon} {check_name}")
            print()

    def generate_report(self):
        """Gera relatório final"""
        print("📊 RELATÓRIO FINAL")
        print("=" * 50)

        total_files = len(self.results)
        fully_integrated = sum(1 for checks in self.results.values()
                             if isinstance(checks, dict) and all(checks.values()))
        partially_integrated = sum(1 for checks in self.results.values()
                                 if isinstance(checks, dict) and any(checks.values()) and not all(checks.values()))
        not_integrated = sum(1 for checks in self.results.values()
                           if isinstance(checks, dict) and not any(checks.values()))

        print(f"📁 Total de arquivos HTML: {total_files}")
        print(f"✅ Totalmente integrados: {fully_integrated}")
        print(f"⚠️ Parcialmente integrados: {partially_integrated}")
        print(f"❌ Não integrados: {not_integrated}")

        if fully_integrated == total_files:
            print("\n🎉 Parabéns! Google Analytics está integrado em todas as páginas!")
        else:
            print("\n⚠️ Algumas páginas ainda precisam de integração.")

        print("\n📋 DETALHES POR ARQUIVO:")
        for file_path, checks in self.results.items():
            if isinstance(checks, dict):
                missing = [k for k, v in checks.items() if not v]
                if missing:
                    print(f"⚠️ {file_path}: Faltando {', '.join(missing)}")

def main():
    print("🚀 EkoClip - Verificação de Google Analytics")
    print("=" * 50)

    # Diretório raiz do projeto (pasta pai do scripts)
    root_dir = Path(__file__).parent.parent

    # Inicializar verificador
    verifier = AnalyticsVerifier(root_dir)

    # Escanear arquivos
    verifier.scan_html_files()

    # Gerar relatório
    verifier.generate_report()

    print("\n💡 Para testar o Google Analytics:")
    print("1. Abra as páginas no navegador")
    print("2. Verifique o console do desenvolvedor (F12)")
    print("3. Procure por mensagens do Google Tag Manager")
    print("4. Use as ferramentas do Google Analytics para verificar o tráfego")

if __name__ == "__main__":
    main()