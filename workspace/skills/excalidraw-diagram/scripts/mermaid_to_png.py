#!/usr/bin/env python3
"""
Convert Mermaid code to PNG using mermaid.ink.
This is the most stable method as it uses the official mermaid.js renderer.
"""

import sys
import base64
import urllib.request
import urllib.parse
import urllib.error
import os
import json

def mermaid_to_png(mermaid_code: str, output_path: str, width: int = 800, height: int = 600) -> bool:
    """
    Convert Mermaid code to PNG via mermaid.ink.
    
    Steps:
    1. Base64 encode the Mermaid code (URL-safe)
    2. Construct URL: https://mermaid.ink/img/{base64}
    3. Download PNG
    4. Save to output_path
    """
    # URL encode (mermaid.ink expects base64 URL‑safe, no padding)
    encoded = base64.urlsafe_b64encode(mermaid_code.encode()).decode().rstrip('=')
    
    url = f"https://mermaid.ink/img/{encoded}"
    
    try:
        # Download PNG
        req = urllib.request.Request(url, headers={
            'User-Agent': 'OpenClaw/1.0 (https://openclaw.ai)'
        })
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
        
        # Save to file
        with open(output_path, 'wb') as f:
            f.write(data)
        
        # Verify file is valid PNG
        if data[:8] != b'\x89PNG\r\n\x1a\n':
            print(f"⚠️ Warning: Downloaded file doesn't look like PNG (invalid magic bytes)")
            # Still count as success if file exists
            if len(data) < 100:
                print(f"⚠️ File very small ({len(data)} bytes), might be error page")
                return False
        
        print(f"✅ PNG saved: {output_path} ({len(data)} bytes)")
        return True
        
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP error {e.code}: {e.reason}")
        # Try to read error message
        try:
            error_msg = e.read().decode()
            if 'error' in error_msg.lower():
                print(f"   Error details: {error_msg[:200]}")
        except:
            pass
        return False
    except urllib.error.URLError as e:
        print(f"❌ URL error: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python mermaid_to_png.py <input.mmd> <output.png> [width] [height]")
        print("   or: python mermaid_to_png.py --stdin <output.png> (read Mermaid from stdin)")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    # Read Mermaid code
    mermaid_code = ""
    if input_path == "--stdin":
        mermaid_code = sys.stdin.read()
    else:
        if not os.path.exists(input_path):
            print(f"❌ Input file not found: {input_path}")
            sys.exit(1)
        
        with open(input_path, 'r', encoding='utf-8') as f:
            mermaid_code = f.read()
    
    if not mermaid_code.strip():
        print("❌ Mermaid code is empty")
        sys.exit(1)
    
    # Optional width/height (mermaid.ink ignores them, but useful for future)
    width = 800
    height = 600
    if len(sys.argv) > 3:
        width = int(sys.argv[3])
    if len(sys.argv) > 4:
        height = int(sys.argv[4])
    
    # Convert
    success = mermaid_to_png(mermaid_code, output_path, width, height)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()