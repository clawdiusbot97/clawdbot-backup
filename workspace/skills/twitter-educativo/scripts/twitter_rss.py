#!/usr/bin/env python3
"""
Twitter RSS digest fetcher for OpenClaw.
Fetches tweets from configured accounts via Nitter RSS, filters by keywords,
and outputs a markdown digest.
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

# Optional: use feedparser if available
try:
    import feedparser
    FEEDPARSER_AVAILABLE = True
except ImportError:
    FEEDPARSER_AVAILABLE = False
    print("WARN: feedparser not installed, using built-in RSS parser (limited).", file=sys.stderr)

# Paths
SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_DIR = os.path.join(SKILL_DIR, "config")
DATA_DIR = os.path.join(SKILL_DIR, "data")
DIGESTS_DIR = os.path.join(SKILL_DIR, "digests")
CHECKPOINTS_DIR = os.path.join(SKILL_DIR, "checkpoints")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(DIGESTS_DIR, exist_ok=True)
os.makedirs(CHECKPOINTS_DIR, exist_ok=True)

CONFIG_ACCOUNTS = os.path.join(CONFIG_DIR, "accounts.json")
CONFIG_CHANNELS = os.path.join(CONFIG_DIR, "channels.json")
STATE_FILE = os.path.join(CHECKPOINTS_DIR, "last-state.json")
DEFAULT_STATE = {"last_run": None, "accounts": {}}

def load_json(path: str, default=None):
    if not os.path.exists(path):
        return default if default is not None else {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR loading {path}: {e}", file=sys.stderr)
        return default if default is not None else {}

def save_json(path: str, data):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"ERROR saving {path}: {e}", file=sys.stderr)

def fetch_rss_feedparser(url: str) -> List[Dict]:
    """Parse RSS using feedparser."""
    feed = feedparser.parse(url)
    items = []
    for entry in feed.entries:
        # Extract tweet ID from guid or link
        guid = entry.get('guid', '')
        tweet_id = guid
        # Try to extract from URL
        link = entry.get('link', '')
        if '/status/' in link:
            tweet_id = link.split('/status/')[-1].split('#')[0].split('?')[0]
        items.append({
            'id': tweet_id,
            'title': entry.get('title', ''),
            'description': entry.get('description', ''),
            'link': link,
            'published': entry.get('published', ''),
            'published_parsed': entry.get('published_parsed'),
            'author': entry.get('author', ''),
        })
    return items

def fetch_rss_builtin(url: str) -> List[Dict]:
    """Fallback RSS parser using xml.etree."""
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            xml_data = resp.read()
    except Exception as e:
        print(f"ERROR fetching {url}: {e}", file=sys.stderr)
        return []
    
    root = ET.fromstring(xml_data)
    ns = {'atom': 'http://www.w3.org/2005/Atom',
          'dc': 'http://purl.org/dc/elements/1.1/'}
    
    items = []
    for item in root.findall('.//item'):
        title_elem = item.find('title')
        description_elem = item.find('description')
        link_elem = item.find('link')
        guid_elem = item.find('guid')
        pub_date_elem = item.find('pubDate')
        author_elem = item.find('dc:creator', ns)
        
        title = title_elem.text if title_elem is not None else ''
        description = description_elem.text if description_elem is not None else ''
        link = link_elem.text if link_elem is not None else ''
        guid = guid_elem.text if guid_elem is not None else ''
        pub_date = pub_date_elem.text if pub_date_elem is not None else ''
        author = author_elem.text if author_elem is not None else ''
        
        tweet_id = guid
        if '/status/' in link:
            tweet_id = link.split('/status/')[-1].split('#')[0].split('?')[0]
        
        items.append({
            'id': tweet_id,
            'title': title,
            'description': description,
            'link': link,
            'published': pub_date,
            'published_parsed': None,  # not parsed
            'author': author,
        })
    return items

def fetch_rss(url: str) -> List[Dict]:
    if FEEDPARSER_AVAILABLE:
        return fetch_rss_feedparser(url)
    else:
        return fetch_rss_builtin(url)

def normalize_text(text: str) -> str:
    """Remove HTML tags, decode entities."""
    import html
    # Simple tag removal
    import re
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    return text.strip()

def keyword_score(text: str, keywords: List[str]) -> int:
    """Count keyword matches (case-insensitive)."""
    text_lower = text.lower()
    score = 0
    for kw in keywords:
        if kw.lower() in text_lower:
            score += 1
    return score

def parse_published_date(published: str, parsed_tuple) -> Optional[datetime]:
    if parsed_tuple:
        # feedparser parsed time (struct_time)
        import calendar
        return datetime.fromtimestamp(calendar.timegm(parsed_tuple), tz=timezone.utc)
    # Try to parse common RSS date formats
    for fmt in ("%a, %d %b %Y %H:%M:%S %Z",
                "%a, %d %b %Y %H:%M:%S %z",
                "%Y-%m-%dT%H:%M:%SZ",
                "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(published, fmt).replace(tzinfo=timezone.utc)
        except:
            continue
    return None

def main():
    config = load_json(CONFIG_ACCOUNTS)
    if not config:
        print("ERROR: Missing config/accounts.json", file=sys.stderr)
        sys.exit(1)
    
    accounts = config.get("accounts", [])
    keywords = config.get("keywords", {})
    max_tweets = config.get("max_tweets_per_account", 5)
    min_score = config.get("min_keyword_score", 1)
    nitter_base = config.get("nitter_base_url", "https://nitter.net")
    include_retweets = config.get("include_retweets", False)
    only_with_keywords = config.get("only_with_keywords", False)
    
    state = load_json(STATE_FILE, DEFAULT_STATE)
    last_ids = state.get("accounts", {})
    
    all_new_tweets = []
    
    for acc in accounts:
        username = acc["username"]
        display = acc.get("display_name", username)
        category = acc.get("category", "tech")
        kw_list = keywords.get(category, []) + keywords.get("all", [])
        
        print(f"Fetching {username} ({category})...", file=sys.stderr)
        url = f"{nitter_base}/{username}/rss"
        items = fetch_rss(url)
        
        # Filter out RTs if needed
        if not include_retweets:
            items = [it for it in items if not it['title'].startswith('RT by')]
        
        # Sort by date (newest first)
        items.sort(key=lambda x: x.get('published', ''), reverse=True)
        
        # Limit per account
        items = items[:max_tweets]
        
        new_items = []
        for it in items:
            tweet_id = it['id']
            if tweet_id == last_ids.get(username):
                # Reached last processed tweet, stop for this account
                break
            
            # Skip if only_with_keywords and score < min_score
            text = f"{it['title']} {it['description']}"
            clean_text = normalize_text(text)
            score = keyword_score(clean_text, kw_list)
            
            if only_with_keywords and score < min_score:
                continue
            
            # Parse date
            pub_date = parse_published_date(it['published'], it.get('published_parsed'))
            date_str = pub_date.isoformat() if pub_date else it['published']
            
            new_items.append({
                'account': username,
                'display': display,
                'category': category,
                'id': tweet_id,
                'text': clean_text,
                'link': it['link'],
                'date': date_str,
                'score': score,
                'keywords_matched': kw_list if score > 0 else []
            })
        
        if new_items:
            # Reverse to chronological order (oldest first) for digest
            new_items.reverse()
            all_new_tweets.extend(new_items)
            # Update last processed ID (most recent)
            last_ids[username] = new_items[-1]['id']
            print(f"  Found {len(new_items)} new tweets", file=sys.stderr)
        else:
            print(f"  No new tweets", file=sys.stderr)
    
    # Update state
    state['last_run'] = datetime.now(timezone.utc).isoformat()
    state['accounts'] = last_ids
    save_json(STATE_FILE, state)
    
    # Generate digest markdown
    if not all_new_tweets:
        print("No new tweets to report.", file=sys.stderr)
        sys.exit(0)
    
    # Group by category
    by_category = {}
    for tweet in all_new_tweets:
        cat = tweet['category']
        by_category.setdefault(cat, []).append(tweet)
    
    # Markdown output
    lines = []
    lines.append("# 🐦 Twitter Digest")
    lines.append(f"*Updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}*")
    lines.append("")
    
    for cat in ['tech', 'finance', 'marketing']:
        if cat not in by_category:
            continue
        lines.append(f"## {cat.capitalize()}")
        lines.append("")
        for tweet in by_category[cat]:
            # Truncate text if too long
            text = tweet['text']
            if len(text) > 280:
                text = text[:277] + "..."
            lines.append(f"**{tweet['display']}** ({tweet['account']})")
            lines.append(f"{text}")
            lines.append(f"[🔗 Original tweet]({tweet['link']})")
            lines.append("")
    
    lines.append("---")
    lines.append(f"*{len(all_new_tweets)} new tweets from {len(accounts)} accounts*")
    
    digest = "\n".join(lines)
    
    # Save digest file
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
    digest_path = os.path.join(DIGESTS_DIR, f"digest-{timestamp}.md")
    with open(digest_path, 'w', encoding='utf-8') as f:
        f.write(digest)
    
    # Output digest to stdout (for OpenClaw agent to capture)
    print(digest)
    
    # Also save raw data
    data_path = os.path.join(DATA_DIR, f"tweets-{timestamp}.json")
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': timestamp,
            'tweets': all_new_tweets
        }, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()