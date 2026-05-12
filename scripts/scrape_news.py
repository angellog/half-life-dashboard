import json
import os
from datetime import datetime
from scrapling.fetchers import Fetcher

# ============================================================
# Multi-Source News Scraper using Scrapling
# Targets: Hypebeast, Sneaker News, Highsnobiety, Complex
# ============================================================

SOURCES = [
    {
        "name": "Hypebeast",
        "url": "https://hypebeast.com/sneakers/",
        "topic": "sneaker-releases"
    },
    {
        "name": "Sneaker News",
        "url": "https://sneakernews.com/",
        "topic": "sneaker-releases"
    },
    {
        "name": "Highsnobiety",
        "url": "https://www.highsnobiety.com/sneakers/",
        "topic": "streetwear"
    },
    {
        "name": "Complex",
        "url": "https://www.complex.com/sneakers/",
        "topic": "industry"
    }
]

DATA_PATH = os.path.join(os.path.dirname(__file__), "../src/lib/data/scraped_news.json")

def scrape_source(source):
    print(f"[*] Scraping {source['name']}...")
    try:
        fetcher = Fetcher()
        page = fetcher.get(source['url'])
        
        articles = []
        # Bruteforce headlines: look for all links that contain sneaker keywords or look like articles
        links = page.css('a')
        
        for link_el in links:
            title = link_el.css('::text').get()
            url = link_el.attrib.get('href')
            
            if not title or len(title.strip()) < 15:
                continue
            if not url or url.startswith('#') or 'author' in url or 'category' in url:
                continue
            
            # Simple heuristic for article links (long-ish paths)
            if len(url.split('/')) < 4 and not url.startswith('http'):
                continue
                
            if url.startswith('/'):
                from urllib.parse import urljoin
                url = urljoin(source['url'], url)
            
            if any(a['url'] == url for a in articles):
                continue

            articles.append({
                "id": f"scraped-{abs(hash(url))}",
                "headline": title.strip(),
                "source": source['name'],
                "publishDate": datetime.now().strftime("%Y-%m-%d"),
                "summary": "Latest news update from " + source['name'],
                "url": url,
                "topic": source['topic'],
                "isLive": True
            })
            
            if len(articles) >= 10:
                break
                
        print(f"[+] Found {len(articles)} articles from {source['name']}")
        return articles
    except Exception as e:
        print(f"[!] Error scraping {source['name']}: {str(e)}")
        return []

def main():
    all_articles = []
    
    for source in SOURCES:
        res = scrape_source(source)
        all_articles.extend(res)
        
    # Save to JSON
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, 'w') as f:
        json.dump(all_articles, f, indent=2)
        
    print(f"\n[DONE] Total {len(all_articles)} articles saved to {DATA_PATH}")

if __name__ == "__main__":
    main()
