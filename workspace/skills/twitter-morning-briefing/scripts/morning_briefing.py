#!/usr/bin/env python3
"""
Twitter/X Morning Briefing Pipeline.
Fetches tweets from configured accounts, scores by relevance, selects top per category,
generates Obsidian markdown and Telegram summary.
"""

import json
import os
import sys
import re
import html
import urllib.parse
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Tuple

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
BRIEFINGS_DIR = os.path.join(SKILL_DIR, "briefings")
CHECKPOINTS_DIR = os.path.join(SKILL_DIR, "checkpoints")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(BRIEFINGS_DIR, exist_ok=True)
os.makedirs(CHECKPOINTS_DIR, exist_ok=True)

CONFIG_ACCOUNTS = os.path.join(CONFIG_DIR, "accounts.json")
CONFIG_KEYWORDS = os.path.join(CONFIG_DIR, "keywords.json")
STATE_FILE = os.path.join(CHECKPOINTS_DIR, "last-briefing.json")
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
    import urllib.request
    import xml.etree.ElementTree as ET
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
    match = re.search(r'@([a-zA-Z0-9_]+)', author)
    if match:
        return match.group(1)
    return author

def is_reply(text: str) -> bool:
    """Check if tweet is a reply (starts with @)."""
    return text.strip().startswith('@')

def is_promotional(text: str) -> bool:
    """Heuristic to detect promotional tweets."""
    promo_keywords = ["check out", "buy now", "limited time", "discount", "sale", "promo", "offer", "deal", "subscribe", "sign up", "join now", "free trial"]
    text_lower = text.lower()
    for kw in promo_keywords:
        if kw in text_lower:
            return True
    return False

def score_tweet(tweet_text: str, category: str, interests: Dict, scoring_rules: Dict) -> int:
    """Assign a score 1–5 based on multiple factors."""
    text_lower = tweet_text.lower()
    score = 0
    
    # Interest match
    interest_keywords = interests.get(category, [])
    for kw in interest_keywords:
        if kw.lower() in text_lower:
            score += scoring_rules.get("interest_match", 1)
    
    # Strategic impact (mentions keywords like "regulation", "policy", "future", "impact")
    strategic_words = ["regulation", "policy", "strategy", "impact", "future", "trend", "shift", "change", "disruption"]
    for word in strategic_words:
        if word in text_lower:
            score += scoring_rules.get("strategic_impact", 2)
            break
    
    # Concrete data (numbers, dates, stats)
    if re.search(r'\$\d+|\d+%|\d+\.\d+|\d{4}-\d{2}-\d{2}', tweet_text):
        score += scoring_rules.get("concrete_data", 1)
    
    # Educational thread (mentions "thread", "🧵", long text)
    if "thread" in text_lower or "🧵" in tweet_text or len(tweet_text) > 200:
        score += scoring_rules.get("educational_thread", 1)
    
    # Penalties
    if is_promotional(tweet_text):
        score += scoring_rules.get("promotional_penalty", -2)
    
    # Controversy (subjective)
    controversy_words = ["stupid", "idiot", "wrong", "fake", "lie", "scam"]
    for word in controversy_words:
        if word in text_lower:
            score += scoring_rules.get("controversy_penalty", -1)
            break
    
    # Clamp to 1–5
    return max(1, min(5, score))

def categorize_account(username: str, accounts_config: Dict) -> str:
    """Find which category this account belongs to."""
    for category, usernames in accounts_config.items():
        if username in usernames:
            return category
    return "unknown"

def fetch_all_tweets(accounts_config: Dict, max_per_account: int = 100) -> List[Dict]:
    """Fetch tweets from all configured accounts."""
    nitter_base = "https://nitter.net"
    all_tweets = []
    
    # Flatten accounts
    for category, usernames in accounts_config.items():
        for username in usernames:
            print(f"Fetching {username} ({category})...", file=sys.stderr)
            url = f"{nitter_base}/{username}/rss"
            try:
                items = fetch_rss(url)
            except Exception as e:
                print(f"  ERROR: {e}", file=sys.stderr)
                continue
            
            # Limit per account
            items = items[:max_per_account]
            
            for it in items:
                tweet_id = it['id']
                # Normalize text
                text = f"{it['title']} {it['description']}"
                clean_text = normalize_text(text)
                
                # Skip replies if configured
                if is_reply(clean_text):
                    continue
                
                # Parse date
                pub_date = parse_published_date(it['published'], it.get('published_parsed'))
                
                # Extract username
                author = it.get('author', '')
                acc_username = extract_username(author) or username
                
                all_tweets.append({
                    'account': acc_username,
                    'username': username,
                    'category': category,
                    'id': tweet_id,
                    'text': clean_text,
                    'link': it['link'],
                    'date': pub_date,
                    'raw_title': it['title'],
                    'raw_description': it['description'],
                    'author': author,
                })
            
            print(f"  Fetched {len(items)} tweets", file=sys.stderr)
    
    return all_tweets

def select_top_tweets(tweets: List[Dict], selection_rules: Dict, interests: Dict, scoring_rules: Dict) -> Dict[str, List[Dict]]:
    """Select top N tweets per category based on scores."""
    # Score all tweets
    for tweet in tweets:
        tweet['score'] = score_tweet(tweet['text'], tweet['category'], interests, scoring_rules)
    
    # Group by category
    by_category = {}
    for tweet in tweets:
        cat = tweet['category']
        by_category.setdefault(cat, []).append(tweet)
    
    # Sort each category by score descending, then date descending
    for cat in by_category:
        by_category[cat].sort(key=lambda x: (x['score'], x['date']), reverse=True)
    
    # Apply selection limits
    selected = {}
    for cat, limit in selection_rules.items():
        if cat in by_category:
            selected[cat] = by_category[cat][:limit]
        else:
            selected[cat] = []
    
    return selected

def generate_obsidian_markdown(selected: Dict[str, List[Dict]], date_str: str) -> str:
    """Generate full briefing markdown for Obsidian."""
    lines = []
    lines.append(f"# Morning Briefing — {date_str}")
    lines.append("")
    
    # Category headers mapping
    headers = {
        "tech_ai": "🧠 Tech & AI",
        "tech_news": "📰 Tech News",
        "finance_macro": "💰 Finance & Macro",
        "history_ideas": "🏛 Historia & Ideas",
        "uruguay_news": "🇺🇾 Uruguay Radar",
        "uruguay_macro": "🇺🇾 Uruguay Radar",
        "uruguay_politics": "🇺🇾 Uruguay Radar"
    }
    
    # Combine uruguay categories
    uruguay_tweets = []
    for cat in ["uruguay_news", "uruguay_macro", "uruguay_politics"]:
        uruguay_tweets.extend(selected.get(cat, []))
    # Sort uruguay tweets by score
    uruguay_tweets.sort(key=lambda x: x['score'], reverse=True)
    # Limit to total uruguay selection (should be already limited by selection rules)
    
    # Define display order
    display_order = [
        ("tech_ai", "🧠 Tech & AI"),
        ("tech_news", "📰 Tech News"),
        ("finance_macro", "💰 Finance & Macro"),
        ("history_ideas", "🏛 Historia & Ideas"),
    ]
    
    for cat_key, header in display_order:
        tweets = selected.get(cat_key, [])
        if not tweets:
            continue
        lines.append(f"## {header}")
        lines.append("")
        for tweet in tweets:
            # Short title (first ~50 chars)
            title = tweet['text'][:50].replace('\n', ' ') + ("..." if len(tweet['text']) > 50 else "")
            lines.append(f"### {title}")
            lines.append(f"**Account**: {tweet['account']} (@{tweet['username']})")
            lines.append(f"**Score**: {tweet['score']}/5")
            lines.append(f"**Date**: {tweet['date']}")
            lines.append("")
            # Summary (truncated text)
            summary = tweet['text']
            if len(summary) > 300:
                summary = summary[:297] + "..."
            lines.append(summary)
            lines.append("")
            lines.append(f"[🔗 Original tweet]({tweet['link']})")
            lines.append("")
    
    # Uruguay section (combined)
    if uruguay_tweets:
        lines.append("## 🇺🇾 Uruguay Radar")
        lines.append("")
        for tweet in uruguay_tweets[:5]:  # Show top 5 uruguay tweets
            title = tweet['text'][:50].replace('\n', ' ') + ("..." if len(tweet['text']) > 50 else "")
            lines.append(f"### {title}")
            lines.append(f"**Account**: {tweet['account']} (@{tweet['username']})")
            lines.append(f"**Score**: {tweet['score']}/5")
            lines.append(f"**Date**: {tweet['date']}")
            lines.append("")
            summary = tweet['text']
            if len(summary) > 300:
                summary = summary[:297] + "..."
            lines.append(summary)
            lines.append("")
            lines.append(f"[🔗 Original tweet]({tweet['link']})")
            lines.append("")
    
    # Video ideas (placeholder)
    lines.append("## 🎥 Video Ideas")
    lines.append("")
    lines.append("- *Idea 1: TBD*")
    lines.append("- *Idea 2: TBD*")
    lines.append("")
    
    # Quick hits (remaining relevant tweets)
    lines.append("## ⚡ Quick Hits")
    lines.append("")
    all_tweets = []
    for cat in selected:
        all_tweets.extend(selected[cat])
    all_tweets.sort(key=lambda x: x['score'], reverse=True)
    # Skip already shown tweets (first few per category already shown)
    # Simple approach: show next 5 tweets
    quick = all_tweets[15:20] if len(all_tweets) > 15 else []
    for tweet in quick:
        lines.append(f"- {tweet['text'][:100]}... [link]({tweet['link']})")
    lines.append("")
    
    lines.append(f"*Generated {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}*")
    return "\n".join(lines)

def generate_telegram_summary(selected: Dict[str, List[Dict]]) -> str:
    """Generate short summary for Telegram."""
    lines = []
    lines.append("🌅 Morning Briefing")
    lines.append("")
    
    # Collect top 3 highlights across all categories
    all_tweets = []
    for cat in selected:
        all_tweets.extend(selected[cat])
    all_tweets.sort(key=lambda x: x['score'], reverse=True)
    
    top3 = all_tweets[:3]
    if top3:
        lines.append("**Top 3 highlights:**")
        for i, tweet in enumerate(top3, 1):
            snippet = tweet['text'][:80].replace('\n', ' ')
            lines.append(f"{i}. {snippet}...")
        lines.append("")
    
    # Macro insight (top finance/history tweet)
    macro_tweets = []
    for cat in ["finance_macro", "history_ideas"]:
        macro_tweets.extend(selected.get(cat, []))
    macro_tweets.sort(key=lambda x: x['score'], reverse=True)
    if macro_tweets:
        lines.append("**Macro insight:**")
        lines.append(macro_tweets[0]['text'][:120].replace('\n', ' '))
        lines.append("")
    
    # Suggested action (if any high-impact tweet)
    high_impact = [t for t in all_tweets if t['score'] >= 4]
    if high_impact:
        lines.append("**Suggested action:**")
        lines.append("Review linked thread for actionable insights.")
    else:
        lines.append("**Suggested action:**")
        lines.append("No urgent actions identified.")
    
    lines.append("")
    lines.append("Full briefing in Obsidian.")
    return "\n".join(lines)

def write_success_checkpoint(date_str: str, briefing_type: str = "morning"):
    """Write a checkpoint file indicating briefing succeeded."""
    checkpoint_dir = "/home/manpac/.openclaw/workspace/checkpoints"
    os.makedirs(checkpoint_dir, exist_ok=True)
    checkpoint_file = os.path.join(checkpoint_dir, f"briefing-{briefing_type}-success-{date_str}.json")
    data = {
        "success": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "date": date_str,
        "source": "twitter-morning-briefing",
        "type": briefing_type
    }
    try:
        with open(checkpoint_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Checkpoint written: {checkpoint_file}", file=sys.stderr)
    except Exception as e:
        print(f"WARNING: Could not write checkpoint: {e}", file=sys.stderr)

def main():
    # Load configs
    accounts_config = load_json(CONFIG_ACCOUNTS)
    if not accounts_config:
        print("ERROR: Missing config/accounts.json", file=sys.stderr)
        sys.exit(1)
    
    keywords_config = load_json(CONFIG_KEYWORDS)
    if not keywords_config:
        print("ERROR: Missing config/keywords.json", file=sys.stderr)
        sys.exit(1)
    
    interests = keywords_config.get("interests", {})
    scoring_rules = keywords_config.get("scoring", {})
    selection_rules = keywords_config.get("selection", {})
    output_config = keywords_config.get("output", {})
    
    # Fetch tweets
    max_per_account = output_config.get("max_tweets_per_account", 100)
    print("Fetching tweets from configured accounts...", file=sys.stderr)
    all_tweets = fetch_all_tweets(accounts_config, max_per_account)
    
    if not all_tweets:
        print("No tweets fetched.", file=sys.stderr)
        sys.exit(0)
    
    print(f"Fetched {len(all_tweets)} tweets total.", file=sys.stderr)
    
    # Score and select
    selected = select_top_tweets(all_tweets, selection_rules, interests, scoring_rules)
    
    # Generate outputs
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    obsidian_md = generate_obsidian_markdown(selected, today)
    telegram_summary = generate_telegram_summary(selected)
    
    # Save obsidian file
    obsidian_base = output_config.get("obsidian_base_path", "/home/manpac/Obsidian/Daily")
    filename_pattern = output_config.get("filename_pattern", "YYYY-MM-DD-briefing.md")
    filename = filename_pattern.replace("YYYY-MM-DD", today)
    os.makedirs(obsidian_base, exist_ok=True)
    obsidian_path = os.path.join(obsidian_base, filename)
    with open(obsidian_path, 'w', encoding='utf-8') as f:
        f.write(obsidian_md)
    
    # Write success checkpoint
    write_success_checkpoint(today)
    
    # Print summary for OpenClaw agent
    print("\n📋 Morning Briefing Generated:", file=sys.stderr)
    print(f"  Obsidian: {obsidian_path}", file=sys.stderr)
    print(f"  Telegram summary length: {len(telegram_summary)} chars", file=sys.stderr)
    
    # Output telegram summary (to be captured by OpenClaw)
    print("\n" + telegram_summary)
    
    # Update checkpoint (optional)
    state = load_json(STATE_FILE, DEFAULT_STATE)
    state['last_run'] = datetime.now(timezone.utc).isoformat()
    state['accounts'] = {acc: "processed" for acc in accounts_config}
    save_json(STATE_FILE, state)
    
    print(f"\n✅ Morning briefing pipeline completed.", file=sys.stderr)

if __name__ == "__main__":
    main()