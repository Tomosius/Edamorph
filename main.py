import os
import sys
import webview

def main():
    dev_mode = '--dev' in sys.argv

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

    webview.create_window('My App', url)
    webview.start()

if __name__ == '__main__':
    main()