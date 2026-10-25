import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

const rawDir = '/Users/davidgeorge/emdash/repositories/beatles-bible/scraper/data/raw';

// Find all pagination pages needed
function findPaginationUrls() {
  const urls = new Set();
  const files = fs.readdirSync(rawDir);
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const data = fs.readJsonSync(path.join(rawDir, file));
      const content = data.content || '';
      // Match pagination links
      const matches = content.matchAll(/href="https:\/\/www\.beatlesbible\.com\/([^"]+)\/(\d+)\/?"/g);
      for (const match of matches) {
        const pageNum = parseInt(match[2]);
        if (pageNum > 1) {
          urls.add(`https://www.beatlesbible.com/${match[1]}/${match[2]}/`);
        }
      }
    } catch (e) {}
  }
  return Array.from(urls);
}

async function scrape() {
  const urls = findPaginationUrls();
  console.log(`Found ${urls.length} pages to scrape`);
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      console.log(`[${i+1}/${urls.length}] Scraping ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      const data = await page.evaluate(() => {
        const article = document.querySelector('.entry-content') || document.querySelector('article') || document.querySelector('.post');
        let content = article ? article.innerHTML : '';
        // Remove scripts, comments, ads
        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        content = content.replace(/<!--[\s\S]*?-->/g, '');
        return content;
      });
      
      if (data) {
        const key = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const filename = `${key}.json`;
        const filepath = path.join(rawDir, filename);
        
        const articleData = {
          url: url,
          title: url.split('/').filter(Boolean).pop(),
          slug: url.split('/').filter(Boolean).slice(-2, -1)[0] + '-' + url.split('/').filter(Boolean).pop(),
          type: 'page',
          content: data,
          scrapedAt: new Date().toISOString()
        };
        
        await fs.writeJson(filepath, articleData, { spaces: 2 });
      }
    } catch (e) {
      console.error(`Error scraping ${url}:`, e.message);
    }
  }
  
  await browser.close();
  console.log('Done');
}

scrape();
