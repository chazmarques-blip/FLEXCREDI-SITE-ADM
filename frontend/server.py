#!/usr/bin/env python3
"""
FLEXCREDI - Frontend Static Server
Serves the static HTML/CSS/JS files on port 3000
"""
import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = "/app"  # Serve files from root /app

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHandler) as httpd:
        print(f"FLEXCREDI Frontend Server running on http://0.0.0.0:{PORT}")
        print(f"Serving files from: {DIRECTORY}")
        httpd.serve_forever()
