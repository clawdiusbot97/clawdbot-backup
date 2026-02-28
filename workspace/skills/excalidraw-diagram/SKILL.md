---
name: excalidraw-diagram
description: Generate hand‑drawn style diagrams from Mermaid or plain JSON, using Excalidraw's CLI.
metadata:
  {
    "openclaw": {
      "emoji": "🎨",
      "tags": ["diagram", "excalidraw", "mermaid", "drawing", "workflow"]
    }
  }
---

# excalidraw‑diagram

Generates “hand‑drawn” style diagrams from:

1. **Mermaid code** → Excalidraw JSON (via `@excalidraw/mermaid‑to‑excalidraw`)
2. **Excalidraw JSON** (directly authored)
3. **Text description** → Builder agent drafts Mermaid → Excalidraw (future)

Outputs `.excalidraw.png`, `.excalidraw.svg`, or raw JSON.

## Installation

```bash
npm install -g @excalidraw/mermaid-to-excalidraw
```

## Supported diagram types

- **Architecture diagrams** (microservices, APIs, databases, cloud)
- **Roadmaps / timelines** (Gantt, milestones, phases)
- **Process workflows** (insurance quoting, underwriting, claims)
- **Sequences / flows** (user journeys, data pipelines)
- **Organisation / relationships** (teams, stakeholders)

## Usage

### Manual invocation with Mermaid

```bash
sessions_spawn agentId=builder task="Generate an Excalidraw diagram from this Mermaid flowchart that shows the Brokia quote workflow. Save as PNG and output file path."
```

### Manual invocation with JSON

```bash
sessions_spawn agentId=builder task="Generate an Excalidraw diagram from provided JSON that describes a microservice architecture. Export SVG."
```

### Integration in other skills

Example: `brokia‑plan` skill could include a step:

```bash
python3 scripts/excalidraw_generate.py --type workflow --title "Quote Process Flow"
```

## How it works (under the hood)

1. **Parse input** (Mermaid/JSON/description)
2. **Convert to Excalidraw JSON** (standard format used by excalidraw.com)
3. **Render via headless browser** (Puppeteer) or CLI converter
4. **Export** as PNG/SVG/JSON
5. **Return path** to generated file

## Templates

Pre‑defined templates in `templates/`:

- `microservice‑architecture.excalidraw.json`
- `roadmap‑timeline.excalidraw.json`
- `insurance‑workflow.excalidraw.json`

## Examples

See `examples/` for:
- Brokia quote flow
- Microservice architecture
- MVP roadmap
- Underwriting decision tree

## Related skills

- `twitter‑fetch` / `twitter‑format` – similar pipeline pattern
- `brokia‑plan` – can embed diagram generation steps