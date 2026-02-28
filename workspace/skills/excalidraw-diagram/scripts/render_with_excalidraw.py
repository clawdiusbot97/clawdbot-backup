#!/usr/bin/env python3
"""
Render Excalidraw diagram to PNG using excalidraw.com in headless browser.
This is the most reliable method since it uses the official Excalidraw renderer.
"""

import json
import os
import sys
import tempfile
import asyncio
import base64
from pathlib import Path

async def render_excalidraw_to_png(json_path: str, output_png_path: str, width: int = 800, height: int = 600) -> bool:
    """
    Render Excalidraw JSON to PNG using Playwright to load excalidraw.com.
    
    Steps:
    1. Read Excalidraw JSON
    2. Launch headless Chromium
    3. Navigate to excalidraw.com (or local HTML with embedded JSON)
    4. Inject the JSON data via localStorage or URL hash
    5. Wait for render
    6. Take screenshot
    """
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("❌ Playwright not installed. Run: pip install playwright && playwright install chromium")
        return False
    
    # Read JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # We'll use the official embed method: excalidraw.com/?json=<base64>
    # But the embed expects a different format. Let's use a local HTML file with the JSON.
    
    html_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            overflow: hidden;
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
        const {{ Excalidraw, useHandleLibrary }} = excalidraw;
        
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
        
        // Signal when rendered
        window.__RENDERED__ = true;
    </script>
</body>
</html>
'''
    
    # Save HTML to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
        f.write(html_content)
        html_path = f.name
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Load the HTML file
            await page.goto(f'file://{html_path}')
            
            # Wait for render (check for presence of Excalidraw elements)
            await page.wait_for_function('window.__RENDERED__ === true', timeout=5000)
            
            # Ensure canvas is ready
            await page.wait_for_timeout(500)
            
            # Take screenshot of the container
            await page.locator('#container').screenshot(path=output_png_path)
            
            await browser.close()
        
        print(f"✅ PNG rendered via Excalidraw: {output_png_path}")
        return True
    except Exception as e:
        print(f"❌ Playwright render failed: {e}")
        return False
    finally:
        os.unlink(html_path)

async def main_async():
    if len(sys.argv) < 3:
        print("Usage: python render_with_excalidraw.py <input.json> <output.png> [width] [height]")
        return False
    
    json_path = sys.argv[1]
    output_png = sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 800
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 600
    
    if not os.path.exists(json_path):
        print(f"❌ JSON file not found: {json_path}")
        return False
    
    return await render_excalidraw_to_png(json_path, output_png, width, height)

def main():
    success = asyncio.run(main_async())
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()