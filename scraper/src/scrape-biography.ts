import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(__dirname, '../data/raw');

const beatles = ['john-lennon', 'paul-mccartney', 'george-harrison', 'ringo-starr'];

async function scrapeBiography() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  for (const slug of beatles) {
    const url = `https://www.beatlesbible.com/people/${slug}/biography/`;
    console.log(`Scraping ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      
      const content = await page.evaluate(() => {
        const article = document.querySelector('.entry-content') || document.querySelector('article');
        if (!article) return null;
        return article.innerHTML;
      });
      
      if (content) {
        // Find the raw file for the main person page
        const files = await fs.readdir(rawDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const data = await fs.readJson(path.join(rawDir, file));
            if (data.slug === slug && data.type === 'people') {
              // Append biography
              data.content += '<h2>Biography</h2>' + content;
              data.textContent += ' Biography ' + content.replace(/<[^>]*>/g, ' ');
              await fs.writeJson(path.join(rawDir, file), data, { spaces: 2 });
              console.log(`Updated ${slug} with biography`);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error scraping ${slug}:`, e);
    }
  }
  
  await browser.close();
}

scrapeBiography().catch(console.error);
