# Frontier Finance Link Scraper & Injector

Extract text and links from the original [frontierfinance.org](https://www.frontierfinance.org) site, then (optionally) inject them into static HTML. For this React app, the scraped mapping is used in code (e.g. Learning Hub market insights) rather than via the injector.

## Setup

```bash
pip install -r scripts/requirements-scraper.txt
```

## Step 1 — Scrape the original site

```bash
python scripts/scraper.py
```

Crawls the Learning Lab and blog URLs and writes **`scripts/links.json`**: every link and button text found on those pages.

## Step 2 — Inject links into static HTML (optional)

If you have a **static HTML** duplicate (not this React app):

```bash
python scripts/inject_links.py --input duplicate.html --output updated_duplicate.html
```

| Argument   | Default           | Description                    |
|-----------|-------------------|--------------------------------|
| `--input` | `duplicate.html`  | Duplicate site HTML file       |
| `--output`| `updated_duplicate.html` | Patched output file   |
| `--links` | `scripts/links.json` | JSON from Step 1           |

The script matches buttons and empty `<a>` tags by visible text and sets/wraps the correct `href`.

## Using the data in this React app

This repo is a React (Vite) app. Links are wired in components (e.g. `src/pages/LearningHub.tsx` for Market Insights) using the same URLs you’d get from the scraper. To refresh from the live site:

1. Run `python scripts/scraper.py` to regenerate `scripts/links.json`.
2. Update the relevant React data (e.g. `marketInsights` in `LearningHub.tsx`) to match the new text/link pairs if needed.

## If the site is heavily JavaScript-rendered

If `requests` doesn’t see dynamic content, use Playwright:

```bash
pip install playwright
playwright install chromium
```

Then in `scraper.py`, replace the `requests.get` block with:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(url)
    page.wait_for_load_state("networkidle")
    html = page.content()
    browser.close()
soup = BeautifulSoup(html, "html.parser")
```

## Output: `links.json` structure

```json
[
  {
    "source_page": "https://www.frontierfinance.org/learning-lab",
    "text": "Empowering Emerging Fund Managers in Underserved Markets",
    "link": "https://www.frontierfinance.org/blog/2023/12/20/empowering-emerging-fund-managers-in-underserved-markets",
    "element": "a"
  }
]
```
