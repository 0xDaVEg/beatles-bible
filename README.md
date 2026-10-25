# Beatles Bible Archive

A mobile-friendly static SPA copy of selected sections from [The Beatles Bible](https://www.beatlesbible.com/) - History, Songs, Albums, and People. Designed to be hosted on GitHub Pages and added as a shortcut to your phone.

## Features
- Browse History (day-by-day), Songs (A-Z), Albums, and People
- Mobile-responsive design
- PWA support - can be added to home screen
- Links to original content on Beatles Bible
- Images loaded from original URLs

## Structure
- `scraper/` - Node.js scripts to discover and scrape content
- `web/` - React + Vite SPA
- `src/data/` - Scraped JSON data
- `.github/workflows/` - GitHub Pages deployment

## Setup

### 1. Scrape the data
```bash
cd scraper
npm install
npm run discover  # Find all URLs
npm run scrape    # Scrape all pages (takes a while, ~4s per page)
npm run normalize # Process and output to web/src/data
```

### 2. Run locally
```bash
cd web
npm install
npm run dev
```

### 3. Deploy to GitHub Pages
Push to `main` branch - GitHub Actions will build and deploy automatically.

## Notes
- Respects rate limiting (4s between requests)
- Images are linked from original URLs (not downloaded)
- Uses hash routing for GitHub Pages compatibility
