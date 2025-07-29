#!/usr/bin/env python3
"""
Simple HTTP server for ZKP Job Eligibility Demo
Serves the demo files with proper CORS headers for local development
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    # Serve files from the project root directory
    root_dir = Path(__file__).parent
    print(f"📁 Serving files from: {root_dir.absolute()}")
    
    # Check if src directory exists
    src_dir = root_dir / 'src'
    if not src_dir.exists():
        print("❌ Warning: 'src' directory not found!")

    # Set up server
    PORT = 8001  # Use a different port
    Handler = CORSHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 ZKP Job Eligibility Demo Server")
            print(f"📡 Server running at: http://localhost:{PORT}")
            print(f"🔗 Open in browser: http://localhost:{PORT}/index.html")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use!")
            print(f"💡 Try using a different port or stop the existing server")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()