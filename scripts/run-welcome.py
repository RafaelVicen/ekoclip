#!/usr/bin/env python3
"""
EkoClip Welcome Pages - Quick Launcher
Abre automaticamente as páginas em seu navegador
"""

import webbrowser
import os
import http.server
import socketserver
import threading
import time

PORT = 8000

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

def start_server():
    """Inicia servidor HTTP local"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
        print(f"\n{'='*60}")
        print(f"🚀 Servidor iniciado em: http://localhost:{PORT}/")
        print(f"{'='*60}\n")
        
        print("📄 Páginas disponíveis:\n")
        print(f"  1️⃣  welcome.html          (Minimalista)")
        print(f"  2️⃣  welcome-pro.html      (Premium)")
        print(f"  3️⃣  welcome-angular.html  (Component Manager)\n")
        
        print(f"{'='*60}\n")
        print("💡 Dicas:")
        print("  • Pressione CTRL+C para parar o servidor")
        print("  • Abra http://localhost:8000/welcome.html no navegador")
        print("  • Use refresh (F5) para recarregar\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✅ Servidor parado. Até logo!")
            exit(0)

if __name__ == "__main__":
    # Inicia o servidor
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Aguarda o servidor estar pronto
    time.sleep(1)
    
    # Abre o navegador automaticamente
    try:
        url = "http://localhost:8000/welcome-pro.html"
        print(f"\n🌐 Abrindo {url} no navegador...\n")
        webbrowser.open(url)
    except Exception as e:
        print(f"\n⚠️  Não consegui abrir o navegador: {e}")
        print(f"Abra manualmente: http://localhost:8000/welcome.html\n")
    
    # Mantém a thread viva
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
