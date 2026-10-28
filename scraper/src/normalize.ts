import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.beatlesbible.com';

type Section = 'history' | 'songs' | 'albums' | 'people';

interface RawArticle {
  url: string;
  type: string;
  slug: string;
  title: string;
  date?: string | null;
  content?: string;
  textContent?: string;
  images?: string[];
  scrapedAt?: string;
}

interface Article extends RawArticle {
  section: Section;
  path: string;
  page: number;
  parentSlug: string;
  parentPath: string;
  totalPages: number;
  listable: boolean;
  content: string;
  textContent: string;
  images: string[];
}

const SONG_ORDER: string[] = fs.readJsonSync(path.join(__dirname, 'song-order.json'));
const SONG_RANK = new Map(SONG_ORDER.map((slug, index) => [slug, index]));

const STUDIO_ALBUMS = [
  'please-please-me',
  'with-the-beatles',
  'a-hard-days-night',
  'beatles-for-sale',
  'help',
  'rubber-soul',
  'revolver',
  'sgt-peppers-lonely-hearts-club-band',
  'magical-mystery-tour',
  'the-beatles-white-album',
  'yellow-submarine',
  'abbey-road',
  'let-it-be',
];
const STUDIO_RANK = new Map(STUDIO_ALBUMS.map((slug, index) => [slug, index]));

const TITLE_OVERRIDES: Partial<Record<Section, Record<string, string>>> = {
  albums: {
    '1-one': '1',
    '1962-1966-red-album': '1962-1966 (The Red Album)',
    '1967-1970-blue-album': '1967-1970 (The Blue Album)',
    'on-air-live-at-the-bbc-volume-2': 'On Air - Live At The BBC Volume 2',
    'rarities-uk-album': 'Rarities (UK)',
    'rarities-us-album': 'Rarities (US)',
  },
};

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&#0*38;/g, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getAttr(tag: string, name: string): string | null {
  const doubleQuoted = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag);
  if (doubleQuoted) return decodeEntities(doubleQuoted[1]);
  const singleQuoted = new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, 'i').exec(tag);
  if (singleQuoted) return decodeEntities(singleQuoted[1]);
  return null;
}

function setAttr(tag: string, name: string, value: string): string {
  const escaped = escapeAttr(value);
  const existing = new RegExp(`(\\b${name}\\s*=\\s*)("[^"]*"|'[^']*')`, 'i');
  if (existing.test(tag)) return tag.replace(existing, `$1"${escaped}"`);
  return tag.replace(/\s*\/?>$/, ` ${name}="${escaped}">`);
}

function removeAttr(tag: string, name: string): string {
  const existing = new RegExp(`\\s+${name}\\s*=\\s*("[^"]*"|'[^']*')`, 'gi');
  return tag.replace(existing, '');
}

function sanitizeAnchorTag(tag: string): string {
  let cleaned = tag.replace(/href=&quot;([^"]*?)&quot;/gi, 'href="$1"');
  cleaned = cleaned.replace(/\bhref\s*=\s*([^"'\s<>]+)"?(\s|>)/i, (_, url: string, tail: string) => `href="${url}"${tail}`);
  cleaned = cleaned.replace(/\bhref\s*=\s*"([^"]*?)\/?>$/, (_, url: string) => `href="${url.replace(/\/+$/, '')}/">`);

  const href = getAttr(cleaned, 'href');
  if (href !== null && (/^\s/.test(href) || /\s/.test(href) || href.includes('='))) {
    cleaned = removeAttr(cleaned, 'href');
  }

  return cleaned;
}

function urlPath(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return url;
  }
}

function sectionForPath(pathname: string): Section | null {
  if (pathname.startsWith('/songs/')) return 'songs';
  if (pathname.startsWith('/albums/')) return 'albums';
  if (pathname.startsWith('/people/')) return 'people';
  if (/^\/\d{4}\/\d{2}\/\d{2}\//.test(pathname)) return 'history';
  return null;
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTitle(title: string, section: Section, slug: string): string {
  let cleaned = title.trim();

  if (section === 'people') {
    cleaned = cleaned.replace(/\s*[–—]\s*.*$/, '');
    cleaned = cleaned.replace(/\s+(profile and pictures|profile|biography)\s*$/i, '');
  } else if (section === 'songs') {
    cleaned = cleaned.replace(/\s*[–—]\s*.*$/, '');
    cleaned = cleaned.replace(/\s*\((song|Beatles recording)\)\s*$/i, '');
  } else if (section === 'albums') {
    cleaned = cleaned.replace(/\s*[–—]\s*.*$/, '');
    cleaned = cleaned.replace(/\s+compilation\s*$/i, '');
    cleaned = cleaned.replace(/\s*\((album|Beatles album)\)\s*$/i, '');
    cleaned = cleaned.replace(/\s*\(Cirque du Soleil\)\s*$/i, '');
    cleaned = cleaned.replace(/\s*\(The Beatles\)\s*$/i, '');
    cleaned = cleaned.replace(/\s*\((UK|US) album\)\s*$/i, ' ($1)');
  }

  cleaned = TITLE_OVERRIDES[section]?.[slug] ?? cleaned;
  return cleaned.replace(/\s+/g, ' ').trim();
}

function releaseTimestamp(article: RawArticle): number {
  const text = stripTags(article.content ?? '');
  const released = /Released?:\s*([\s\S]{0,260})/i.exec(text);
  if (!released) return Number.POSITIVE_INFINITY;

  const datePattern = /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;
  const match = datePattern.exec(released[1]);
  return match ? Date.UTC(Number(match[3]), MONTHS[match[2].toLowerCase()], Number(match[1])) : Number.POSITIVE_INFINITY;
}

function absoluteImageUrl(src: string): string {
  let value = decodeEntities(src.trim());
  if (value.startsWith('//')) value = `https:${value}`;
  if (value.startsWith('/')) value = `${SITE}${value}`;
  if (value.startsWith('http://')) value = `https://${value.slice(7)}`;
  return value;
}

function resolveLink(
  href: string,
  context: { ownPath: string; parentPath: string; ids: Set<string> },
): { href: string; external: boolean } {
  const raw = href.trim();
  if (!raw) return { href: '#', external: false };
  let value: string;
  if (raw.startsWith('#/')) {
    value = decodeEntities(raw.slice(1));
  } else {
    if (raw.startsWith('#')) return { href: raw, external: false };
    if (/^(mailto:|tel:|javascript:)/i.test(raw)) return { href: raw, external: false };
    value = decodeEntities(raw);
  }
  if (/^h\/\d{4}\//.test(value)) value = `/${value.slice(1)}`;
  if (value.startsWith('//')) value = `https:${value}`;

  let pathname: string;
  let query = '';
  let fragment = '';

  const siteMatch = /^https?:\/\/(?:www\.)?beatlesbible\.com(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i.exec(value);
  if (siteMatch) {
    pathname = siteMatch[1] ?? '/';
    query = siteMatch[2] ?? '';
    fragment = siteMatch[3] ?? '';
  } else if (/^https?:\/\//i.test(value)) {
    return { href: value, external: true };
  } else {
    let relative = value;
    const hashIndex = relative.indexOf('#');
    if (hashIndex >= 0) {
      fragment = relative.slice(hashIndex);
      relative = relative.slice(0, hashIndex);
    }
    const queryIndex = relative.indexOf('?');
    if (queryIndex >= 0) {
      query = relative.slice(queryIndex);
      relative = relative.slice(0, queryIndex);
    }
    pathname = relative.startsWith('/') ? relative : `/${relative}`;
  }

  pathname = pathname.replace(/\/{2,}/g, '/');
  pathname = pathname.replace(/\/comment-page-\d+\/?$/i, '/');

  if (/^\/(songs|albums|people|history)\/?$/i.test(pathname)) {
    const section = pathname.replace(/\//g, '').toLowerCase();
    return { href: `#/${section}`, external: false };
  }

  if (pathname.startsWith('/songs/') || pathname.startsWith('/albums/') || pathname.startsWith('/people/') || /^\/\d{4}\//.test(pathname)) {
    if (!pathname.endsWith('/')) pathname = `${pathname}/`;
  }

  const biographyMatch = /^\/people\/([^/]+)\/biography(?:\/\d+)?\/?$/.exec(pathname);
  if (biographyMatch) {
    const personPath = `/people/${biographyMatch[1]}/`;
    if (KNOWN_PATHS.has(personPath)) return { href: `#${personPath}`, external: false };
  }

  const sectionMatch = /^\/(songs|albums|people)\/([^/]+)\/(?:(\d+)\/)?$/.exec(pathname);
  if (sectionMatch) {
    const section = sectionMatch[1];
    const slug = sectionMatch[2];
    const page = sectionMatch[3] ? Number(sectionMatch[3]) : 1;
    const basePath = `/${section}/${slug}/`;
    const targetPath = page > 1 ? `${basePath}${page}/` : basePath;
    return linkToContent(targetPath, basePath, fragment, query, context);
  }

  const historyMatch = /^\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/([^/]+)\/(?:(\d+)\/)?$/.exec(pathname);
  if (historyMatch) {
    const year = historyMatch[1];
    const month = historyMatch[2].padStart(2, '0');
    const day = historyMatch[3].padStart(2, '0');
    const slug = historyMatch[4];
    const page = historyMatch[5] ? Number(historyMatch[5]) : 1;
    const basePath = `/${year}/${month}/${day}/${slug}/`;
    const targetPath = page > 1 ? `${basePath}${page}/` : basePath;
    return linkToContent(targetPath, basePath, fragment, query, context);
  }

  return { href: `${SITE}${pathname}${query}${fragment}`, external: true };
}

function linkToContent(
  targetPath: string,
  basePath: string,
  fragment: string,
  query: string,
  context: { ownPath: string; parentPath: string; ids: Set<string> },
): { href: string; external: boolean } {
  if (KNOWN_PATHS.has(targetPath)) {
    const anchor = fragment.replace(/^#/, '');
    const isOwnPage = targetPath === context.ownPath;
    const isParentPage = targetPath === context.parentPath;
    if (anchor && (isOwnPage || (isParentPage && context.ids.has(anchor)))) {
      return { href: `#${anchor}`, external: false };
    }
    if (!anchor && isOwnPage) return { href: '#', external: false };
    return { href: `#${targetPath}${fragment}`, external: false };
  }

  if (KNOWN_PATHS.has(basePath)) {
    const anchor = fragment.replace(/^#/, '');
    if (anchor && (basePath === context.ownPath || (basePath === context.parentPath && context.ids.has(anchor)))) {
      return { href: `#${anchor}`, external: false };
    }
    return { href: `#${basePath}${fragment}`, external: false };
  }

  return { href: `${SITE}${targetPath}${query}${fragment}`, external: true };
}

function cleanContent(content: string, context: { ownPath: string; parentPath: string }): string {
  const ids = new Set<string>();
  for (const match of content.matchAll(/\bid="([^"]+)"/g)) {
    ids.add(match[1]);
    try {
      ids.add(decodeURIComponent(match[1]));
    } catch {
      ids.add(match[1]);
    }
  }

  let cleaned = content;
  cleaned = cleaned.replace(/<header[^>]*class="[^"]*\bentry-header\b[^"]*"[^>]*>[\s\S]*?<\/header>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*\bbreadcrumbs\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*\bpage-links\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  cleaned = cleaned.replace(/<a\b[^>]*>/gi, (tag) => {
    const normalized = sanitizeAnchorTag(tag);
    const href = getAttr(normalized, 'href');
    if (href === null) return normalized;

    const resolved = resolveLink(href, { ...context, ids });
    let updated = setAttr(normalized, 'href', resolved.href);

    if (resolved.external && !/^(mailto:|tel:)/i.test(resolved.href)) {
      updated = setAttr(updated, 'target', '_blank');
      updated = setAttr(updated, 'rel', 'noopener noreferrer');
    } else {
      updated = removeAttr(updated, 'target');
      updated = removeAttr(updated, 'rel');
    }

    return updated;
  });

  cleaned = cleaned.replace(/<img\b[^>]*>/gi, (tag) => {
    const dataSrc = getAttr(tag, 'data-src');
    const src = getAttr(tag, 'src');
    const original = getAttr(tag, 'data-orig-file');
    const large = getAttr(tag, 'data-large-file');
    const chosen = dataSrc ?? (src && !src.startsWith('data:') ? src : original ?? large);

    if (!chosen) return tag;

    let updated = setAttr(tag, 'src', absoluteImageUrl(chosen));
    updated = setAttr(updated, 'loading', 'lazy');
    for (const attribute of ['srcset', 'sizes', 'data-src', 'data-srcset', 'data-sizes', 'data-lazyloaded']) {
      updated = removeAttr(updated, attribute);
    }
    return updated;
  });

  cleaned = cleaned.replace(/<iframe\b[^>]*>/gi, (tag) => {
    const dataSrc = getAttr(tag, 'data-src');
    if (!dataSrc) return tag;
    let updated = setAttr(tag, 'src', absoluteImageUrl(dataSrc));
    updated = removeAttr(updated, 'data-src');
    updated = removeAttr(updated, 'data-lazyloaded');
    return updated;
  });

  return cleaned.trim();
}

function extractImages(content: string): string[] {
  const images = new Set<string>();
  for (const tag of content.match(/<img\b[^>]*>/gi) ?? []) {
    const src = getAttr(tag, 'src');
    if (src && !src.startsWith('data:')) images.add(src);
  }
  return [...images];
}

function cleanTextContent(textContent: string | undefined): string {
  if (!textContent) return '';
  return textContent.replace(/^[^»]{0,180}»\s*/, '').trim();
}

const KNOWN_PATHS = new Set<string>();

async function main() {
  const dataDir = path.join(__dirname, '../data');
  const rawDir = path.join(dataDir, 'raw');
  const outDirs = [
    path.join(__dirname, '../../src/data'),
    path.join(__dirname, '../../web/src/data'),
  ];

  const files = (await fs.readdir(rawDir)).filter((file) => file.endsWith('.json'));
  const rawArticles: RawArticle[] = await Promise.all(
    files.map((file) => fs.readJson(path.join(rawDir, file)) as Promise<RawArticle>),
  );

  const rawByPath = new Map<string, RawArticle>();
  for (const article of rawArticles) rawByPath.set(urlPath(article.url), article);
  for (const pathname of rawByPath.keys()) KNOWN_PATHS.add(pathname);

  const parsed: Article[] = [];
  for (const raw of rawArticles) {
    const pathname = urlPath(raw.url);
    if (pathname === '/people/comment-page-1/' || pathname === '/people/comment-page-2/') continue;

    let parentPath = pathname;
    let page = 1;
    const pageMatch = /^(.*\/)(\d+)\/$/.exec(pathname);
    if (pageMatch && KNOWN_PATHS.has(pageMatch[1])) {
      const possiblePage = Number(pageMatch[2]);
      const isPagination =
        raw.type === 'page' ||
        raw.type === 'songs' ||
        raw.type === 'albums' ||
        raw.type === 'people' ||
        (raw.type === 'history' && possiblePage > 1);
      if (isPagination && possiblePage > 1) {
        parentPath = pageMatch[1];
        page = possiblePage;
      }
    }

    const section = sectionForPath(parentPath);
    if (!section) continue;

    const parentSlug = parentPath.split('/').filter(Boolean).pop() ?? raw.slug;
    parsed.push({
      ...raw,
      section,
      path: page > 1 ? `${parentPath}${page}/` : parentPath,
      page,
      parentSlug,
      parentPath,
      totalPages: 1,
      listable: page === 1,
      content: raw.content ?? '',
      textContent: cleanTextContent(raw.textContent),
      images: [],
    });
  }

  const groups = new Map<string, Article[]>();
  for (const article of parsed) {
    const group = groups.get(article.parentPath) ?? [];
    group.push(article);
    groups.set(article.parentPath, group);
  }

  for (const [parentPath, group] of groups) {
    const parent = group.find((article) => article.page === 1);
    const parentRaw = rawByPath.get(parentPath);
    const titleSource = parentRaw ?? group[0];
    const fallbackSection = sectionForPath(parentPath);
    if (!fallbackSection) continue;
    const cleanParentTitle = cleanTitle(titleSource.title, fallbackSection, titleSource.slug);
    const totalPages = Math.max(...group.map((article) => article.page));
    const parentDate = parent?.date ?? parentRaw?.date ?? null;

    for (const article of group) {
      article.title = cleanParentTitle;
      article.date = article.date ?? parentDate;
      article.totalPages = totalPages;
      article.listable = article.page === 1;
      article.content = cleanContent(article.content, {
        ownPath: article.path,
        parentPath: article.parentPath,
      });
      article.images = extractImages(article.content);
    }
  }

  const albumDates = new Map<string, number>();
  for (const raw of rawArticles) {
    const pathname = urlPath(raw.url);
    if (raw.type !== 'album') continue;
    const slug = pathname.split('/').filter(Boolean).pop();
    if (slug) {
      albumDates.set(
        slug,
        slug === 'nowhere-boy-original-soundtrack'
          ? Date.UTC(2009, 11, 14)
          : releaseTimestamp(raw),
      );
    }
  }

  const history = parsed
    .filter((article) => article.section === 'history')
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') || a.title.localeCompare(b.title) || a.page - b.page);

  const songs = parsed
    .filter((article) => article.section === 'songs')
    .sort((a, b) => {
      const rankA = SONG_RANK.get(a.parentSlug) ?? SONG_ORDER.length;
      const rankB = SONG_RANK.get(b.parentSlug) ?? SONG_ORDER.length;
      return rankA - rankB || a.title.localeCompare(b.title) || a.page - b.page;
    });

  const albums = parsed
    .filter((article) => article.section === 'albums')
    .sort((a, b) => {
      const studioA = STUDIO_RANK.get(a.parentSlug);
      const studioB = STUDIO_RANK.get(b.parentSlug);
      if (studioA !== undefined || studioB !== undefined) {
        const rankA = studioA ?? Number.MAX_SAFE_INTEGER;
        const rankB = studioB ?? Number.MAX_SAFE_INTEGER;
        return rankA - rankB || a.page - b.page;
      }
      const dateA = albumDates.get(a.parentSlug) ?? Number.POSITIVE_INFINITY;
      const dateB = albumDates.get(b.parentSlug) ?? Number.POSITIVE_INFINITY;
      if (dateA !== dateB) return dateA < dateB ? -1 : 1;
      return a.title.localeCompare(b.title) || a.page - b.page;
    });

  const people = parsed
    .filter((article) => article.section === 'people')
    .sort((a, b) => a.title.localeCompare(b.title) || a.page - b.page);

  const index = {
    history: history.filter((article) => article.listable).map(({ slug, title, date, path, url }) => ({ slug, title, date, path, url })),
    songs: songs.filter((article) => article.listable).map(({ slug, title, date, path, url }) => ({ slug, title, date, path, url })),
    albums: albums.filter((article) => article.listable).map(({ slug, title, date, path, url }) => ({ slug, title, date, path, url })),
    people: people.filter((article) => article.listable).map(({ slug, title, date, path, url }) => ({ slug, title, date, path, url })),
    counts: {
      history: history.length,
      songs: songs.length,
      albums: albums.length,
      people: people.length,
    },
  };

  for (const outDir of outDirs) {
    await fs.ensureDir(outDir);
    await Promise.all([
      fs.writeJson(path.join(outDir, 'history.json'), history, { spaces: 2 }),
      fs.writeJson(path.join(outDir, 'songs.json'), songs, { spaces: 2 }),
      fs.writeJson(path.join(outDir, 'albums.json'), albums, { spaces: 2 }),
      fs.writeJson(path.join(outDir, 'people.json'), people, { spaces: 2 }),
      fs.writeJson(path.join(outDir, 'index.json'), index, { spaces: 2 }),
    ]);
  }

  console.log('Normalization complete:', {
    history: history.length,
    songs: songs.length,
    albums: albums.length,
    people: people.length,
    listable: {
      history: index.history.length,
      songs: index.songs.length,
      albums: index.albums.length,
      people: index.people.length,
    },
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
