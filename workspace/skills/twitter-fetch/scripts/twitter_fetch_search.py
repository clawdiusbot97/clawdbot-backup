#!/usr/bin/env python3
"""
Twitter RSS fetcher (Researcher role) - Search‑based version.
Fetches raw tweets from configured search queries via Nitter RSS.
Saves raw JSON and updates checkpoint state.
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import urllib.request, urllib.parse
import xml.etree.ElementTree as ET

# Optional: use feedparser if available
try:
    import feedparser
    FEEDPARSER_AVAILABLE = True
except ImportError:
    FEEDPARSER_AVAILABLE = False
    print("WARN: feedparser not installed, using built-in RSS parser.", file=sys.stderr)

# Paths
SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_DIR = os.path.join(SKILL_DIR, "config")
DATA_DIR = os.path.join(SKILL_DIR, "data")
CHECKPOINTS_DIR = os.path.join(SKILL_DIR, "checkpoints")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(CHECKPOINTS_DIR, exist_ok=True)

CONFIG_SEARCHES = os.path.join(CONFIG_DIR, "searches.json")
CONFIG_ACCOUNTS = os.path.join(CONFIG_DIR, "accounts.json")
STATE_FILE = os.path.join(CHECKPOINTS_DIR, "last-state.json")
DEFAULT_STATE = {"last_run": None, "searches": {}, "accounts": {}}

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
        guid = entry.get('guid', '')
        link = entry.get('link', '')
        tweet_id = guid
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
            'published_parsed': None,
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
    import re
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    return text.strip()

def parse_published_date(published: str, parsed_tuple) -> str:
    """Convert published date to ISO string if possible."""
    if parsed_tuple:
        import calendar
        dt = datetime.fromtimestamp(calendar.timegm(parsed_tuple), tz=timezone.utc)
        return dt.isoformat()
    # Return as-is if parsing fails
    return published

def extract_username(author: str) -> str:
    """Extract username from author field (e.g., 'By @username')."""
    if not author:
        return ""
    # Pattern like "By @username"
    import re
    match = re.search(r'@([a-zA-Z0-9_]+)', author)
    if match:
        return match.group(1)
    return author

def main():
    # Load searches config (preferred) or accounts config (legacy)
    config = load_json(CONFIG_SEARCHES)
    using_searches = True
    if not config or "searches" not in config:
        config = load_json(CONFIG_ACCOUNTS)
        using_searches = False
        if not config:
            print("ERROR: Missing config/searches.json or config/accounts.json", file=sys.stderr)
            sys.exit(1)
    
    nitter_base = config.get("nitter_base_url", "https://nitter.net")
    include_retweets = config.get("include_retweets", False)
    total_max_tweets = config.get("total_max_tweets", 100)
    
    state = load_json(STATE_FILE, DEFAULT_STATE)
    if using_searches:
        last_ids = state.get("searches", {})
    else:
        last_ids = state.get("accounts", {})
    
    raw_tweets = []
    stats = {"total_fetched": 0, "per_source": {}, "errors": []}
    
    if using_searches:
        searches = config.get("searches", [])
        max_per_query = config.get("max_tweets_per_query", 20)
        print(f"Fetching from {len(searches)} search queries...", file=sys.stderr)
        for srch in searches:
            query = srch["query"]
            category = srch.get("category", "tech")
            limit = srch.get("max_tweets", max_per_query)
            
            print(f"Search: '{query}' ({category})...", file=sys.stderr)
            url = f"{nitter_base}/search/rss?q={urllib.parse.quote(query)}"
            try:
                items = fetch_rss(url)
            except Exception as e:
                stats["errors"].append(f"{query}: {e}")
                print(f"  ERROR: {e}", file=sys.stderr)
                continue
            
            # Filter out RTs if needed
            if not include_retweets:
                items = [it for it in items if not it['title'].startswith('RT by')]
            
            # Sort by date (newest first)
            items.sort(key=lambda x: x.get('published', ''), reverse=True)
            
            # Limit per query
            items = items[:limit]
            
            new_items = []
            for it in items:
                tweet_id = it['id']
                # Deduplicate across all queries (global duplicate check)
                if any(t['id'] == tweet_id for t in raw_tweets):
                    continue
                
                # Stop when reaching last processed tweet for this query
                if tweet_id == last_ids.get(query):
                    break
                
                # Normalize text
                text = f"{it['title']} {it['description']}"
                clean_text = normalize_text(text)
                
                # Parse date
                pub_date = parse_published_date(it['published'], it.get('published_parsed'))
                
                # Extract username from author
                author = it.get('author', '')
                username = extract_username(author)
                display = username if username else query
                
                new_items.append({
                    'account': username,
                    'display': display,
                    'category': category,
                    'id': tweet_id,
                    'text': clean_text,
                    'link': it['link'],
                    'date': pub_date,
                    'raw_title': it['title'],
                    'raw_description': it['description'],
                    'author': author,
                })
            
            if new_items:
                # Update last processed ID for this query (most recent)
                last_ids[query] = new_items[-1]['id']
                raw_tweets.extend(new_items)
                stats["per_source"][query] = len(new_items)
                print(f"  Found {len(new_items)} new tweets", file=sys.stderr)
                # Enforce total max limit
                if len(raw_tweets) >= total_max_tweets:
                    raw_tweets = raw_tweets[:total_max_tweets]
                    print(f"  Reached total limit of {total_max_tweets} tweets, stopping.", file=sys.stderr)
                    break
            else:
                print(f"  No new tweets", file=sys.stderr)
                stats["per_source"][query] = 0
        
        # Update state
        state['searches'] = last_ids
    else:
        # Legacy accounts mode (original logic)
        accounts = config.get("accounts", [])
        max_tweets = config.get("max_tweets_per_account", 20)
        
        for acc in accounts:
            username = acc["username"]
            display = acc.get("display_name", username)
            category = acc.get("category", "tech")
            
            print(f"Fetching {username} ({category})...", file=sys.stderr)
            url = f"{nitter_base}/{username}/rss"
            try:
                items = fetch_rss(url)
            except Exception as e:
                stats["errors"].append(f"{username}: {e}")
                print(f"  ERROR: {e}", file=sys.stderr)
                continue
            
            if not include_retweets:
                items = [it for it in items if not it['title'].startswith('RT by')]
            
            items.sort(key=lambda x: x.get('published', ''), reverse=True)
            items = items[:max_tweets]
            
            new_items = []
            for it in items:
                tweet_id = it['id']
                if tweet_id == last_ids.get(username):
                    break
                
                text = f"{it['title']} {it['description']}"
                clean_text = normalize_text(text)
                pub_date = parse_published_date(it['published'], it.get('published_parsed'))
                
                new_items.append({
                    'account': username,
                    'display': display,
                    'category': category,
                    'id': tweet_id,
                    'text': clean_text,
                    'link': it['link'],
                    'date': pub_date,
                    'raw_title': it['title'],
                    'raw_description': it['description'],
                    'author': it.get('author', ''),
                })
            
            if new_items:
                last_ids[username] = new_items[-1]['id']
                raw_tweets.extend(new_items)
                stats["per_source"][username] = len(new_items)
                print(f"  Found {len(new_items)} new tweets", file=sys.stderr)
            else:
                print(f"  No new tweets", file=sys.stderr)
                stats["per_source"][username] = 0
        
        # Update state
        state['accounts'] = last_ids
    
    # Update global state
    state['last_run'] = datetime.now(timezone.utc).isoformat()
    save_json(STATE_FILE, state)
    
    # Save raw data
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
    data_path = os.path.join(DATA_DIR, f"tweets-raw-{timestamp}.json")
    output = {
        'timestamp': timestamp,
        'fetched_at': datetime.now(timezone.utc).isoformat(),
        'config': {
            'nitter_base_url': nitter_base,
            'include_retweets': include_retweets,
            'using_searches': using_searches
        },
        'tweets': raw_tweets,
        'stats': stats
    }
    
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    # Print summary for OpenClaw agent
    stats["total_fetched"] = len(raw_tweets)
    print(f"\n📊 Twitter Fetch Summary:")
    print(f"Total new tweets: {len(raw_tweets)}")
    if using_searches:
        print(f"Search queries: {len(searches)}")
    else:
        print(f"Accounts: {len(accounts)}")
    if stats["errors"]:
        print(f"Errors: {len(stats['errors'])}")
        for err in stats["errors"]:
            print(f"  - {err}")
    
    # Output JSON path for downstream skill
    print(f"\nRAW_DATA_PATH={data_path}")
    print(f"CHECKPOINT_UPDATED=true")
    
    if len(raw_tweets) == 0:
        print("No new tweets to process.")
        sys.exit(0)

if __name__ == "__main__":
    main()