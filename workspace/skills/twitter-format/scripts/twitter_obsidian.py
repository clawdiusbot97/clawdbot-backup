#!/usr/bin/env python3
"""
Twitter to Obsidian: picks top 10 tweets from raw data, writes to Obsidian vault.
"""

import json
import os
import sys
import re
from datetime import datetime, timezone
from typing import Dict, List, Any

# Paths
SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_DIR = os.path.join(SKILL_DIR, "config")
CONFIG_KEYWORDS = os.path.join(CONFIG_DIR, "keywords.json")

def load_json(path: str, default=None):
    if not os.path.exists(path):
        return default if default is not None else {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR loading {path}: {e}", file=sys.stderr)
        return default if default is not None else {}

def keyword_score(text: str, keywords: List[str]) -> int:
    """Count keyword matches (case-insensitive)."""
    text_lower = text.lower()
    score = 0
    for kw in keywords:
        if kw.lower() in text_lower:
            score += 1
    return score

def why_useful(category: str) -> str:
    """Return a short explanation why tweets of this category might be useful."""
    reasons = {
        "tech": "Relevant to your software engineering work and technology interests.",
        "finance": "Investing and long-term financial planning.",
        "marketing": "Marketing and growth strategies.",
        "history": "Medieval history and geopolitical shifts.",
        "news": "Current events in Uruguay and globally.",
    }
    return reasons.get(category, f"Category: {category}.")

def main():
    # Parse command line arguments
    raw_data_path = None
    if len(sys.argv) > 1:
        raw_data_path = sys.argv[1]
    else:
        # Look for latest raw data file
        data_dir = os.path.dirname(os.path.dirname(SKILL_DIR)) + "/twitter-fetch/data"
        if os.path.exists(data_dir):
            files = sorted([f for f in os.listdir(data_dir) if f.startswith('tweets-raw-') and f.endswith('.json')], reverse=True)
            if files:
                raw_data_path = os.path.join(data_dir, files[0])
    
    if not raw_data_path or not os.path.exists(raw_data_path):
        print(f"ERROR: Raw data file not found: {raw_data_path}", file=sys.stderr)
        print("Usage: twitter_obsidian.py [path/to/tweets-raw-{timestamp}.json]", file=sys.stderr)
        sys.exit(1)
    
    # Load config
    config = load_json(CONFIG_KEYWORDS)
    if not config:
        print("ERROR: Missing config/keywords.json", file=sys.stderr)
        sys.exit(1)
    
    keywords = config.get("keywords", {})
    categories = list(keywords.keys())
    min_score = config.get("min_keyword_score", 1)
    
    obsidian_path = config.get("obsidian_path", "/home/manpac/Obsidian/Twitter Digest")
    filename_pattern = config.get("obsidian_filename_pattern", "Twitter Digest - {date}.md")
    
    # Load raw data
    raw_data = load_json(raw_data_path)
    if not raw_data:
        print(f"ERROR: Failed to load raw data from {raw_data_path}", file=sys.stderr)
        sys.exit(1)
    
    tweets = raw_data.get("tweets", [])
    if not tweets:
        print("No tweets in raw data.", file=sys.stderr)
        sys.exit(0)
    
    # Score tweets (global across categories)
    scored_tweets = []
    for tweet in tweets:
        category = tweet.get("category", "tech")
        if category not in keywords:
            category = categories[0] if categories else "tech"
        text = tweet.get("text", "")
        kw_list = keywords.get(category, [])
        score = keyword_score(text, kw_list)
        tweet["score"] = score
        tweet["keywords_matched"] = [kw for kw in kw_list if kw.lower() in text.lower()]
        scored_tweets.append(tweet)
    
    # Filter by minimum score
    filtered = [t for t in scored_tweets if t["score"] >= min_score]
    
    # Sort by score descending, then date descending
    filtered.sort(key=lambda x: (x["score"], x.get("date", "")), reverse=True)
    
    # Pick top 10
    top10 = filtered[:10]
    
    # Prepare markdown content
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = []
    lines.append(f"# Twitter Digest {today}")
    lines.append(f"*Automated selection of top {len(top10)} relevant tweets*")
    lines.append("")
    
    for i, tweet in enumerate(top10, 1):
        account = tweet.get("account", "")
        display = tweet.get("display", account)
        text = tweet.get("text", "")
        link = tweet.get("link", "")
        date = tweet.get("date", "")
        category = tweet.get("category", "unknown")
        score = tweet.get("score", 0)
        
        # Truncate text if too long
        if len(text) > 280:
            text = text[:277] + "..."
        
        lines.append(f"## {i}. {display} (@{account})")
        lines.append(f"**Category**: {category}")
        lines.append(f"**Why useful**: {why_useful(category)}")
        lines.append(f"**Relevance score**: {score}")
        lines.append(f"**Date**: {date}")
        lines.append("")
        lines.append(f"{text}")
        lines.append("")
        lines.append(f"[🔗 Original tweet]({link})")
        lines.append("")
    
    lines.append("---")
    lines.append(f"*Generated by OpenClaw Twitter pipeline*")
    
    content = "\n".join(lines)
    
    # Ensure obsidian directory exists
    os.makedirs(obsidian_path, exist_ok=True)
    
    # Generate filename
    filename = filename_pattern.format(date=today, timestamp=datetime.now(timezone.utc).strftime("%Y%m%d-%H%M"))
    output_path = os.path.join(obsidian_path, filename)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Obsidian digest saved: {output_path}")
    print(f"Top {len(top10)} tweets written.")

if __name__ == "__main__":
    main()