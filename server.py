#!/usr/bin/env python3
"""
Simple HTTP server for testing the Kart Check System locally.
This ensures proper CORS handling and file serving.
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
HOST = 'localhost'

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    """Start the local development server."""
    # Change to the directory containing the HTML files
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer((HOST, PORT), CORSHTTPRequestHandler) as httpd:
        print(f"🚀 Kart Check System Server")
        print(f"📁 Serving files from: {os.getcwd()}")
        print(f"🌐 Server running at: http://{HOST}:{PORT}")
        print(f"📱 Open your browser and go to: http://{HOST}:{PORT}")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        try:
            # Try to open the browser automatically
            webbrowser.open(f'http://{HOST}:{PORT}')
        except Exception:
            pass  # Continue if browser opening fails
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
