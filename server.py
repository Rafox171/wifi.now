#!/usr/bin/env python3
"""
Servidor local para desenvolvimento. Serve arquivos estáticos na porta 3000.
URLs sem extensão redirecionam para .html automaticamente (ex: /termos → termos.html).
"""
import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        # Tenta resolver URL sem extensão para .html
        if '.' not in os.path.basename(path) and path != '/':
            candidate = os.path.join(DIRECTORY, path.lstrip('/') + '.html')
            if os.path.isfile(candidate):
                self.send_response(301)
                self.send_header('Location', path + '.html')
                self.end_headers()
                return
        super().do_GET()

    def log_message(self, format, *args):
        print(f"  {self.address_string()} - {format % args}")

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f"Servidor rodando em http://localhost:{PORT}")
    print("Pressione Ctrl+C para parar.")
    httpd.serve_forever()
