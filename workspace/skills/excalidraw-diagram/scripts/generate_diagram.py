#!/usr/bin/env python3
"""
Diagram generation pipeline.
Supports:
- Mermaid -> PNG (via mermaid.ink)
- Excalidraw JSON -> PNG (via excalidraw.com + Playwright, if available)
- Templates for common diagram types (architecture, roadmap, workflow)
"""

import argparse
import json
import os
import sys
import tempfile
import subprocess
from pathlib import Path

# Template definitions (simple Excalidraw JSON templates)
TEMPLATES = {
    "flowchart": {
        "elements": [
            {
                "type": "rectangle",
                "id": "start",
                "x": 100,
                "y": 50,
                "width": 120,
                "height": 60,
                "text": "Start",
                "backgroundColor": "#d5e8d4",
                "strokeColor": "#82b366"
            },
            {
                "type": "rectangle",
                "id": "process",
                "x": 100,
                "y": 150,
                "width": 120,
                "height": 60,
                "text": "Process",
                "backgroundColor": "#dae8fc",
                "strokeColor": "#6c8ebf"
            },
            {
                "type": "diamond",
                "id": "decision",
                "x": 100,
                "y": 250,
                "width": 120,
                "height": 80,
                "text": "Decision?",
                "backgroundColor": "#fff2cc",
                "strokeColor": "#d6b656"
            },
            {
                "type": "arrow",
                "id": "arrow1",
                "points": [[160, 110], [160, 150]]
            },
            {
                "type": "arrow",
                "id": "arrow2",
                "points": [[160, 210], [160, 250]]
            }
        ]
    },
    "architecture": {
        "elements": [
            {
                "type": "rectangle",
                "id": "client",
                "x": 50,
                "y": 100,
                "width": 100,
                "height": 60,
                "text": "Client",
                "backgroundColor": "#e1d5e7",
                "strokeColor": "#9673a6"
            },
            {
                "type": "rectangle",
                "id": "api",
                "x": 200,
                "y": 50,
                "width": 120,
                "height": 80,
                "text": "API Gateway",
                "backgroundColor": "#dae8fc",
                "strokeColor": "#6c8ebf"
            },
            {
                "type": "rectangle",
                "id": "service1",
                "x": 200,
                "y": 150,
                "width": 120,
                "height": 60,
                "text": "Service A",
                "backgroundColor": "#d5e8d4",
                "strokeColor": "#82b366"
            },
            {
                "type": "rectangle",
                "id": "service2",
                "x": 200,
                "y": 230,
                "width": 120,
                "height": 60,
                "text": "Service B",
                "backgroundColor": "#d5e8d4",
                "strokeColor": "#82b366"
            },
            {
                "type": "rectangle",
                "id": "db",
                "x": 400,
                "y": 100,
                "width": 100,
                "height": 180,
                "text": "Database",
                "backgroundColor": "#f8cecc",
                "strokeColor": "#b85450"
            },
            {
                "type": "arrow",
                "id": "arrow1",
                "points": [[150, 130], [200, 90]]
            },
            {
                "type": "arrow",
                "id": "arrow2",
                "points": [[260, 130], [320, 130], [400, 130]]
            },
            {
                "type": "arrow",
                "id": "arrow3",
                "points": [[260, 180], [320, 180], [400, 180]]
            }
        ]
    }
}

def mermaid_to_png(mermaid_code, output_path):
    """Convert Mermaid code to PNG using mermaid.ink"""
    script_dir = Path(__file__).parent
    mermaid_script = script_dir / "mermaid_to_png.py"
    if not mermaid_script.exists():
        return False, "mermaid_to_png.py not found"
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.mmd', delete=False) as f:
        f.write(mermaid_code)
        mermaid_path = f.name
    
    try:
        result = subprocess.run(
            [sys.executable, str(mermaid_script), mermaid_path, output_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            return False, f"mermaid.ink failed: {result.stderr[:200]}"
        return True, "PNG generated via mermaid.ink"
    except subprocess.TimeoutExpired:
        return False, "Timeout generating PNG"
    except Exception as e:
        return False, f"Error: {e}"
    finally:
        os.unlink(mermaid_path)

def excalidraw_to_png(json_data, output_path):
    """Convert Excalidraw JSON to PNG using Playwright."""
    script_dir = Path(__file__).parent
    render_script = script_dir / "render_with_excalidraw.py"
    if not render_script.exists():
        return False, "render_with_excalidraw.py not found"
    
    # Write JSON to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(json_data, f)
        json_path = f.name
    
    try:
        result = subprocess.run(
            [sys.executable, str(render_script), json_path, output_path],
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode != 0:
            return False, f"Excalidraw render failed: {result.stderr[:200]}"
        return True, "PNG generated via Excalidraw"
    except subprocess.TimeoutExpired:
        return False, "Timeout rendering Excalidraw"
    except Exception as e:
        return False, f"Error: {e}"
    finally:
        os.unlink(json_path)

def main():
    parser = argparse.ArgumentParser(description="Generate diagrams from text or templates.")
    parser.add_argument("--type", choices=["mermaid", "excalidraw", "template"], default="mermaid",
                       help="Diagram type")
    parser.add_argument("--input", "-i", help="Input file (Mermaid code or Excalidraw JSON)")
    parser.add_argument("--stdin", action="store_true", help="Read input from stdin")
    parser.add_argument("--template", choices=["flowchart", "architecture", "roadmap"],
                       help="Template name (for --type template)")
    parser.add_argument("--output", "-o", required=True, help="Output PNG file path")
    parser.add_argument("--title", help="Diagram title (for templates)")
    parser.add_argument("--width", type=int, default=800, help="Width in pixels")
    parser.add_argument("--height", type=int, default=600, help="Height in pixels")
    
    args = parser.parse_args()
    
    # Read input
    input_data = ""
    if args.stdin:
        input_data = sys.stdin.read()
    elif args.input:
        if not os.path.exists(args.input):
            print(f"❌ Input file not found: {args.input}", file=sys.stderr)
            sys.exit(1)
        with open(args.input, 'r', encoding='utf-8') as f:
            input_data = f.read()
    
    success = False
    message = ""
    
    if args.type == "mermaid":
        if not input_data:
            print("❌ Mermaid code required (provide via --input or --stdin)", file=sys.stderr)
            sys.exit(1)
        success, message = mermaid_to_png(input_data, args.output)
    
    elif args.type == "excalidraw":
        if not input_data:
            print("❌ Excalidraw JSON required", file=sys.stderr)
            sys.exit(1)
        try:
            json_data = json.loads(input_data)
            success, message = excalidraw_to_png(json_data, args.output)
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON: {e}", file=sys.stderr)
            sys.exit(1)
    
    elif args.type == "template":
        if args.template not in TEMPLATES:
            print(f"❌ Unknown template: {args.template}", file=sys.stderr)
            sys.exit(1)
        template = TEMPLATES[args.template]
        if args.title:
            # Add title element
            template["elements"].insert(0, {
                "type": "text",
                "id": "title",
                "x": args.width // 2 - 100,
                "y": 20,
                "text": args.title,
                "fontSize": 24,
                "fontFamily": 1
            })
        success, message = excalidraw_to_png(template, args.output)
    
    if success:
        print(f"✅ Diagram saved to: {args.output}")
        print(f"   {message}")
        sys.exit(0)
    else:
        print(f"❌ Failed to generate diagram: {message}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()