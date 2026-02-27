"""
Step 2: Inject links from links.json into duplicate HTML.
Matches buttons/links by text and wraps or sets the correct href.

Usage:
  python scripts/inject_links.py --input duplicate.html --output updated_duplicate.html
"""

import argparse
import json
import os
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(description="Inject links into duplicate HTML")
parser.add_argument("--input", default="duplicate.html", help="Duplicate HTML file")
parser.add_argument("--output", default="updated_duplicate.html", help="Output HTML file")
parser.add_argument("--links", default=None, help="Path to links.json")
args = parser.parse_args()

script_dir = os.path.dirname(os.path.abspath(__file__))
links_path = args.links or os.path.join(script_dir, "links.json")

with open(links_path, "r", encoding="utf-8") as f:
    link_data = json.load(f)

text_to_link = {item["text"].lower().strip(): item["link"] for item in link_data}

with open(args.input, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

injected = 0
skipped = 0

for button in soup.find_all("button"):
    text = button.get_text(strip=True).lower()
    link = text_to_link.get(text)
    if link:
        if button.parent and button.parent.name == "a":
            skipped += 1
            continue
        new_a = soup.new_tag("a", href=link)
        button.wrap(new_a)
        injected += 1
        print("  Button wrapped:", text[:50], "->", link[:50])
    else:
        print("  No match for button:", text[:50])

for a in soup.find_all("a"):
    if a.get("href"):
        continue
    text = a.get_text(strip=True).lower()
    link = text_to_link.get(text)
    if link:
        a["href"] = link
        injected += 1
        print("  a href added:", text[:50], "->", link[:50])

with open(args.output, "w", encoding="utf-8") as f:
    f.write(str(soup.prettify()))

print("\nDone. Injected:", injected, "Skipped:", skipped, "Output:", args.output)
