# Old Website Content Extraction Guide

This guide will help you extract all content, assets, and information from your old website to use in the redesign.

## Methods to Extract Content

### Method 1: Browser Developer Tools (Easiest)

1. **Open the old website** in your browser
2. **Right-click** → **Inspect** (or press F12)
3. **View Page Source**: Right-click → "View Page Source" or Ctrl+U
4. **Save the HTML**: Copy all HTML content and save it
5. **Extract CSS**: In DevTools, go to "Sources" tab → find CSS files → copy content
6. **Extract Images**: Right-click images → "Save image as..." or use Network tab to find all image URLs

### Method 2: Save Complete Web Page

1. Open the old website
2. **Ctrl+S** (Save Page)
3. Choose "Webpage, Complete" - this saves HTML, CSS, and images in a folder
4. The folder will contain:
   - `index.html` - main HTML file
   - `_files/` folder - contains all CSS, JS, images, etc.

### Method 3: Use Web Scraping Tools

#### Option A: Browser Extension
- **SingleFile** (Chrome/Firefox) - Saves entire page as single HTML file
- **Web Scraper** (Chrome) - Extracts structured data
- **Save Page WE** (Firefox) - Saves complete pages

#### Option B: Command Line Tools
- **wget** or **curl** - Download entire website
- **httrack** - Website copier tool

### Method 4: Screenshot Everything
- Take full-page screenshots of each page
- Use browser extensions like "Full Page Screen Capture"
- Document the layout and design visually

## What to Extract

### 1. **Text Content**
- [ ] Headlines and titles
- [ ] Body text and descriptions
- [ ] Navigation menu items
- [ ] Footer content
- [ ] Button labels
- [ ] Form labels and placeholders
- [ ] Error messages
- [ ] Meta descriptions and SEO content

### 2. **Images & Media**
- [ ] Logo files (SVG, PNG, JPG)
- [ ] Hero images
- [ ] Product/service images
- [ ] Team photos
- [ ] Icons
- [ ] Background images
- [ ] Favicon

### 3. **Styling & Design**
- [ ] Color palette (hex codes)
- [ ] Typography (fonts, sizes)
- [ ] Spacing and layout
- [ ] Button styles
- [ ] Card/component styles
- [ ] Responsive breakpoints

### 4. **Structure & Navigation**
- [ ] Site map (all pages)
- [ ] Navigation structure
- [ ] Page hierarchy
- [ ] URL structure
- [ ] Internal links

### 5. **Functionality**
- [ ] Forms and fields
- [ ] Interactive elements
- [ ] User flows
- [ ] Features and capabilities

## Extraction Checklist

### Homepage
- [ ] Hero section text and images
- [ ] Value propositions
- [ ] Call-to-action buttons
- [ ] Featured content
- [ ] Testimonials
- [ ] Statistics/numbers
- [ ] Footer content

### About Page
- [ ] Company story/mission
- [ ] Team information
- [ ] Values and principles
- [ ] History/timeline

### Services/Products Pages
- [ ] Service descriptions
- [ ] Features lists
- [ ] Pricing information
- [ ] Benefits

### Contact Page
- [ ] Contact information
- [ ] Office addresses
- [ ] Social media links
- [ ] Contact form fields

### Blog/News
- [ ] Recent posts titles
- [ ] Categories
- [ ] Author information

## Tools Created for You

1. **Content Extraction Script** (`scripts/utilities/extract_old_website.py`)
   - Automated extraction tool
   - Saves content to organized folders

2. **Content Storage Directory** (`old-website-content/`)
   - Organized folders for extracted content
   - Ready for redesign reference

## Next Steps

1. **Identify the old website URL** - Do you have the URL?
2. **Choose extraction method** - Based on your preference
3. **Extract content** - Follow the checklist above
4. **Store in organized folders** - Use the `old-website-content/` directory
5. **Document design decisions** - Note what worked well
6. **Start redesign** - Use extracted content as reference

## Questions to Answer

Before starting extraction, answer these:
- What is the URL of the old website?
- Is it still live/accessible?
- Do you have access to the old codebase?
- What pages/sections are most important?
- Are there any specific features you want to preserve?
