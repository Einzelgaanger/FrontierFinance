"""
Step 1: Scrape Frontier Finance pages — extracts all text + links.
Outputs: links.json

Usage:
    pip install requests beautifulsoup4
    python scripts/scraper.py
"""

import json
import os
import requests
from bs4 import BeautifulSoup

URLS = [
    "https://www.frontierfinance.org/learning-lab",
    "https://www.frontierfinance.org/blog/2023/12/20/empowering-emerging-fund-managers-in-underserved-markets",
    "https://www.frontierfinance.org/blog/2023/12/4/funds-of-funds-provide-more-than-capital-for-local-investors-in-small-and-growing-businesses",
    "https://www.frontierfinance.org/blog/2023/12/20/tapping-the-creativity-of-local-fund-managers-to-scale-small-business-finance",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; research-bot/1.0)"
}

BASE_URL = "https://www.frontierfinance.org"

data = []

for url in URLS:
    print(f"Scraping: {url}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"  ERROR: {e}")
        continue

    soup = BeautifulSoup(response.text, "html.parser")

    # --- Extract all <a> tags with href ---
    for a in soup.find_all("a", href=True):
        text = a.get_text(strip=True)
        href = a["href"]

        # Make relative URLs absolute
        if href.startswith("/"):
            href = BASE_URL + href

        # Skip empty text, anchors, mailto, javascript
        if not text or href.startswith(("mailto:", "javascript:", "#")):
            continue

        data.append({
            "source_page": url,
            "text": text,
            "link": href,
            "element": "a"
        })

    # --- Extract buttons with onclick ---
    for button in soup.find_all("button"):
        text = button.get_text(strip=True)
        onclick = button.get("onclick", "")
        if onclick and ("http" in onclick or "/" in onclick):
            parts = onclick.split("'")
            link = parts[1] if len(parts) > 1 else onclick
            if link.startswith("/"):
                link = BASE_URL + link
            if text:
                data.append({
                    "source_page": url,
                    "text": text,
                    "link": link,
                    "element": "button"
                })

    print(f"  Found {len(data)} items so far.")

# Deduplicate by (text, link)
seen = set()
unique_data = []
for item in data:
    key = (item["text"], item["link"])
    if key not in seen:
        seen.add(key)
        unique_data.append(item)

script_dir = os.path.dirname(os.path.abspath(__file__))
out_path = os.path.join(script_dir, "links.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(unique_data, f, indent=4, ensure_ascii=False)

print(f"\nDone! Saved {len(unique_data)} unique links to {out_path}")
