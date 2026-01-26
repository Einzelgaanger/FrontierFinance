# Old Website Content

This directory contains extracted content, assets, and information from the old website.

## Directory Structure

```
old-website-content/
├── html/              # HTML files from old website
├── images/            # Downloaded images
├── css/               # CSS stylesheets
├── js/                # JavaScript files (if any)
├── fonts/             # Font files (if any)
├── content/           # Extracted text content (JSON)
├── screenshots/       # Full-page screenshots
└── extraction_summary.json  # Summary of extracted content
```

## How to Use

1. **Extract content** using the extraction script:
   ```bash
   python scripts/utilities/extract_old_website.py <old-website-url>
   ```

2. **Or manually save**:
   - Use browser to save complete web pages
   - Take screenshots of each page
   - Copy text content and paste into files

3. **Organize by page**:
   - Create subdirectories for each major page
   - Keep related assets together

## Content Checklist

- [ ] Homepage content
- [ ] About page
- [ ] Services/Products pages
- [ ] Contact information
- [ ] Navigation structure
- [ ] Footer content
- [ ] Logo and branding assets
- [ ] Color palette
- [ ] Typography information
- [ ] Images and graphics

## Notes

- Keep original file names when possible
- Document any important design decisions
- Note what worked well in the old design
- Identify what needs improvement
