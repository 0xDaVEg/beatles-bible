import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const historyUrls = [
  "https://www.beatlesbible.com/1926/01/03/george-martin-is-born/",
  "https://www.beatlesbible.com/1931/11/12/emi-studios-opens-3-abbey-road-london/",
  "https://www.beatlesbible.com/1933/02/18/yoko-ono-born/",
  "https://www.beatlesbible.com/1934/09/19/brian-epstein-born/",
  "https://www.beatlesbible.com/1938/12/03/julia-stanley-marries-alfred-lennon/",
  "https://www.beatlesbible.com/1939/09/10/cynthia-lennon-born/",
  "https://www.beatlesbible.com/1940/06/23/stuart-sutcliffe-born/",
  "https://www.beatlesbible.com/1940/07/07/ringo-starr-born/",
  "https://www.beatlesbible.com/1940/10/09/john-lennon-born/",
  "https://www.beatlesbible.com/1941/04/15/jim-mccartney-marries-mary-mohin/",
  "https://www.beatlesbible.com/1941/09/24/linda-eastman-born/",
  "https://www.beatlesbible.com/1941/11/24/pete-best-born/",
  "https://www.beatlesbible.com/1942/06/18/paul-mccartney-born/",
  "https://www.beatlesbible.com/1943/02/25/george-harrison-born/",
  "https://www.beatlesbible.com/1944/03/17/pattie-boyd-born/",
  "https://www.beatlesbible.com/1945/06/19/john-lennons-half-sister-victoria-born/",
  "https://www.beatlesbible.com/1946/04/05/jane-asher-born/",
  "https://www.beatlesbible.com/1946/08/04/maureen-cox-born/",
  "https://www.beatlesbible.com/1956/06/18/paul-mccartney-trumpet-14th-birthday/",
  "https://www.beatlesbible.com/1956/10/09/john-lennons-16th-birthday/",
  "https://www.beatlesbible.com/1956/10/31/paul-mccartneys-mother-mary-dies/",
  "https://www.beatlesbible.com/1956/11/11/paul-mccartney-lonnie-donegan-liverpool-empire/",
  "https://www.beatlesbible.com/1957/01/16/cavern-club-opens-mathew-street-liverpool/",
  "https://www.beatlesbible.com/1957/06/09/live-empire-theatre-liverpool-quarrymen/",
  "https://www.beatlesbible.com/1957/06/22/live-rosebery-st-liverpool/",
  "https://www.beatlesbible.com/1957/07/06/john-lennon-meets-paul-mccartney/",
  "https://www.beatlesbible.com/1957/07/29/paul-mccartney-goes-to-scout-camp/",
  "https://www.beatlesbible.com/1957/08/07/quarrymen-live-cavern-club-liverpool/",
  "https://www.beatlesbible.com/1957/10/18/paul-mccartneys-debut-with-the-quarrymen/",
  "https://www.beatlesbible.com/1957/11/07/live-wilson-hall-liverpool/",
  "https://www.beatlesbible.com/1957/11/16/live-stanley-abattoir-social-club-liverpool/",
  "https://www.beatlesbible.com/1957/11/23/live-new-clubmoor-hall-liverpool/",
  "https://www.beatlesbible.com/1957/12/07/live-wilson-hall-liverpool-2/",
  "https://www.beatlesbible.com/1958/01/10/live-new-clubmoor-hall-liverpool-2/",
  "https://www.beatlesbible.com/1958/01/24/quarrymen-live-cavern-club-liverpool-2/",
  "https://www.beatlesbible.com/1958/02/06/george-harrison-meets-quarrymen/",
  "https://www.beatlesbible.com/1958/03/08/quarrymen-play-paul-mccartney-cousin-wedding-reception/",
  "https://www.beatlesbible.com/1958/03/13/live-morgue-skiffle-cellar-liverpool/",
  "https://www.beatlesbible.com/1958/05/05/john-lennon-photographed-in-liverpool/",
  "https://www.beatlesbible.com/1958/07/12/recording-in-spite-of-all-the-danger-thatll-be-the-day/",
  "https://www.beatlesbible.com/1958/07/15/julia-lennon-dies/",
  "https://www.beatlesbible.com/1958/10/18/live-tv-star-search-hippodrome-manchester/",
  "https://www.beatlesbible.com/1958/11/30/live-tv-star-search-hippodrome-manchester-2/",
  "https://www.beatlesbible.com/1958/12/20/live-wedding-reception-speke-liverpool/",
  "https://www.beatlesbible.com/1959/01/01/live-wilson-hall-liverpool-3/",
  "https://www.beatlesbible.com/1959/01/24/live-woolton-village-club-liverpool/",
  "https://www.beatlesbible.com/1959/08/29/live-quarrymen-casbah-coffee-club-liverpool/",
  "https://www.beatlesbible.com/1959/09/05/live-quarrymen-casbah-coffee-club-liverpool-2/",
  "https://www.beatlesbible.com/1959/09/12/live-quarrymen-casbah-coffee-club-liverpool-3/",
  "https://www.beatlesbible.com/1959/09/19/live-quarrymen-casbah-coffee-club-liverpool-4/",
  "https://www.beatlesbible.com/1959/09/26/live-quarrymen-casbah-coffee-club-liverpool-5/",
  "https://www.beatlesbible.com/1959/10/03/live-quarrymen-casbah-coffee-club-liverpool-6/",
  "https://www.beatlesbible.com/1959/10/10/live-quarrymen-casbah-coffee-club-liverpool-7/"
];

async function main() {
  const outDir = path.join(__dirname, '../../src/data');
  await fs.ensureDir(outDir);
  
  // For now, just create minimal entries from URLs
  const history = historyUrls.map(url => {
    const parts = url.split('/').filter(Boolean);
    const slug = parts[parts.length - 1];
    const date = `${parts[2]}-${parts[3]}-${parts[4]}`;
    const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      url,
      type: 'history',
      slug,
      title,
      date,
      content: `<p>Content for ${title}</p>`,
      textContent: title,
      images: []
    };
  });
  
  await fs.writeJson(path.join(outDir, 'history.json'), history, { spaces: 2 });
  
  const songs = [];
  const albums = [];
  const people = [];
  
  await fs.writeJson(path.join(outDir, 'songs.json'), songs, { spaces: 2 });
  await fs.writeJson(path.join(outDir, 'albums.json'), albums, { spaces: 2 });
  await fs.writeJson(path.join(outDir, 'people.json'), people, { spaces: 2 });
  
  const index = {
    history: history.map(h => ({ slug: h.slug, title: h.title, date: h.date, url: h.url })),
    songs: songs.map(s => ({ slug: s.slug, title: s.title, url: s.url })),
    albums: albums.map(a => ({ slug: a.slug, title: a.title, url: a.url })),
    people: people.map(p => ({ slug: p.slug, title: p.title, url: p.url })),
    counts: { history: history.length, songs: songs.length, albums: albums.length, people: songs.length >=0 ? songs.length : 0 }
  };
  index.counts.people = people.length;
  
  await fs.writeJson(path.join(outDir, 'index.json'), index, { spaces: 2 });
  
  console.log('Done:', index.counts);
}

main().catch(console.error);
