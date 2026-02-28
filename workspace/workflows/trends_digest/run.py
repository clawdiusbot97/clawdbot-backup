#!/usr/bin/env python3
"""
Daily Trends Digest workflow.
Clusters news/RSS items into top trends and suggests new OpenClaw skills.
"""

import json
import os
import sys
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# Add workspace to path to import local modules
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from skills.local_llm.run import LocalLLM

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------
CONFIG = {
    "sources": [
        {
            "type": "twitter",
            "path": "reports/twitter/daily/latest.json",
            "enabled": True
        },
        {
            "type": "newsletter",
            "path": "reports/newsletter/daily/latest.json",
            "enabled": True
        }
    ],
    "max_items": 50,
    "dedupe_threshold": 0.8,  # similarity threshold (0-1)
    "clusters_count": 5,
    "output_dir": "reports/trends/daily",
    "rolling_summary": "reports/trends/weekly/latest.md"
}

# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] trends_digest: %(message)s",
    handlers=[
        logging.FileHandler(Path(__file__).parent.parent.parent / "logs/trends_digest.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# Data loading
# -------------------------------------------------------------------
def load_items() -> List[Dict[str, Any]]:
    """Load items from all configured sources."""
    items = []
    workspace = Path(__file__).parent.parent.parent
    
    for src in CONFIG["sources"]:
        if not src["enabled"]:
            continue
        
        path = workspace / src["path"]
        if not path.exists():
            logger.warning(f"Source file not found: {path}")
            continue
        
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Extract items based on source type
            if src["type"] == "twitter":
                # Assume format from twitter-format skill
                for tweet in data.get("tweets", []):
                    items.append({
                        "title": tweet.get("text", "")[:100],
                        "url": tweet.get("link", ""),
                        "date": tweet.get("date", datetime.now().isoformat()),
                        "source": "twitter",
                        "snippet": tweet.get("text", "")[:200]
                    })
            elif src["type"] == "newsletter":
                # Assume format from newsletter-digest skill
                for article in data.get("articles", []):
                    items.append({
                        "title": article.get("title", ""),
                        "url": article.get("link", ""),
                        "date": article.get("date", datetime.now().isoformat()),
                        "source": "newsletter",
                        "snippet": article.get("summary", "")[:200]
                    })
            else:
                logger.warning(f"Unknown source type: {src['type']}")
        
        except Exception as e:
            logger.error(f"Failed to load source {path}: {e}")
    
    logger.info(f"Loaded {len(items)} raw items")
    return items

def deduplicate_items(items: List[Dict]) -> List[Dict]:
    """Remove near‑duplicate items based on title + snippet similarity."""
    from difflib import SequenceMatcher
    
    def similarity(a: str, b: str) -> float:
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()
    
    unique = []
    seen_hashes = set()
    
    for item in items:
        # Create a hash based on title + snippet (first 50 chars)
        key = f"{item['title'][:50]}:{item['snippet'][:50]}"
        key_hash = hashlib.md5(key.encode()).hexdigest()
        
        # Check if similar item already seen
        duplicate = False
        for seen_hash in seen_hashes:
            if similarity(key, list(seen_hashes)[0]) > CONFIG["dedupe_threshold"]:
                duplicate = True
                break
        
        if not duplicate:
            item["id"] = len(unique)  # assign numeric ID for clustering
            unique.append(item)
            seen_hashes.add(key_hash)
    
    logger.info(f"After deduplication: {len(unique)} items")
    return unique

# -------------------------------------------------------------------
# Clustering with local LLM
# -------------------------------------------------------------------
def cluster_with_llm(items: List[Dict]) -> Optional[List[Dict]]:
    """Use local LLM to group items into thematic clusters."""
    llm = LocalLLM()
    
    # Build prompt
    items_text = ""
    for i, item in enumerate(items[:CONFIG["max_items"]]):
        items_text += f"{i+1}. {item['title']}: {item['snippet']}\n"
    
    prompt = f"""Group the following news items into {CONFIG['clusters_count']} topical clusters.
For each cluster, provide:
- A short label (2‑4 words)
- 3‑bullet summary of the common theme
- List of item IDs belonging to this cluster (use the numbers 1‑{len(items)})

Items:
{items_text}

Return your answer as a JSON array of clusters, each with "label", "summary", and "items" fields.
Example:
[
  {{
    "label": "AI Agent Frameworks",
    "summary": "New frameworks for building autonomous agents...",
    "items": [1, 3, 5]
  }}
]
"""
    
    result = llm.infer(prompt, max_tokens=1024, temperature=0.3)
    if result.get("error"):
        logger.warning(f"LLM clustering failed: {result['error']}")
        return None
    
    try:
        clusters = json.loads(result["text"])
        if not isinstance(clusters, list):
            raise ValueError("Response is not a list")
        
        # Validate each cluster
        for cluster in clusters:
            if not all(k in cluster for k in ("label", "summary", "items")):
                raise ValueError("Missing required cluster fields")
        
        logger.info(f"LLM produced {len(clusters)} clusters")
        return clusters
    
    except Exception as e:
        logger.error(f"Failed to parse LLM response: {e}")
        logger.debug(f"Raw response: {result['text']}")
        return None

def fallback_keyword_clustering(items: List[Dict]) -> List[Dict]:
    """Simple keyword‑based clustering (fallback when LLM fails)."""
    # Group by source for lack of better heuristic
    from collections import defaultdict
    groups = defaultdict(list)
    
    for item in items:
        groups[item["source"]].append(item["id"])
    
    clusters = []
    for source, ids in groups.items():
        clusters.append({
            "label": f"{source.capitalize()} topics",
            "summary": f"Items from {source}",
            "items": ids
        })
    
    return clusters[:CONFIG["clusters_count"]]

# -------------------------------------------------------------------
# Skill candidate extraction
# -------------------------------------------------------------------
def extract_skill_candidates(clusters: List[Dict], items: List[Dict]) -> List[Dict]:
    """Suggest OpenClaw skills based on recurring themes."""
    llm = LocalLLM()
    
    # Build context
    clusters_text = ""
    for i, cluster in enumerate(clusters):
        cluster_items = [items[idx] for idx in cluster["items"] if idx < len(items)]
        sample_titles = [item["title"][:50] for item in cluster_items[:3]]
        clusters_text += f"{i+1}. {cluster['label']}: {cluster['summary']} (e.g., {', '.join(sample_titles)})\n"
    
    prompt = f"""Based on these trending clusters, suggest 2‑3 OpenClaw skills.
For each skill provide:
- name: short, descriptive identifier
- objective: what it does
- inputs: data sources required
- outputs: reports, alerts, actions produced
- sources: where data comes from
- risks_costs: time, API limits, complexity

Clusters:
{clusters_text}

Return JSON array of skills.
Example:
[
  {{
    "name": "agent‑benchmark‑tracker",
    "objective": "Track releases and benchmarks of AI agent frameworks",
    "inputs": ["RSS feeds", "GitHub trending"],
    "outputs": ["Weekly digest", "performance comparisons"],
    "sources": ["OpenAI blog", "LangChain docs", "arXiv"],
    "risks_costs": "Fast‑moving field, high maintenance"
  }}
]
"""
    
    result = llm.infer(prompt, max_tokens=1024, temperature=0.4)
    if result.get("error"):
        logger.warning(f"Skill extraction failed: {result['error']}")
        return []
    
    try:
        skills = json.loads(result["text"])
        if not isinstance(skills, list):
            raise ValueError("Response is not a list")
        
        logger.info(f"Extracted {len(skills)} skill candidates")
        return skills
    
    except Exception as e:
        logger.error(f"Failed to parse skill candidates: {e}")
        return []

# -------------------------------------------------------------------
# Report generation
# -------------------------------------------------------------------
def generate_markdown_report(clusters: List[Dict], 
                             skill_candidates: List[Dict],
                             items: List[Dict],
                             date: str) -> str:
    """Generate daily trends digest in Markdown."""
    lines = []
    lines.append(f"# Trends Digest – {date}")
    lines.append("")
    
    # Summary stats
    lines.append(f"**Total items:** {len(items)}")
    lines.append(f"**Clusters identified:** {len(clusters)}")
    lines.append("")
    
    # Top clusters
    lines.append("## Top Clusters")
    lines.append("")
    
    for i, cluster in enumerate(clusters):
        lines.append(f"### {i+1}. {cluster['label']}")
        lines.append(f"{cluster['summary']}")
        lines.append("")
        lines.append("**Items:**")
        for idx in cluster["items"][:5]:  # show max 5 items
            if idx < len(items):
                item = items[idx]
                lines.append(f"- [{item['title'][:80]}]({item['url']})")
        lines.append("")
    
    # Skill candidates
    if skill_candidates:
        lines.append("## 🛠️ Skill Candidates")
        lines.append("")
        
        for skill in skill_candidates:
            lines.append(f"### Skill: `{skill['name']}`")
            lines.append(f"- **Objective:** {skill['objective']}")
            lines.append(f"- **Inputs:** {', '.join(skill['inputs'])}")
            lines.append(f"- **Outputs:** {', '.join(skill['outputs'])}")
            lines.append(f"- **Sources:** {', '.join(skill['sources'])}")
            lines.append(f"- **Risks/Costs:** {skill['risks_costs']}")
            lines.append("")
    else:
        lines.append("## No skill candidates identified today.")
        lines.append("")
    
    lines.append("---")
    lines.append(f"*Generated at {datetime.now().isoformat()}*")
    
    return "\n".join(lines)

def update_rolling_summary(markdown_report: str, date: str):
    """Update the weekly rolling summary with today's insights."""
    summary_path = Path(__file__).parent.parent.parent / CONFIG["rolling_summary"]
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Simple append for now
    with open(summary_path, "a", encoding="utf-8") as f:
        f.write(f"\n## {date}\n")
        f.write(markdown_report[:500] + "...\n")
    
    logger.info(f"Updated rolling summary at {summary_path}")

# -------------------------------------------------------------------
# Main workflow
# -------------------------------------------------------------------
def main():
    logger.info("Starting Trends Digest workflow")
    
    # 1. Load items
    raw_items = load_items()
    if not raw_items:
        logger.warning("No items found, exiting")
        sys.exit(0)
    
    # 2. Deduplicate
    items = deduplicate_items(raw_items)
    
    # 3. Cluster
    clusters = cluster_with_llm(items)
    if clusters is None:
        logger.info("Falling back to keyword clustering")
        clusters = fallback_keyword_clustering(items)
    
    # 4. Extract skill candidates
    skill_candidates = extract_skill_candidates(clusters, items)
    
    # 5. Generate reports
    date = datetime.now().strftime("%Y-%m-%d")
    markdown = generate_markdown_report(clusters, skill_candidates, items, date)
    
    # Save daily report
    output_dir = Path(__file__).parent.parent.parent / CONFIG["output_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)
    
    md_path = output_dir / f"{date}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(markdown)
    
    json_path = output_dir / f"{date}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "date": date,
            "clusters": clusters,
            "skill_candidates": skill_candidates,
            "stats": {
                "total_items": len(items),
                "clusters_count": len(clusters),
                "skills_count": len(skill_candidates)
            }
        }, f, indent=2)
    
    logger.info(f"Reports saved: {md_path}, {json_path}")
    
    # 6. Update rolling summary
    update_rolling_summary(markdown, date)
    
    logger.info("Trends Digest workflow completed")

if __name__ == "__main__":
    main()