import fs from 'fs-extra';
import path from 'path';

const rawDir = '/Users/davidgeorge/emdash/repositories/beatles-bible/scraper/data/raw';
const beatles = ['john-lennon', 'paul-mccartney', 'george-harrison', 'ringo-starr'];

async function addBiography() {
  for (const slug of beatles) {
    const bioUrl = `https://www.beatlesbible.com/people/${slug}/biography/`;
    
    try {
      const response = await fetch(bioUrl);
      const html = await response.text();
      
      const match = html.match(/<div class="entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div style="font-size: 12px;/);
      if (match) {
        let bioContent = match[1];
        // Remove internal links to hash routing style? Keep as is or fix
        bioContent = bioContent.replace(/href="https:\/\/www\.beatlesbible\.com\/([^"]+)"/g, 'href="#/$1"');
        bioContent = bioContent.replace(/href="\/([^"]+)"/g, 'href="#/$1"');
        
        const files = await fs.readdir(rawDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const data = await fs.readJson(path.join(rawDir, file));
            if (data.slug === slug && data.type === 'people') {
              if (!data.content.includes('<h2>Biography</h2>')) {
                data.content += '<h2>Biography</h2>' + bioContent;
                data.textContent += ' Biography ' + bioContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
                await fs.writeJson(path.join(rawDir, file), data, { spaces: 2 });
                console.log(`Updated ${slug}`);
              } else {
                console.log(`${slug} already has biography`);
              }
              break;
            }
          }
        }
      } else {
        console.log(`No content found for ${slug}`);
      }
    } catch (e) {
      console.error(`Error for ${slug}:`, e.message);
    }
  }
}

addBiography();
