# Quick Content Extraction Guide (No Coding Required)

## Method 1: Browser Save (Easiest - Recommended)

### Step 1: Open Your Old Website
1. Navigate to your old website in your browser
2. Go through each page you want to extract

### Step 2: Save Each Page
1. Press **Ctrl+S** (or Cmd+S on Mac)
2. Choose **"Webpage, Complete"** option
3. Save to: `old-website-content/html/`
4. Name files descriptively:
   - `homepage.html`
   - `about.html`
   - `services.html`
   - `contact.html`
   - etc.

### Step 3: Extract Images
1. Right-click on each image
2. Select **"Save image as..."**
3. Save to: `old-website-content/images/`
4. Keep original filenames when possible

### Step 4: Take Screenshots
1. Use browser extension: **"Full Page Screen Capture"** (Chrome/Firefox)
2. Or use: **Windows Snipping Tool** → Full screen
3. Save screenshots to: `old-website-content/screenshots/`

## Method 2: Copy & Paste Content

### Step 1: Extract Text Content
1. Open each page of the old website
2. Copy all text content
3. Paste into the template: `old-website-content/CONTENT_TEMPLATE.md`
4. Fill in all sections

### Step 2: Document Design
1. Note colors (use browser color picker extension)
2. Note fonts (check in browser DevTools)
3. Take screenshots of key design elements

## Method 3: Browser Developer Tools

### Step 1: Open DevTools
1. Press **F12** or **Right-click → Inspect**
2. Go to **"Elements"** tab

### Step 2: Extract HTML
1. Right-click on `<html>` tag
2. Select **"Copy" → "Copy element"**
3. Paste into a text file in `old-website-content/html/`

### Step 3: Extract CSS
1. Go to **"Sources"** tab
2. Find CSS files in the left panel
3. Click on each CSS file
4. Copy all content
5. Save to `old-website-content/css/`

### Step 4: Find Colors
1. In DevTools, select any element
2. Look at the **"Styles"** panel
3. Note all color values (hex codes, rgb, etc.)
4. Document in `old-website-content/CONTENT_TEMPLATE.md`

## Method 4: Use Browser Extensions

### Recommended Extensions:

1. **SingleFile** (Chrome/Firefox)
   - Saves entire page as single HTML file
   - Includes all CSS and images inline
   - Perfect for archiving

2. **Web Scraper** (Chrome)
   - Extracts structured data
   - Good for extracting lists, tables, etc.

3. **ColorZilla** (Chrome/Firefox)
   - Color picker tool
   - Helps identify exact colors

4. **WhatFont** (Chrome)
   - Identifies fonts on the page
   - Shows font family, size, weight

## What to Extract - Checklist

### Content
- [ ] All page text (headlines, paragraphs, buttons)
- [ ] Navigation menu items
- [ ] Footer content
- [ ] Contact information
- [ ] Social media links
- [ ] Meta descriptions

### Images
- [ ] Logo (all variations)
- [ ] Hero images
- [ ] Product/service images
- [ ] Team photos
- [ ] Icons
- [ ] Background images
- [ ] Favicon

### Design
- [ ] Color palette (primary, secondary, accent)
- [ ] Typography (fonts, sizes)
- [ ] Button styles
- [ ] Card/component styles
- [ ] Spacing and layout

### Structure
- [ ] Site map (all pages)
- [ ] Navigation structure
- [ ] URL structure
- [ ] Form fields and labels

## Quick Start (5 Minutes)

1. **Open old website** in browser
2. **Press Ctrl+S** on homepage → Save as "homepage.html" to `old-website-content/html/`
3. **Right-click logo** → Save image to `old-website-content/images/`
4. **Take screenshot** of homepage → Save to `old-website-content/screenshots/`
5. **Repeat for other important pages**

## Next Steps

Once you have the content:
1. Review extracted files in `old-website-content/`
2. Fill out `CONTENT_TEMPLATE.md` with key information
3. Share the content with the development team
4. Use it as reference during redesign

## Need Help?

- See detailed guide: `OLD_WEBSITE_EXTRACTION_GUIDE.md`
- Use automated script: `scripts/utilities/extract_old_website.py` (requires Python)
