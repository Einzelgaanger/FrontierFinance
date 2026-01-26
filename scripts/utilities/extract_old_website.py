"""
Old Website Content Extraction Tool

This script helps extract content, images, and styling from an old website
for use in redesigning the new website.

Usage:
    python extract_old_website.py <url> [options]

Example:
    python extract_old_website.py https://oldwebsite.com
    python extract_old_website.py https://oldwebsite.com --output ./old-website-content
"""

import requests
from bs4 import BeautifulSoup
import os
import json
from urllib.parse import urljoin, urlparse
import argparse
from pathlib import Path
import re

class WebsiteExtractor:
    def __init__(self, base_url, output_dir="old-website-content"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.visited_urls = set()
        self.extracted_content = {
            "text_content": {},
            "images": [],
            "css": [],
            "colors": [],
            "fonts": [],
            "structure": {}
        }
        
        # Create output directories
        self.setup_directories()
    
    def setup_directories(self):
        """Create organized directory structure"""
        dirs = [
            "html",
            "images",
            "css",
            "js",
            "fonts",
            "content",
            "screenshots"
        ]
        for dir_name in dirs:
            (self.output_dir / dir_name).mkdir(parents=True, exist_ok=True)
    
    def extract_page(self, url):
        """Extract content from a single page"""
        if url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        print(f"Extracting: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract text content
            self.extract_text_content(soup, url)
            
            # Extract images
            self.extract_images(soup, url)
            
            # Extract CSS
            self.extract_css(soup, url)
            
            # Extract colors
            self.extract_colors(soup)
            
            # Extract fonts
            self.extract_fonts(soup)
            
            # Save HTML
            self.save_html(soup, url)
            
            # Extract structure
            self.extract_structure(soup, url)
            
        except Exception as e:
            print(f"Error extracting {url}: {e}")
    
    def extract_text_content(self, soup, url):
        """Extract all text content from the page"""
        content = {
            "url": url,
            "title": soup.title.string if soup.title else "",
            "headings": {
                "h1": [h.get_text(strip=True) for h in soup.find_all('h1')],
                "h2": [h.get_text(strip=True) for h in soup.find_all('h2')],
                "h3": [h.get_text(strip=True) for h in soup.find_all('h3')],
            },
            "paragraphs": [p.get_text(strip=True) for p in soup.find_all('p')],
            "links": [{"text": a.get_text(strip=True), "href": a.get('href', '')} 
                     for a in soup.find_all('a', href=True)],
            "buttons": [btn.get_text(strip=True) for btn in soup.find_all(['button', 'input', type='submit'])],
            "navigation": self.extract_navigation(soup),
            "footer": self.extract_footer(soup)
        }
        
        # Save to file
        page_name = urlparse(url).path.replace('/', '_') or 'index'
        content_file = self.output_dir / "content" / f"{page_name}_content.json"
        with open(content_file, 'w', encoding='utf-8') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        
        self.extracted_content["text_content"][url] = content
    
    def extract_navigation(self, soup):
        """Extract navigation menu structure"""
        nav = []
        nav_elements = soup.find_all(['nav', 'ul', 'ol'], class_=re.compile(r'nav|menu', re.I))
        
        for nav_elem in nav_elements[:3]:  # Get first 3 nav elements
            items = []
            for link in nav_elem.find_all('a', href=True):
                items.append({
                    "text": link.get_text(strip=True),
                    "href": link.get('href', '')
                })
            if items:
                nav.append(items)
        
        return nav
    
    def extract_footer(self, soup):
        """Extract footer content"""
        footer = soup.find('footer')
        if footer:
            return {
                "text": footer.get_text(strip=True),
                "links": [{"text": a.get_text(strip=True), "href": a.get('href', '')} 
                         for a in footer.find_all('a', href=True)]
            }
        return {}
    
    def extract_images(self, soup, base_url):
        """Extract and download images"""
        images = soup.find_all('img', src=True)
        
        for img in images:
            img_url = urljoin(base_url, img.get('src', ''))
            img_alt = img.get('alt', '')
            img_src = img.get('src', '')
            
            try:
                # Download image
                img_response = requests.get(img_url, timeout=10, stream=True)
                if img_response.status_code == 200:
                    # Get filename
                    parsed_url = urlparse(img_url)
                    filename = os.path.basename(parsed_url.path) or 'image.jpg'
                    
                    # Save image
                    img_path = self.output_dir / "images" / filename
                    with open(img_path, 'wb') as f:
                        for chunk in img_response.iter_content(1024):
                            f.write(chunk)
                    
                    self.extracted_content["images"].append({
                        "url": img_url,
                        "alt": img_alt,
                        "local_path": str(img_path),
                        "src": img_src
                    })
            except Exception as e:
                print(f"  Could not download image {img_url}: {e}")
    
    def extract_css(self, soup, base_url):
        """Extract CSS files and inline styles"""
        # External CSS files
        css_links = soup.find_all('link', rel='stylesheet', href=True)
        for link in css_links:
            css_url = urljoin(base_url, link.get('href', ''))
            try:
                css_response = requests.get(css_url, timeout=10)
                if css_response.status_code == 200:
                    filename = os.path.basename(urlparse(css_url).path) or 'style.css'
                    css_path = self.output_dir / "css" / filename
                    with open(css_path, 'w', encoding='utf-8') as f:
                        f.write(css_response.text)
                    
                    self.extracted_content["css"].append({
                        "url": css_url,
                        "local_path": str(css_path)
                    })
            except Exception as e:
                print(f"  Could not download CSS {css_url}: {e}")
        
        # Inline styles
        inline_styles = soup.find_all('style')
        for i, style in enumerate(inline_styles):
            css_path = self.output_dir / "css" / f"inline_{i}.css"
            with open(css_path, 'w', encoding='utf-8') as f:
                f.write(style.string or '')
    
    def extract_colors(self, soup):
        """Extract color information from CSS and inline styles"""
        # This is a basic extraction - you may want to enhance this
        color_pattern = re.compile(r'#([0-9a-fA-F]{3,6})|rgb\([^)]+\)|rgba\([^)]+\)')
        
        # Extract from inline styles
        for style in soup.find_all(style=True):
            colors = color_pattern.findall(str(style.get('style', '')))
            self.extracted_content["colors"].extend(colors)
        
        # Extract from style tags
        for style_tag in soup.find_all('style'):
            colors = color_pattern.findall(style_tag.string or '')
            self.extracted_content["colors"].extend(colors)
    
    def extract_fonts(self, soup):
        """Extract font information"""
        # Extract font-family from inline styles and style tags
        font_pattern = re.compile(r'font-family:\s*([^;]+)', re.I)
        
        for style in soup.find_all(style=True):
            fonts = font_pattern.findall(str(style.get('style', '')))
            self.extracted_content["fonts"].extend(fonts)
        
        for style_tag in soup.find_all('style'):
            fonts = font_pattern.findall(style_tag.string or '')
            self.extracted_content["fonts"].extend(fonts)
    
    def save_html(self, soup, url):
        """Save the HTML content"""
        page_name = urlparse(url).path.replace('/', '_') or 'index'
        html_file = self.output_dir / "html" / f"{page_name}.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
    
    def extract_structure(self, soup, url):
        """Extract page structure and layout information"""
        structure = {
            "url": url,
            "sections": [],
            "main_content": [],
            "sidebars": [],
            "forms": []
        }
        
        # Extract main sections
        for section in soup.find_all(['section', 'div'], class_=True):
            section_info = {
                "tag": section.name,
                "classes": section.get('class', []),
                "id": section.get('id', ''),
                "text_preview": section.get_text(strip=True)[:100]
            }
            structure["sections"].append(section_info)
        
        # Extract forms
        for form in soup.find_all('form'):
            form_info = {
                "action": form.get('action', ''),
                "method": form.get('method', ''),
                "fields": []
            }
            for input_field in form.find_all(['input', 'textarea', 'select']):
                form_info["fields"].append({
                    "type": input_field.get('type', input_field.name),
                    "name": input_field.get('name', ''),
                    "placeholder": input_field.get('placeholder', ''),
                    "label": input_field.find_previous(['label'])
                })
            structure["forms"].append(form_info)
        
        self.extracted_content["structure"][url] = structure
    
    def save_summary(self):
        """Save a summary of all extracted content"""
        summary = {
            "base_url": self.base_url,
            "pages_extracted": len(self.visited_urls),
            "total_images": len(self.extracted_content["images"]),
            "total_css_files": len(self.extracted_content["css"]),
            "unique_colors": list(set(self.extracted_content["colors"])),
            "unique_fonts": list(set(self.extracted_content["fonts"])),
            "pages": list(self.visited_urls)
        }
        
        summary_file = self.output_dir / "extraction_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Extraction complete!")
        print(f"📁 Output directory: {self.output_dir}")
        print(f"📄 Pages extracted: {summary['pages_extracted']}")
        print(f"🖼️  Images downloaded: {summary['total_images']}")
        print(f"🎨 CSS files: {summary['total_css_files']}")
        print(f"📊 Summary saved to: {summary_file}")


def main():
    parser = argparse.ArgumentParser(description='Extract content from old website')
    parser.add_argument('url', help='URL of the old website')
    parser.add_argument('--output', '-o', default='old-website-content',
                       help='Output directory (default: old-website-content)')
    parser.add_argument('--pages', '-p', type=int, default=1,
                       help='Number of pages to extract (default: 1, homepage only)')
    
    args = parser.parse_args()
    
    print(f"🌐 Starting extraction from: {args.url}")
    print(f"📂 Output directory: {args.output}\n")
    
    extractor = WebsiteExtractor(args.url, args.output)
    extractor.extract_page(args.url)
    
    # If multiple pages, you can add logic here to follow links
    # For now, just extract the homepage
    
    extractor.save_summary()


if __name__ == "__main__":
    main()
