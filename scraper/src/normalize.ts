import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const dataDir = path.join(__dirname, '../data');
  const rawDir = path.join(dataDir, 'raw');
  const outDir = path.join(__dirname, '../../src/data');
  await fs.ensureDir(outDir);
  
  const files = await fs.readdir(rawDir);
  const articles = [];
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const article = await fs.readJson(path.join(rawDir, file));
      articles.push(article);
    }
  }
  
  // Group by type - include pagination pages (URLs ending with /number/)
  const history = articles
    .filter(a => a.type === 'history' || (a.url && /beatlesbible\.com\/\d{4}\//.test(a.url) && /\/\d+\/?$/.test(a.url)))
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  
  const songs = articles
    .filter(a => a.type === 'song' || (a.url && a.url.includes('/songs/') && /\/\d+\/?$/.test(a.url)))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  
  const albums = articles
    .filter(a => a.type === 'album' || (a.url && a.url.includes('/albums/') && /\/\d+\/?$/.test(a.url)))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  
  const people = articles
    .filter(a => a.type === 'people' || (a.url && a.url.includes('/people/') && /\/\d+\/?$/.test(a.url)))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  
  await fs.writeJson(path.join(outDir, 'history.json'), history, { spaces: 2 });
  await fs.writeJson(path.join(outDir, 'songs.json'), songs, { spaces: 2 });
  await fs.writeJson(path.join(outDir, 'albums.json'), albums, { spaces: 2 });
  await fs.writeJson(path.join(outDir, 'people.json'), people, { spaces: 2 });
  
  const index = {
    history: history.filter(h => !(h.url && /\/\d+\/?$/.test(h.url))).map(h => ({ slug: h.slug, title: h.title, date: h.date, url: h.url })),
    songs: songs.filter(s => !(s.url && /\/\d+\/?$/.test(s.url))).map(s => ({ slug: s.slug, title: s.title, url: s.url })),
    albums: albums.filter(a => !(a.url && /\/\d+\/?$/.test(a.url))).map(a => ({ slug: a.slug, title: a.title, url: a.url })),
    people: people.filter(p => !(p.url && /\/\d+\/?$/.test(p.url))).map(p => ({ slug: p.slug, title: p.title, url: p.url })),
    counts: { history: history.length, songs: songs.length, albums: albums.length, people: people.length }
  };
  
  await fs.writeJson(path.join(outDir, 'index.json'), index, { spaces: 2 });
  
  console.log('Normalization complete:', index.counts);
}

main().catch(console.error);
