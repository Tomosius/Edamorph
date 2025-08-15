import os
import sys
import webview
from app import Api  # Import your backend API class

def main():
    """Main entry point for the application."""
    dev_mode = '--dev' in sys.argv
    api = Api()  # Create backend API instance

    if dev_mode:
        url = "http://localhost:3000"
        print("Running in DEV mode (React live server)...")
    else:
        index_path = os.path.join(
            os.path.dirname(__file__),
            'frontend', 'out', 'index.html'
        )
        url = f'file://{index_path}'
        print("Running in PRODUCTION mode (built static files)...")

    # Pass the API to PyWebView so frontend can call backend functions
    webview.create_window('My App', url, js_api=api)
    webview.start()

if __name__ == '__main__':
    main()