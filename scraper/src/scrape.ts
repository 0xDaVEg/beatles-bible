import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import PQueue from 'p-queue';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://www.beatlesbible.com';

const queue = new PQueue({ concurrency: 1 });
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function urlToFilename(url: string) {
  return Buffer.from(url).toString('base64').replace(/[/+=]/g, '_') + '.json';
}

async function fetchPage(url: string) {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'beatles-bible-archive/1.0 (personal project)',
      'Accept': 'text/html,application/xhtml+xml'
    },
    timeout: 30000
  });
  return res.data;
}

function extractArticle(html: string, url: string) {
  const $ = cheerio.load(html);
  const pathname = new URL(url).pathname;
  
  $('script, style, nav, .nav, .navigation, .sidebar, .widget, .comments, #comments, .comment-respond, footer, .footer, .advert, .ads, header, .site-header').remove();
  
  const title = $('h1.entry-title, h1').first().text().trim() || $('title').text().replace('| The Beatles Bible', '').trim();
  
  let contentEl = $('.entry-content, .post-content, article .content, main article').first();
  if (contentEl.length === 0) {
    contentEl = $('article').first();
  }
  
  const images: string[] = [];
  contentEl.find('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('srcset');
    if (src && !src.startsWith('data:')) {
      // handle srcset
      const firstSrc = src.includes(',') ? src.split(',')[0].trim().split(' ')[0] : src;
      try {
        const imgUrl = new URL(firstSrc, BASE).href;
        if (!images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      } catch {}
    }
  });
  
  const content = contentEl.html() || '';
  const textContent = contentEl.text().trim();
  
  let type: 'history' | 'song' | 'album' | 'people' | 'other' = 'other';
  if (/^\/\d{4}\/\d{2}\/\d{2}\//.test(pathname)) type = 'history';
  else if (pathname.startsWith('/songs/')) type = 'song';
  else if (pathname.startsWith('/albums/')) type = 'album';
  else if (pathname.startsWith('/people/')) type = 'people';
  
  let date = null;
  const dateMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (dateMatch) {
    date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }
  
  return {
    url,
    type,
    slug: pathname.split('/').filter(Boolean).pop() || '',
    title,
    date,
    content,
    textContent: textContent.substring(0, 8000),
    images,
    scrapedAt: new Date().toISOString()
  };
}

async function main() {
  const dataDir = path.join(__dirname, '../data');
  const urlsPath = path.join(dataDir, 'urls.json');
  const urlsData = await fs.readJson(urlsPath);
  
  const rawDir = path.join(dataDir, 'raw');
  await fs.ensureDir(rawDir);
  
  // Get already scraped
  const existingFiles = await fs.readdir(rawDir);
  const existing = new Set(existingFiles.filter(f => f.endsWith('.json')));
  
  const allUrls = [
    ...urlsData.history,
    ...urlsData.songs,
    ...urlsData.albums,
    ...urlsData.people
  ];
  
  const toScrape = allUrls.filter((url: string) => {
    const fname = urlToFilename(url);
    return !existing.has(fname);
  });
  
  console.log(`Total URLs: ${allUrls.length}, Already scraped: ${existing.size}, To scrape: ${toScrape.length}`);
  
  if (toScrape.length === 0) {
    console.log('Nothing to scrape!');
    return;
  }
  
  let completed = 0;
  const tasks = toScrape.map((url: string) => 
    queue.add(async () => {
      try {
        const html = await fetchPage(url);
        const article = extractArticle(html, url);
        const filename = urlToFilename(url);
        await fs.writeJson(path.join(rawDir, filename), article, { spaces: 2 });
        completed++;
        if (completed % 25 === 0) {
          console.log(`Progress: ${completed}/${toScrape.length} (${Math.round(completed/toScrape.length*100)}%)`);
        }
        await delay(4000);
      } catch (e: any) {
        console.error(`Failed to scrape ${url}:`, e.message);
      }
    })
  );
  
  await Promise.all(tasks);
  console.log(`Scraping complete: ${completed}/${toScrape.length}`);
}

main().catch(console.error);
