#!/usr/bin/env python3
"""
Render Excalidraw JSON to PNG using headless Chromium via Playwright.
"""

import json
import os
import sys
import tempfile
import subprocess
import base64
from pathlib import Path

def check_playwright():
    """Check if Playwright and Chromium are available."""
    try:
        import playwright
        return True
    except ImportError:
        return False

def install_playwright():
    """Install Playwright and Chromium."""
    print("Installing Playwright and Chromium...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "playwright", "--user", "--break-system-packages"], check=True, capture_output=True)
        subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Installation failed: {e}")
        return False

def render_json_to_png(json_path, output_png_path, width=800, height=600):
    """
    Render Excalidraw JSON to PNG using Playwright.
    Creates a minimal HTML page that loads the Excalidraw library and draws the elements.
    """
    # Read JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create HTML
    html = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Excalidraw Render</title>
    <script src="https://unpkg.com/@excalidraw/excalidraw@1.0.0/dist/excalidraw.min.js"></script>
    <style>
        body {{
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: white;
        }}
        #container {{
            width: {width}px;
            height: {height}px;
            border: 1px solid #ddd;
        }}
    </style>
</head>
<body>
    <div id="container"></div>
    <script>
        const container = document.getElementById('container');
        const elements = {json.dumps(data.get('elements', []))};
        const files = {json.dumps(data.get('files', {}))};
        
        const excalidraw = window.ExcalidrawLib;
        const { Excalidraw, useHandleLibrary } = excalidraw;
        
        const App = () => {{
            return React.createElement(Excalidraw, {{
                initialData: {{ elements, files }},
                width: {width},
                height: {height},
                viewModeEnabled: false,
                zenModeEnabled: false,
                gridModeEnabled: false,
                isCollaborating: false,
                UIOptions: {{
                    canvasActions: {{
                        changeViewBackgroundColor: false,
                        clearCanvas: false,
                        export: false,
                        loadScene: false,
                        saveToActiveFile: false,
                    }}
                }}
            }});
        }};
        
        const ExcalidrawWrapper = () => {{
            useHandleLibrary();
            return React.createElement(App);
        }};
        
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(ExcalidrawWrapper));
    </script>
</body>
</html>
'''
    
    # Save HTML to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
        f.write(html)
        html_path = f.name
    
    try:
        # Use Playwright to capture screenshot
        import asyncio
        from playwright.async_api import async_playwright
        
        async def capture():
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await page.goto(f'file://{html_path}')
                await page.wait_for_timeout(1000)  # Let it render
                await page.screenshot(path=output_png_path, full_page=False)
                await browser.close()
        
        asyncio.run(capture())
        print(f"✅ PNG saved to: {output_png_path}")
        return True
    except Exception as e:
        print(f"Playwright capture failed: {e}")
        # Fallback: use headless Chrome via command line
        try:
            chrome_args = [
                'chromium-browser', '--headless', '--disable-gpu',
                f'--window-size={width},{height}',
                '--screenshot=' + output_png_path,
                f'file://{html_path}'
            ]
            subprocess.run(chrome_args, check=True, capture_output=True, timeout=10)
            print(f"✅ PNG saved (fallback): {output_png_path}")
            return True
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            return False
    finally:
        os.unlink(html_path)

def main():
    if len(sys.argv) < 3:
        print("Usage: python render_excalidraw.py <input.json> <output.png> [width] [height]")
        sys.exit(1)
    
    json_path = sys.argv[1]
    output_png = sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 800
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 600
    
    if not os.path.exists(json_path):
        print(f"Error: JSON file not found: {json_path}")
        sys.exit(1)
    
    # Check/install Playwright
    if not check_playwright():
        print("Playwright not installed.")
        if not install_playwright():
            print("Failed to install Playwright. Trying fallback...")
    
    # Render
    success = render_json_to_png(json_path, output_png, width, height)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()