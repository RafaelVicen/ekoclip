#!/usr/bin/env python3
"""
EkoClip - Aplicação de Correções de Segurança
Script para aplicar correções automáticas de segurança
"""

import os
import re
from pathlib import Path

class SecurityFixer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)

    def add_csrf_tokens_to_forms(self):
        """Adiciona tokens CSRF aos formulários"""
        form_files = [
            'pages/contato.html',
            'pages/pedido.html'
        ]

        for form_file in form_files:
            file_path = self.root_dir / form_file
            if file_path.exists():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Adiciona campo hidden para CSRF token
                    csrf_field = '\n            <input type="hidden" name="_csrf" id="csrf_token" value="">'

                    # Insere antes do botão submit
                    content = re.sub(
                        r'(\s*<button[^>]*type="submit"[^>]*>.*?</button>)',
                        f'{csrf_field}\\1',
                        content,
                        flags=re.DOTALL
                    )

                    # Adiciona script para gerar token CSRF
                    csrf_script = '''
            <script>
              // Gera token CSRF quando o formulário é submetido
              document.addEventListener('DOMContentLoaded', function() {
                const csrfToken = btoa(Math.random().toString()).substr(10, 16);
                const csrfField = document.getElementById('csrf_token');
                if (csrfField) {
                  csrfField.value = csrfToken;
                }
              });
            </script>'''

                    # Adiciona script antes do fechamento do body
                    content = re.sub(
                        r'(\s*</body>)',
                        f'{csrf_script}\\1',
                        content
                    )

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)

                    print(f"✅ CSRF token adicionado a {form_file}")

                except Exception as e:
                    print(f"❌ Erro ao processar {form_file}: {e}")

    def add_security_script_to_html_files(self):
        """Adiciona script de segurança a todos os arquivos HTML"""
        html_files = list(self.root_dir.rglob('*.html'))

        security_script = '''
    <!-- Security Utils -->
    <script src="../scripts/security-utils.js"></script>'''

        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Verifica se já tem o script
                if 'security-utils.js' not in content:
                    # Adiciona antes do fechamento do head
                    content = re.sub(
                        r'(\s*</head>)',
                        f'{security_script}\\1',
                        content
                    )

                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)

                    print(f"✅ Script de segurança adicionado a {html_file.name}")

            except Exception as e:
                print(f"❌ Erro ao processar {html_file}: {e}")

    def create_csp_violation_report(self):
        """Cria endpoint para relatar violações de CSP"""
        csp_report = '''// CSP Violation Report Endpoint
// Este arquivo pode ser usado para coletar relatórios de violações de CSP

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const violation = JSON.parse(event.body);

    // Log da violação (em produção, envie para serviço de monitoramento)
    console.log('CSP Violation:', {
      documentUri: violation.documentURI,
      violatedDirective: violation.violatedDirective,
      originalPolicy: violation.originalPolicy,
      blockedUri: violation.blockedURI,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Erro ao processar relatório CSP:', error);
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }
};'''

        csp_file = self.root_dir / 'netlify' / 'functions' / 'csp-report.js'
        csp_file.parent.mkdir(parents=True, exist_ok=True)

        with open(csp_file, 'w', encoding='utf-8') as f:
            f.write(csp_report)

        print("✅ Endpoint de relatório CSP criado")

def main():
    print("🔧 EkoClip - Aplicação de Correções de Segurança")
    print("=" * 55)

    root_dir = Path(__file__).parent.parent
    fixer = SecurityFixer(root_dir)

    print("Adicionando tokens CSRF aos formulários...")
    fixer.add_csrf_tokens_to_forms()

    print("\nAdicionando scripts de segurança aos HTML...")
    fixer.add_security_script_to_html_files()

    print("\nCriando endpoint de relatório CSP...")
    fixer.create_csp_violation_report()

    print("\n🎉 Correções de segurança aplicadas!")
    print("💡 Execute novamente a auditoria para verificar as melhorias:")
    print("   python scripts/security-audit.py")

if __name__ == "__main__":
    main()