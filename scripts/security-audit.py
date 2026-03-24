#!/usr/bin/env python3
"""
EkoClip - Análise de Segurança XSS e Outras Vulnerabilidades
Script para identificar vulnerabilidades de segurança no projeto
"""

import os
import re
from pathlib import Path

class SecurityAnalyzer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.vulnerabilities = []
        self.warnings = []

    def analyze_xss_risks(self):
        """Analisa riscos de XSS no código"""
        print("🔍 Analisando riscos de XSS...")

        # Verifica uso de innerHTML
        self.check_innerhtml_usage()

        # Verifica uso de eval e funções perigosas
        self.check_dangerous_functions()

        # Verifica manipulação de URL parameters
        self.check_url_parameters()

        # Verifica localStorage/sessionStorage
        self.check_storage_usage()

        # Verifica formulários
        self.check_forms()

    def check_innerhtml_usage(self):
        """Verifica uso de innerHTML que pode causar XSS"""
        js_files = list(self.root_dir.rglob('*.js'))

        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Procura por innerHTML
                innerhtml_matches = re.findall(r'\.innerHTML\s*=\s*[`"\']', content)
                if innerhtml_matches:
                    for match in innerhtml_matches:
                        line_num = content[:content.find(match)].count('\n') + 1
                        self.vulnerabilities.append({
                            'type': 'XSS_RISK',
                            'file': str(js_file.relative_to(self.root_dir)),
                            'line': line_num,
                            'description': f'Uso de innerHTML pode permitir XSS: {match.strip()}',
                            'severity': 'HIGH',
                            'recommendation': 'Use textContent ou sanitização adequada'
                        })

                # Procura por dangerouslySetInnerHTML (se fosse React)
                dangerous_matches = re.findall(r'dangerouslySetInnerHTML', content)
                if dangerous_matches:
                    self.vulnerabilities.append({
                        'type': 'XSS_RISK',
                        'file': str(js_file.relative_to(self.root_dir)),
                        'description': 'Uso de dangerouslySetInnerHTML detectado',
                        'severity': 'CRITICAL',
                        'recommendation': 'Evite dangerouslySetInnerHTML ou use sanitização'
                    })

            except Exception as e:
                self.warnings.append(f"Erro ao analisar {js_file}: {e}")

    def check_dangerous_functions(self):
        """Verifica uso de funções perigosas"""
        js_files = list(self.root_dir.rglob('*.js'))

        dangerous_patterns = [
            (r'eval\s*\(', 'eval() - Execução de código arbitrário'),
            (r'document\.write\s*\(', 'document.write() - Pode injetar XSS'),
            (r'setTimeout\s*\(\s*["\']', 'setTimeout com string - Código dinâmico'),
            (r'setInterval\s*\(\s*["\']', 'setInterval com string - Código dinâmico'),
            (r'Function\s*\(', 'Function constructor - Código dinâmico'),
        ]

        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                for pattern, description in dangerous_patterns:
                    matches = re.findall(pattern, content)
                    if matches:
                        for match in matches:
                            line_num = content[:content.find(match)].count('\n') + 1
                            self.vulnerabilities.append({
                                'type': 'CODE_INJECTION',
                                'file': str(js_file.relative_to(self.root_dir)),
                                'line': line_num,
                                'description': f'Função perigosa detectada: {description}',
                                'severity': 'CRITICAL',
                                'recommendation': 'Evite executar código dinâmico'
                            })

            except Exception as e:
                self.warnings.append(f"Erro ao analisar {js_file}: {e}")

    def check_url_parameters(self):
        """Verifica manipulação de parâmetros de URL"""
        js_files = list(self.root_dir.rglob('*.js'))

        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Verifica uso de URLSearchParams
                if 'URLSearchParams' in content:
                    # Verifica se há validação/sanitização
                    has_validation = any(keyword in content for keyword in [
                        'encodeURIComponent', 'decodeURIComponent', 'escape', 'unescape',
                        'validate', 'sanitize', 'escapeHtml'
                    ])

                    if not has_validation:
                        self.vulnerabilities.append({
                            'type': 'URL_INJECTION',
                            'file': str(js_file.relative_to(self.root_dir)),
                            'description': 'Uso de URLSearchParams sem validação aparente',
                            'severity': 'MEDIUM',
                            'recommendation': 'Valide e sanitize parâmetros de URL antes de usar'
                        })

            except Exception as e:
                self.warnings.append(f"Erro ao analisar {js_file}: {e}")

    def check_storage_usage(self):
        """Verifica uso de localStorage/sessionStorage"""
        js_files = list(self.root_dir.rglob('*.js'))

        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                if 'localStorage' in content or 'sessionStorage' in content:
                    # Verifica se há sanitização ao armazenar/recuperar
                    has_sanitization = any(keyword in content for keyword in [
                        'JSON.parse', 'JSON.stringify', 'encodeURIComponent', 'decodeURIComponent'
                    ])

                    if not has_sanitization:
                        self.warnings.append({
                            'type': 'STORAGE_RISK',
                            'file': str(js_file.relative_to(self.root_dir)),
                            'description': 'Uso de localStorage/sessionStorage sem sanitização',
                            'severity': 'LOW',
                            'recommendation': 'Considere sanitizar dados armazenados'
                        })

            except Exception as e:
                self.warnings.append(f"Erro ao analisar {js_file}: {e}")

    def check_forms(self):
        """Verifica formulários HTML"""
        html_files = list(self.root_dir.rglob('*.html'))

        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Verifica se há formulários sem proteção CSRF
                if '<form' in content and 'method="POST"' in content:
                    # Verifica se há tokens CSRF ou outras proteções
                    has_csrf_protection = any(keyword in content for keyword in [
                        '_csrf', 'csrf_token', 'X-CSRF-Token'
                    ])

                    if not has_csrf_protection:
                        self.warnings.append({
                            'type': 'CSRF_RISK',
                            'file': str(html_file.relative_to(self.root_dir)),
                            'description': 'Formulário POST sem proteção CSRF aparente',
                            'severity': 'MEDIUM',
                            'recommendation': 'Considere implementar proteção CSRF'
                        })

            except Exception as e:
                self.warnings.append(f"Erro ao analisar {html_file}: {e}")

    def check_security_headers(self):
        """Verifica configuração de headers de segurança"""
        # Verifica se há arquivo _headers do Netlify
        headers_file = self.root_dir / '_headers'
        if not headers_file.exists():
            self.vulnerabilities.append({
                'type': 'MISSING_SECURITY_HEADERS',
                'file': 'N/A',
                'description': 'Arquivo _headers não encontrado',
                'severity': 'HIGH',
                'recommendation': 'Configure headers de segurança (CSP, HSTS, etc.)'
            })

    def generate_report(self):
        """Gera relatório de segurança"""
        print("\n" + "="*80)
        print("🛡️  RELATÓRIO DE ANÁLISE DE SEGURANÇA - EkoClip")
        print("="*80)

        # Vulnerabilidades críticas
        critical = [v for v in self.vulnerabilities if v.get('severity') == 'CRITICAL']
        if critical:
            print(f"\n🚨 VULNERABILIDADES CRÍTICAS ({len(critical)}):")
            for vuln in critical:
                print(f"  ❌ {vuln['file']}:{vuln.get('line', 'N/A')} - {vuln['description']}")
                print(f"     💡 {vuln['recommendation']}")

        # Vulnerabilidades altas
        high = [v for v in self.vulnerabilities if v.get('severity') == 'HIGH']
        if high:
            print(f"\n⚠️  VULNERABILIDADES ALTAS ({len(high)}):")
            for vuln in high:
                print(f"  ⚠️  {vuln['file']}:{vuln.get('line', 'N/A')} - {vuln['description']}")
                print(f"     💡 {vuln['recommendation']}")

        # Vulnerabilidades médias
        medium = [v for v in self.vulnerabilities if v.get('severity') == 'MEDIUM']
        if medium:
            print(f"\n📋 VULNERABILIDADES MÉDIAS ({len(medium)}):")
            for vuln in medium:
                print(f"  📋 {vuln['file']} - {vuln['description']}")
                print(f"     💡 {vuln['recommendation']}")

        # Avisos
        if self.warnings:
            print(f"\nℹ️  AVISOS ({len(self.warnings)}):")
            for warning in self.warnings:
                if isinstance(warning, dict):
                    print(f"  ℹ️  {warning['file']} - {warning['description']}")
                    print(f"     💡 {warning['recommendation']}")
                else:
                    print(f"  ℹ️  {warning}")

        # Status geral
        total_vulns = len(self.vulnerabilities)
        if total_vulns == 0:
            print("\n✅ NENHUMA VULNERABILIDADE CRÍTICA ENCONTRADA!")
        else:
            print(f"\n📊 TOTAL DE VULNERABILIDADES: {total_vulns}")

        print("\n🔒 RECOMENDAÇÕES GERAIS:")
        print("  • Implemente Content Security Policy (CSP)")
        print("  • Configure headers de segurança (HSTS, X-Frame-Options, etc.)")
        print("  • Use bibliotecas de sanitização como DOMPurify")
        print("  • Valide todas as entradas do usuário")
        print("  • Implemente proteção CSRF em formulários")
        print("  • Faça auditoria de segurança regular")

def main():
    print("🔐 EkoClip - Análise de Segurança")
    print("=" * 50)

    root_dir = Path(__file__).parent.parent
    analyzer = SecurityAnalyzer(root_dir)

    # Executa análises
    analyzer.analyze_xss_risks()
    analyzer.check_security_headers()

    # Gera relatório
    analyzer.generate_report()

if __name__ == "__main__":
    main()