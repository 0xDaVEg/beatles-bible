import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://www.beatlesbible.com';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

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

function normalizeUrl(href: string): string | null {
  try {
    const url = new URL(href, BASE);
    if (url.hostname !== 'www.beatlesbible.com') return null;
    url.hash = '';
    // remove tracking params if any
    url.search = '';
    return url.href;
  } catch {
    return null;
  }
}

async function discoverHistory() {
  const urls = new Set<string>();
  // history pagination
  for (let page = 1; page <= 17; page++) {
    const url = page === 1 ? `${BASE}/history/` : `${BASE}/history/${page}/`;
    console.log(`Fetching history page ${page}: ${url}`);
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        const norm = normalizeUrl(href);
        if (!norm) return;
        // history articles are /YYYY/MM/DD/slug/
        if (/\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/.test(new URL(norm).pathname)) {
          urls.add(norm);
        }
      });
      await delay(3000); // be respectful
    } catch (e) {
      console.error(`Error fetching history page ${page}:`, e);
      break;
    }
  }
  return Array.from(urls);
}

async function discoverSongs() {
  const urls = new Set<string>();
  const url = `${BASE}/songs/`;
  console.log(`Fetching songs index: ${url}`);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const norm = normalizeUrl(href);
    if (!norm) return;
    const pathname = new URL(norm).pathname;
    if (pathname.startsWith('/songs/') && pathname !== '/songs/' && 
        !pathname.includes('/feed') && !pathname.includes('comment-page') &&
        !pathname.includes('/listed-by-singer')) {
      // must be /songs/slug/
      if (/^\/songs\/[a-z0-9-]+\/$/.test(pathname)) {
        urls.add(norm);
      }
    }
  });
  return Array.from(urls);
}

async function discoverAlbums() {
  const urls = new Set<string>();
  const url = `${BASE}/albums/`;
  console.log(`Fetching albums index: ${url}`);
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const norm = normalizeUrl(href);
      if (!norm) return;
      const pathname = new URL(norm).pathname;
      if (/^\/albums\/[a-z0-9-]+\/$/.test(pathname) && pathname !== '/albums/') {
        urls.add(norm);
      }
    });
  } catch (e) {
    console.error('Error fetching albums:', e);
  }
  return Array.from(urls);
}

async function discoverPeople() {
  const urls = new Set<string>();
  const url = `${BASE}/people/`;
  console.log(`Fetching people index: ${url}`);
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const norm = normalizeUrl(href);
      if (!norm) return;
      const pathname = new URL(norm).pathname;
      // main people pages
      if (/^\/people\/[a-z0-9-]+\/$/.test(pathname) && pathname !== '/people/') {
        urls.add(norm);
      }
    });
  } catch (e) {
    console.error('Error fetching people:', e);
  }
  // Also collect from already known people pages
  const known = [
    '/people/john-lennon/', '/people/paul-mccartney/', 
    '/people/george-harrison/', '/people/ringo-starr/',
    '/people/brian-epstein/', '/people/george-martin/',
    '/people/stuart-sutcliffe/', '/people/pete-best/'
  ];
  for (const p of known) {
    urls.add(`${BASE}${p}`);
  }
  return Array.from(urls);
}

async function main() {
  const dataDir = path.join(__dirname, '../data');
  await fs.ensureDir(dataDir);
  
  const [history, songs, albums, people] = await Promise.all([
    discoverHistory(),
    discoverSongs(),
    discoverAlbums(),
    discoverPeople()
  ]);
  
  const all = {
    history: history.sort(),
    songs: songs.sort(),
    albums: albums.sort(),
    people: people.sort(),
    discoveredAt: new Date().toISOString(),
    counts: {
      history: history.length,
      songs: songs.length,
      albums: albums.length,
      people: people.length,
      total: history.length + songs.length + albums.length + people.length
    }
  };
  
  await fs.writeJson(path.join(dataDir, 'urls.json'), all, { spaces: 2 });
  console.log('Discovery complete:', all.counts);
}

main().catch(console.error);
