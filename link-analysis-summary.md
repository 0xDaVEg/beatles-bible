# Beatles Bible link extraction summary

Generated: 2026-10-24  
Workspace: `/Users/davidgeorge/emdash/worktrees/beatles-bible/emdash/initial-scrape-s0w23`

## Scope and sources

The repository/worktree contains no `.html` files. The only saved HTML captures found were opencode tool-output snapshots of the two requested Beatles Bible index pages. This report analyses those captures.

| ID | Saved HTML file | Page | Page title | Bytes |
|---|---|---|---|---:|
| History (full) | `/Users/davidgeorge/.local/share/opencode/tool-output/tool_16d79fbbf001EElICvyVU5nPWu` | `https://www.beatlesbible.com/history/` | Days in the life: The ultimate Beatles' history! | 269,472 |
| Songs | `/Users/davidgeorge/.local/share/opencode/tool-output/tool_16d7a01d200141gTyApSUt8oUK` | `https://www.beatlesbible.com/songs/` | The Beatles' songs - complete A-Z list! | 364,619 |
| History (truncated duplicate) | `/Users/davidgeorge/.local/share/opencode/tool-output/tool_16d7a6f410016S75C0ZBeSDqqx` | `https://www.beatlesbible.com/history/` | Days in the life: The ultimate Beatles' history! | 86,370 |

The truncated duplicate stops inside the document `<head>`/CSS. It has no `<body>`, no `<a>` tags and no article links, so it is excluded from the article counts below.

## Headline result

- **53 unique history article URLs** found in the saved `/history/` HTML.
- **329 unique song article URLs** found in the saved `/songs/` HTML.
- **382 unique in-scope article URLs** in total.
- The history page only covers the first archive page (articles dated 1926-1959). The section is paginated, so this is not the complete Beatles history corpus.

## Raw href counts

| Snapshot | href occurrences | unique href strings | relative hrefs | absolute/other hrefs | fragment-only hrefs |
|---|---:|---:|---:|---:|---:|
| History (full) | 322 | 236 | 32 | 290 | 7 |
| Songs | 1,256 | 545 | 1,057 | 199 | 694 |
| History (truncated) | 14 | 14 | 1 | 13 | 0 |

Raw counts are inflated by repeated header, mobile-menu and footer links. Relative vs absolute form is not consistent: navigation uses absolute URLs while article bodies mostly use root-relative URLs.

## Links containing the requested section paths

Counts are raw href occurrences, followed by unique href strings and unique canonical URLs after resolving relative links and stripping fragments.

| Snapshot | `/history/` | `/songs/` | `/albums/` | `/people/` |
|---|---:|---:|---:|---:|
| History (full) | 54 (33 unique; 20 canonical) | 19 (11 unique; 10 canonical) | 14 (7 unique; 7 canonical) | 64 (28 unique; 27 canonical) |
| Songs | 3 (1 unique; 1 canonical) | 411 (380 unique; 338 canonical) | 15 (9 unique; 8 canonical) | 63 (28 unique; 27 canonical) |
| History (truncated) | 3 (3 unique; 3 canonical) | 0 (0 unique; 0 canonical) | 0 (0 unique; 0 canonical) | 0 (0 unique; 0 canonical) |

Important: history article URLs do **not** live under `/history/`. They use date-based URLs. The `/history/` links are only the landing page, pagination pages, feed and comment links.

## Article URL counts

| Snapshot | History articles | Song articles | Album articles referenced | Main people pages referenced |
|---|---:|---:|---:|---:|
| History (full) | 53 | 4 | 2 | 4 |
| Songs | 0 | 329 | 3 | 4 |
| Combined unique | 53 | 329 | 3 | 4 |

### Cross-section article links found on these pages

- Song articles linked from the history page: `/songs/all-you-need-is-love/`, `/songs/and-i-love-her/`, `/songs/cant-buy-me-love/`, `/songs/things-we-said-today/`
- Album articles linked from the history page: `/albums/a-hard-days-night/`, `/albums/the-beatles-white-album/`
- Album articles linked from the songs page: `/albums/a-hard-days-night/`, `/albums/live-at-the-bbc/`, `/albums/the-beatles-white-album/`
- Main people pages linked from these pages: `/people/george-harrison/`, `/people/john-lennon/`, `/people/paul-mccartney/`, `/people/ringo-starr/`

## URL and link patterns

### 1. Host, scheme and trailing slash

- Canonical host: `https://www.beatlesbible.com`. All article URLs end with a trailing slash.
- Article hrefs appear in two forms: root-relative (`/songs/love-me-do/`) in article bodies and absolute (`https://www.beatlesbible.com/...`) in navigation, sidebars and the history archive. Normalize both with `urljoin`.

### 2. History section

| URL form | Example | Meaning |
|---|---|---|
| `/history/` | `https://www.beatlesbible.com/history/` | Section landing page / archive page 1 |
| `/history/<n>/` | `https://www.beatlesbible.com/history/2/` | Archive pagination, pages 2-17 |
| `/history/feed/` | `https://www.beatlesbible.com/history/feed/` | RSS feed |
| `/history/comment-page-<n>/#comments` | `https://www.beatlesbible.com/history/comment-page-2/#comment-925097` | Comment pagination / anchors |
| `/YYYY/MM/DD/<slug>/` | `https://www.beatlesbible.com/1940/10/09/john-lennon-born/` | **History article** |
| `/YYYY/MM/` | `https://www.beatlesbible.com/1940/10/` | Month archive index, not an article |

History article anchors are marked with `rel="bookmark"`. The saved archive page exposes 17 archive pages total (`/history/` plus `/history/2/` through `/history/17/`), but only page 1 was captured.

### 3. Songs section

| URL form | Example | Meaning |
|---|---|---|
| `/songs/` | `https://www.beatlesbible.com/songs/` | Section landing page / A-Z index |
| `/songs/<slug>/` | `/songs/love-me-do/` | **Song article** |
| `/songs/feed/` | `https://www.beatlesbible.com/songs/feed/` | RSS feed |
| `/songs/listed-by-singer/` | `/songs/listed-by-singer/` | Special index page, not a song article |
| `/songs/comment-page-<n>/#comments` | `https://www.beatlesbible.com/songs/comment-page-2/#comment-598241` | Comment pagination / anchors |

The songs A-Z page contains 329 unique song article links but 353 href occurrences: 22 slugs are linked more than once, contributing 24 extra hrefs (intro/featured text plus the A-Z entry). Duplicate-linked slugs: `all-you-need-is-love`, `and-i-love-her`, `cant-buy-me-love`, `carnival-of-light`, `child-of-nature`, `im-ready`, `let-it-be`, `love-me-do`, `the-ballad-of-john-and-yoko`, `the-continuing-story-of-bungalow-bill`, `the-end`, `the-fool-on-the-hill`, `the-hippy-hippy-shake`, `the-honeymoon-song`, `the-inner-light`, `the-long-and-winding-road`, `the-night-before`, `the-saints`, `the-sheik-of-araby`, `the-walk`, `the-word`, `things-we-said-today`.

### 4. Albums and people

| URL form | Example | Meaning |
|---|---|---|
| `/albums/` | `https://www.beatlesbible.com/albums/` | Album index |
| `/albums/<slug>/` | `/albums/a-hard-days-night/` | **Album article** |
| `/people/` | `https://www.beatlesbible.com/people/` | People index |
| `/people/<person>/` | `https://www.beatlesbible.com/people/john-lennon/` | **Main person page** |
| `/people/<person>/<subpage>/` | `.../people/john-lennon/biography/` | Person subpage: `biography`, `songs`, `albums`, `videos`, `live`, `tours`, `discography`, `eps` |

### 5. Slug structure

- Slugs are lowercase ASCII and use hyphens only (`[a-z0-9-]+`); no underscores, apostrophes, spaces or percent-encoding were found in the extracted article slugs.
- Punctuation and apostrophes are stripped: `Can't Buy Me Love` -> `cant-buy-me-love`; `Don't Let Me Down` -> `dont-let-me-down`; `I'm Happy Just To Dance With You` -> `im-happy-just-to-dance-with-you`; `Octopus's Garden` -> `octopuss-garden`.
- Parentheses and punctuation are collapsed or removed: `Norwegian Wood (This Bird Has Flown)` -> `norwegian-wood-this-bird-has-flown`; `Sgt. Pepper's Lonely Hearts Club Band` -> `sgt-peppers-lonely-hearts-club-band`.
- Leading articles are kept in song slugs (`the-end`, `the-word`); 13 song slugs start with `the-`.
- Numeric suffixes are date/event disambiguators on history articles (`.../live-quarrymen-casbah-coffee-club-liverpool-2/` through `-7`), not a general song rule. The only numeric-ended song slugs are `revolution-1`, `revolution-9` and `one-after-909`.
- Song slug length: min 3, max 56, mean 16.2 characters. Longest: `everybodys-got-something-to-hide-except-me-and-my-monkey`. Shortest examples: `why`, `boys`, `girl`, `help`, `junk`, `rain`.
- One song slug starts with a digit: `12-bar-original`.

### 6. Filtering and deduplication rules

Use these rules to turn raw hrefs into article URLs:

- Resolve relative URLs against `https://www.beatlesbible.com/`; drop fragments (`#...`).
- History article: `^https?://www\.beatlesbible\.com/\d{4}/\d{2}/\d{2}/[a-z0-9-]+/$`
- Song article: `^(?:https?://www\.beatlesbible\.com)?/songs/[a-z0-9-]+/$`, excluding `feed`, `listed-by-singer` and `comment-page-*`.
- Album article: `^(?:https?://www\.beatlesbible\.com)?/albums/[a-z0-9-]+/$`, excluding the `/albums/` index.
- Main person page: `^(?:https?://www\.beatlesbible\.com)?/people/[a-z0-9-]+/$`; subpages are separate URLs.
- Exclude non-article paths/fragments: `/songs/`, `/albums/`, `/people/`, `/history/`, `/feed/`, `/comment-page-*`, `#comments`, `#respond`, `/wp/`, `/wp-json/`, `/gallery/`, `/videos/`, `/features/`, `/discography/`, `/fab-forum/`.

### 7. Link examples

```html
<a href="/songs/love-me-do/">&#8216;Love Me Do&#8217;</a>
<a href="https://www.beatlesbible.com/1940/10/09/john-lennon-born/" rel="bookmark">John Lennon is born</a>
<a href="https://www.beatlesbible.com/people/john-lennon/songs/">Songs</a>
```

The first is a song article link from the A-Z list (root-relative). The second is a history article link from the archive (absolute and `rel="bookmark"`). The third is navigation, not an article.

## History article distribution

- 53 unique articles, dated 1926-01-03 to 1959-10-10.
- Per-year article counts: 1926: 1, 1931: 1, 1933: 1, 1934: 1, 1938: 1, 1939: 1, 1940: 3, 1941: 3, 1942: 1, 1943: 1, 1944: 1, 1945: 1, 1946: 2, 1956: 4, 1957: 11, 1958: 11, 1959: 9.
- Every extracted history article fits the four-segment pattern `/YYYY/MM/DD/<slug>/`.
- The page also contains 40 unique month-archive links (`/YYYY/MM/`); these are indexes and are excluded from article counts.

## Appendix A - All history article URLs (53, date order)

```text
https://www.beatlesbible.com/1926/01/03/george-martin-is-born/
https://www.beatlesbible.com/1931/11/12/emi-studios-opens-3-abbey-road-london/
https://www.beatlesbible.com/1933/02/18/yoko-ono-born/
https://www.beatlesbible.com/1934/09/19/brian-epstein-born/
https://www.beatlesbible.com/1938/12/03/julia-stanley-marries-alfred-lennon/
https://www.beatlesbible.com/1939/09/10/cynthia-lennon-born/
https://www.beatlesbible.com/1940/06/23/stuart-sutcliffe-born/
https://www.beatlesbible.com/1940/07/07/ringo-starr-born/
https://www.beatlesbible.com/1940/10/09/john-lennon-born/
https://www.beatlesbible.com/1941/04/15/jim-mccartney-marries-mary-mohin/
https://www.beatlesbible.com/1941/09/24/linda-eastman-born/
https://www.beatlesbible.com/1941/11/24/pete-best-born/
https://www.beatlesbible.com/1942/06/18/paul-mccartney-born/
https://www.beatlesbible.com/1943/02/25/george-harrison-born/
https://www.beatlesbible.com/1944/03/17/pattie-boyd-born/
https://www.beatlesbible.com/1945/06/19/john-lennons-half-sister-victoria-born/
https://www.beatlesbible.com/1946/04/05/jane-asher-born/
https://www.beatlesbible.com/1946/08/04/maureen-cox-born/
https://www.beatlesbible.com/1956/06/18/paul-mccartney-trumpet-14th-birthday/
https://www.beatlesbible.com/1956/10/09/john-lennons-16th-birthday/
https://www.beatlesbible.com/1956/10/31/paul-mccartneys-mother-mary-dies/
https://www.beatlesbible.com/1956/11/11/paul-mccartney-lonnie-donegan-liverpool-empire/
https://www.beatlesbible.com/1957/01/16/cavern-club-opens-mathew-street-liverpool/
https://www.beatlesbible.com/1957/06/09/live-empire-theatre-liverpool-quarrymen/
https://www.beatlesbible.com/1957/06/22/live-rosebery-st-liverpool/
https://www.beatlesbible.com/1957/07/06/john-lennon-meets-paul-mccartney/
https://www.beatlesbible.com/1957/07/29/paul-mccartney-goes-to-scout-camp/
https://www.beatlesbible.com/1957/08/07/quarrymen-live-cavern-club-liverpool/
https://www.beatlesbible.com/1957/10/18/paul-mccartneys-debut-with-the-quarrymen/
https://www.beatlesbible.com/1957/11/07/live-wilson-hall-liverpool/
https://www.beatlesbible.com/1957/11/16/live-stanley-abattoir-social-club-liverpool/
https://www.beatlesbible.com/1957/11/23/live-new-clubmoor-hall-liverpool/
https://www.beatlesbible.com/1957/12/07/live-wilson-hall-liverpool-2/
https://www.beatlesbible.com/1958/01/10/live-new-clubmoor-hall-liverpool-2/
https://www.beatlesbible.com/1958/01/24/quarrymen-live-cavern-club-liverpool-2/
https://www.beatlesbible.com/1958/02/06/george-harrison-meets-quarrymen/
https://www.beatlesbible.com/1958/03/08/quarrymen-play-paul-mccartney-cousin-wedding-reception/
https://www.beatlesbible.com/1958/03/13/live-morgue-skiffle-cellar-liverpool/
https://www.beatlesbible.com/1958/05/05/john-lennon-photographed-in-liverpool/
https://www.beatlesbible.com/1958/07/12/recording-in-spite-of-all-the-danger-thatll-be-the-day/
https://www.beatlesbible.com/1958/07/15/julia-lennon-dies/
https://www.beatlesbible.com/1958/10/18/live-tv-star-search-hippodrome-manchester/
https://www.beatlesbible.com/1958/11/30/live-tv-star-search-hippodrome-manchester-2/
https://www.beatlesbible.com/1958/12/20/live-wedding-reception-speke-liverpool/
https://www.beatlesbible.com/1959/01/01/live-wilson-hall-liverpool-3/
https://www.beatlesbible.com/1959/01/24/live-woolton-village-club-liverpool/
https://www.beatlesbible.com/1959/08/29/live-quarrymen-casbah-coffee-club-liverpool/
https://www.beatlesbible.com/1959/09/05/live-quarrymen-casbah-coffee-club-liverpool-2/
https://www.beatlesbible.com/1959/09/12/live-quarrymen-casbah-coffee-club-liverpool-3/
https://www.beatlesbible.com/1959/09/19/live-quarrymen-casbah-coffee-club-liverpool-4/
https://www.beatlesbible.com/1959/09/26/live-quarrymen-casbah-coffee-club-liverpool-5/
https://www.beatlesbible.com/1959/10/03/live-quarrymen-casbah-coffee-club-liverpool-6/
https://www.beatlesbible.com/1959/10/10/live-quarrymen-casbah-coffee-club-liverpool-7/
```

## Appendix B - All song article URLs (329, alphabetical by slug)

```text
https://www.beatlesbible.com/songs/12-bar-original/
https://www.beatlesbible.com/songs/a-beginning/
https://www.beatlesbible.com/songs/a-day-in-the-life/
https://www.beatlesbible.com/songs/a-hard-days-night/
https://www.beatlesbible.com/songs/a-shot-of-rhythm-and-blues/
https://www.beatlesbible.com/songs/a-taste-of-honey/
https://www.beatlesbible.com/songs/a-world-without-love/
https://www.beatlesbible.com/songs/across-the-universe/
https://www.beatlesbible.com/songs/act-naturally/
https://www.beatlesbible.com/songs/aint-she-sweet/
https://www.beatlesbible.com/songs/all-for-love/
https://www.beatlesbible.com/songs/all-ive-got-to-do/
https://www.beatlesbible.com/songs/all-my-loving/
https://www.beatlesbible.com/songs/all-things-must-pass/
https://www.beatlesbible.com/songs/all-together-now/
https://www.beatlesbible.com/songs/all-you-need-is-love/
https://www.beatlesbible.com/songs/and-i-love-her/
https://www.beatlesbible.com/songs/and-your-bird-can-sing/
https://www.beatlesbible.com/songs/anna-go-to-him/
https://www.beatlesbible.com/songs/another-girl/
https://www.beatlesbible.com/songs/any-time-at-all/
https://www.beatlesbible.com/songs/ask-me-why/
https://www.beatlesbible.com/songs/baby-its-you/
https://www.beatlesbible.com/songs/baby-youre-a-rich-man/
https://www.beatlesbible.com/songs/babys-in-black/
https://www.beatlesbible.com/songs/back-in-the-ussr/
https://www.beatlesbible.com/songs/bad-boy/
https://www.beatlesbible.com/songs/bad-to-me/
https://www.beatlesbible.com/songs/beautiful-dreamer/
https://www.beatlesbible.com/songs/because/
https://www.beatlesbible.com/songs/being-for-the-benefit-of-mr-kite/
https://www.beatlesbible.com/songs/besame-mucho/
https://www.beatlesbible.com/songs/birthday/
https://www.beatlesbible.com/songs/blackbird/
https://www.beatlesbible.com/songs/blue-jay-way/
https://www.beatlesbible.com/songs/blue-moon/
https://www.beatlesbible.com/songs/boys/
https://www.beatlesbible.com/songs/can-you-dig-it/
https://www.beatlesbible.com/songs/can-you-take-me-back/
https://www.beatlesbible.com/songs/cant-buy-me-love/
https://www.beatlesbible.com/songs/carnival-of-light/
https://www.beatlesbible.com/songs/carol/
https://www.beatlesbible.com/songs/carry-that-weight/
https://www.beatlesbible.com/songs/catcall/
https://www.beatlesbible.com/songs/cayenne/
https://www.beatlesbible.com/songs/chains/
https://www.beatlesbible.com/songs/child-of-nature/
https://www.beatlesbible.com/songs/christmas-time-is-here-again/
https://www.beatlesbible.com/songs/circles/
https://www.beatlesbible.com/songs/clarabella/
https://www.beatlesbible.com/songs/come-and-get-it/
https://www.beatlesbible.com/songs/come-together/
https://www.beatlesbible.com/songs/cry-baby-cry/
https://www.beatlesbible.com/songs/cry-for-a-shadow/
https://www.beatlesbible.com/songs/crying-waiting-hoping/
https://www.beatlesbible.com/songs/day-tripper/
https://www.beatlesbible.com/songs/dear-prudence/
https://www.beatlesbible.com/songs/devil-in-her-heart/
https://www.beatlesbible.com/songs/dig-a-pony/
https://www.beatlesbible.com/songs/dig-it/
https://www.beatlesbible.com/songs/dizzy-miss-lizzy/
https://www.beatlesbible.com/songs/do-you-want-to-know-a-secret/
https://www.beatlesbible.com/songs/doctor-robert/
https://www.beatlesbible.com/songs/dont-bother-me/
https://www.beatlesbible.com/songs/dont-ever-change/
https://www.beatlesbible.com/songs/dont-let-me-down/
https://www.beatlesbible.com/songs/dont-pass-me-by/
https://www.beatlesbible.com/songs/drive-my-car/
https://www.beatlesbible.com/songs/eight-days-a-week/
https://www.beatlesbible.com/songs/eleanor-rigby/
https://www.beatlesbible.com/songs/etcetera/
https://www.beatlesbible.com/songs/every-little-thing/
https://www.beatlesbible.com/songs/everybodys-got-something-to-hide-except-me-and-my-monkey/
https://www.beatlesbible.com/songs/everybodys-trying-to-be-my-baby/
https://www.beatlesbible.com/songs/fancy-my-chances-with-you/
https://www.beatlesbible.com/songs/fixing-a-hole/
https://www.beatlesbible.com/songs/flying/
https://www.beatlesbible.com/songs/for-no-one/
https://www.beatlesbible.com/songs/for-you-blue/
https://www.beatlesbible.com/songs/free-as-a-bird/
https://www.beatlesbible.com/songs/from-a-window/
https://www.beatlesbible.com/songs/from-me-to-you/
https://www.beatlesbible.com/songs/get-back/
https://www.beatlesbible.com/songs/getting-better/
https://www.beatlesbible.com/songs/girl/
https://www.beatlesbible.com/songs/glad-all-over/
https://www.beatlesbible.com/songs/glass-onion/
https://www.beatlesbible.com/songs/golden-slumbers/
https://www.beatlesbible.com/songs/good-day-sunshine/
https://www.beatlesbible.com/songs/good-morning-good-morning/
https://www.beatlesbible.com/songs/good-night/
https://www.beatlesbible.com/songs/goodbye/
https://www.beatlesbible.com/songs/got-to-get-you-into-my-life/
https://www.beatlesbible.com/songs/hallelujah-i-love-her-so/
https://www.beatlesbible.com/songs/happiness-is-a-warm-gun/
https://www.beatlesbible.com/songs/hello-goodbye/
https://www.beatlesbible.com/songs/hello-little-girl/
https://www.beatlesbible.com/songs/help/
https://www.beatlesbible.com/songs/helter-skelter/
https://www.beatlesbible.com/songs/her-majesty/
https://www.beatlesbible.com/songs/here-comes-the-sun/
https://www.beatlesbible.com/songs/here-there-and-everywhere/
https://www.beatlesbible.com/songs/hey-bulldog/
https://www.beatlesbible.com/songs/hey-jude/
https://www.beatlesbible.com/songs/hold-me-tight/
https://www.beatlesbible.com/songs/honey-dont/
https://www.beatlesbible.com/songs/honey-pie/
https://www.beatlesbible.com/songs/how-do-you-do-it/
https://www.beatlesbible.com/songs/i-am-the-walrus/
https://www.beatlesbible.com/songs/i-call-your-name/
https://www.beatlesbible.com/songs/i-dont-want-to-see-you-again/
https://www.beatlesbible.com/songs/i-dont-want-to-spoil-the-party/
https://www.beatlesbible.com/songs/i-feel-fine/
https://www.beatlesbible.com/songs/i-forgot-to-remember-to-forget/
https://www.beatlesbible.com/songs/i-got-a-woman/
https://www.beatlesbible.com/songs/i-got-to-find-my-baby/
https://www.beatlesbible.com/songs/i-just-dont-understand/
https://www.beatlesbible.com/songs/i-me-mine/
https://www.beatlesbible.com/songs/i-need-you/
https://www.beatlesbible.com/songs/i-saw-her-standing-there/
https://www.beatlesbible.com/songs/i-should-have-known-better/
https://www.beatlesbible.com/songs/i-wanna-be-your-man/
https://www.beatlesbible.com/songs/i-want-to-hold-your-hand/
https://www.beatlesbible.com/songs/i-want-to-tell-you/
https://www.beatlesbible.com/songs/i-want-you-shes-so-heavy/
https://www.beatlesbible.com/songs/i-will/
https://www.beatlesbible.com/songs/if-i-fell/
https://www.beatlesbible.com/songs/if-i-needed-someone/
https://www.beatlesbible.com/songs/if-youve-got-trouble/
https://www.beatlesbible.com/songs/ill-be-back/
https://www.beatlesbible.com/songs/ill-be-on-my-way/
https://www.beatlesbible.com/songs/ill-cry-instead/
https://www.beatlesbible.com/songs/ill-follow-the-sun/
https://www.beatlesbible.com/songs/ill-get-you/
https://www.beatlesbible.com/songs/ill-keep-you-satisfied/
https://www.beatlesbible.com/songs/im-a-loser/
https://www.beatlesbible.com/songs/im-down/
https://www.beatlesbible.com/songs/im-gonna-sit-right-down-and-cry-over-you/
https://www.beatlesbible.com/songs/im-happy-just-to-dance-with-you/
https://www.beatlesbible.com/songs/im-in-love/
https://www.beatlesbible.com/songs/im-looking-through-you/
https://www.beatlesbible.com/songs/im-only-sleeping/
https://www.beatlesbible.com/songs/im-ready/
https://www.beatlesbible.com/songs/im-so-tired/
https://www.beatlesbible.com/songs/im-talking-about-you/
https://www.beatlesbible.com/songs/in-my-life/
https://www.beatlesbible.com/songs/in-spite-of-all-the-danger/
https://www.beatlesbible.com/songs/it-wont-be-long/
https://www.beatlesbible.com/songs/its-all-too-much/
https://www.beatlesbible.com/songs/its-for-you/
https://www.beatlesbible.com/songs/its-only-love/
https://www.beatlesbible.com/songs/ive-got-a-feeling/
https://www.beatlesbible.com/songs/ive-just-seen-a-face/
https://www.beatlesbible.com/songs/johnny-b-goode/
https://www.beatlesbible.com/songs/julia/
https://www.beatlesbible.com/songs/junk/
https://www.beatlesbible.com/songs/kansas-city-hey-hey-hey-hey/
https://www.beatlesbible.com/songs/keep-your-hands-off-my-baby/
https://www.beatlesbible.com/songs/komm-gib-mir-deine-hand/
https://www.beatlesbible.com/songs/lady-madonna/
https://www.beatlesbible.com/songs/leave-my-kitten-alone/
https://www.beatlesbible.com/songs/lend-me-your-comb/
https://www.beatlesbible.com/songs/let-it-be/
https://www.beatlesbible.com/songs/like-dreamers-do/
https://www.beatlesbible.com/songs/little-child/
https://www.beatlesbible.com/songs/little-girl/
https://www.beatlesbible.com/songs/lonesome-tears-in-my-eyes/
https://www.beatlesbible.com/songs/long-long-long/
https://www.beatlesbible.com/songs/long-tall-sally/
https://www.beatlesbible.com/songs/los-paranoias/
https://www.beatlesbible.com/songs/love-me-do/
https://www.beatlesbible.com/songs/love-of-the-loved/
https://www.beatlesbible.com/songs/love-you-to/
https://www.beatlesbible.com/songs/lovely-rita/
https://www.beatlesbible.com/songs/lucille/
https://www.beatlesbible.com/songs/lucy-in-the-sky-with-diamonds/
https://www.beatlesbible.com/songs/maggie-mae/
https://www.beatlesbible.com/songs/magical-mystery-tour/
https://www.beatlesbible.com/songs/mailman-bring-me-no-more-blues/
https://www.beatlesbible.com/songs/march-of-the-meanies/
https://www.beatlesbible.com/songs/martha-my-dear/
https://www.beatlesbible.com/songs/matchbox/
https://www.beatlesbible.com/songs/maxwells-silver-hammer/
https://www.beatlesbible.com/songs/mean-mr-mustard/
https://www.beatlesbible.com/songs/memphis-tennessee/
https://www.beatlesbible.com/songs/michelle/
https://www.beatlesbible.com/songs/misery/
https://www.beatlesbible.com/songs/money-thats-what-i-want/
https://www.beatlesbible.com/songs/moonlight-bay/
https://www.beatlesbible.com/songs/mother-natures-son/
https://www.beatlesbible.com/songs/mr-moonlight/
https://www.beatlesbible.com/songs/my-bonnie/
https://www.beatlesbible.com/songs/no-reply/
https://www.beatlesbible.com/songs/nobody-i-know/
https://www.beatlesbible.com/songs/nobodys-child/
https://www.beatlesbible.com/songs/norwegian-wood-this-bird-has-flown/
https://www.beatlesbible.com/songs/not-a-second-time/
https://www.beatlesbible.com/songs/not-guilty/
https://www.beatlesbible.com/songs/nothin-shakin/
https://www.beatlesbible.com/songs/now-and-then/
https://www.beatlesbible.com/songs/nowhere-man/
https://www.beatlesbible.com/songs/ob-la-di-ob-la-da/
https://www.beatlesbible.com/songs/octopuss-garden/
https://www.beatlesbible.com/songs/oh-darling/
https://www.beatlesbible.com/songs/old-brown-shoe/
https://www.beatlesbible.com/songs/one-after-909/
https://www.beatlesbible.com/songs/one-and-one-is-two/
https://www.beatlesbible.com/songs/only-a-northern-song/
https://www.beatlesbible.com/songs/ooh-my-soul/
https://www.beatlesbible.com/songs/paperback-writer/
https://www.beatlesbible.com/songs/penny-lane/
https://www.beatlesbible.com/songs/pepperland/
https://www.beatlesbible.com/songs/pepperland-laid-waste/
https://www.beatlesbible.com/songs/piggies/
https://www.beatlesbible.com/songs/please-mister-postman/
https://www.beatlesbible.com/songs/please-please-me/
https://www.beatlesbible.com/songs/polythene-pam/
https://www.beatlesbible.com/songs/ps-i-love-you/
https://www.beatlesbible.com/songs/rain/
https://www.beatlesbible.com/songs/real-love/
https://www.beatlesbible.com/songs/revolution/
https://www.beatlesbible.com/songs/revolution-1/
https://www.beatlesbible.com/songs/revolution-9/
https://www.beatlesbible.com/songs/rip-it-up-shake-rattle-and-roll-blue-suede-shoes/
https://www.beatlesbible.com/songs/rock-and-roll-music/
https://www.beatlesbible.com/songs/rocky-raccoon/
https://www.beatlesbible.com/songs/roll-over-beethoven/
https://www.beatlesbible.com/songs/run-for-your-life/
https://www.beatlesbible.com/songs/save-the-last-dance-for-me/
https://www.beatlesbible.com/songs/savoy-truffle/
https://www.beatlesbible.com/songs/sea-of-holes/
https://www.beatlesbible.com/songs/sea-of-monsters/
https://www.beatlesbible.com/songs/sea-of-time/
https://www.beatlesbible.com/songs/searchin/
https://www.beatlesbible.com/songs/september-in-the-rain/
https://www.beatlesbible.com/songs/sexy-sadie/
https://www.beatlesbible.com/songs/sgt-peppers-lonely-hearts-club-band/
https://www.beatlesbible.com/songs/sgt-peppers-lonely-hearts-club-band-reprise/
https://www.beatlesbible.com/songs/she-came-in-through-the-bathroom-window/
https://www.beatlesbible.com/songs/she-loves-you/
https://www.beatlesbible.com/songs/she-said-she-said/
https://www.beatlesbible.com/songs/shes-a-woman/
https://www.beatlesbible.com/songs/shes-leaving-home/
https://www.beatlesbible.com/songs/shout/
https://www.beatlesbible.com/songs/sie-liebt-dich/
https://www.beatlesbible.com/songs/slow-down/
https://www.beatlesbible.com/songs/so-how-come-no-one-loves-me/
https://www.beatlesbible.com/songs/soldier-of-love/
https://www.beatlesbible.com/songs/some-other-guy/
https://www.beatlesbible.com/songs/something/
https://www.beatlesbible.com/songs/sour-milk-sea/
https://www.beatlesbible.com/songs/st-louis-blues/
https://www.beatlesbible.com/songs/step-inside-love/
https://www.beatlesbible.com/songs/strawberry-fields-forever/
https://www.beatlesbible.com/songs/sun-king/
https://www.beatlesbible.com/songs/sure-to-fall-in-love-with-you/
https://www.beatlesbible.com/songs/swanee-river/
https://www.beatlesbible.com/songs/sweet-georgia-brown/
https://www.beatlesbible.com/songs/sweet-little-sixteen/
https://www.beatlesbible.com/songs/take-good-care-of-my-baby/
https://www.beatlesbible.com/songs/take-out-some-insurance-on-me-baby/
https://www.beatlesbible.com/songs/taxman/
https://www.beatlesbible.com/songs/teddy-boy/
https://www.beatlesbible.com/songs/tell-me-what-you-see/
https://www.beatlesbible.com/songs/tell-me-why/
https://www.beatlesbible.com/songs/thank-you-girl/
https://www.beatlesbible.com/songs/that-means-a-lot/
https://www.beatlesbible.com/songs/thatll-be-the-day/
https://www.beatlesbible.com/songs/thats-all-right-mama/
https://www.beatlesbible.com/songs/the-ballad-of-john-and-yoko/
https://www.beatlesbible.com/songs/the-continuing-story-of-bungalow-bill/
https://www.beatlesbible.com/songs/the-end/
https://www.beatlesbible.com/songs/the-fool-on-the-hill/
https://www.beatlesbible.com/songs/the-hippy-hippy-shake/
https://www.beatlesbible.com/songs/the-honeymoon-song/
https://www.beatlesbible.com/songs/the-inner-light/
https://www.beatlesbible.com/songs/the-long-and-winding-road/
https://www.beatlesbible.com/songs/the-night-before/
https://www.beatlesbible.com/songs/the-saints/
https://www.beatlesbible.com/songs/the-sheik-of-araby/
https://www.beatlesbible.com/songs/the-walk/
https://www.beatlesbible.com/songs/the-word/
https://www.beatlesbible.com/songs/theres-a-place/
https://www.beatlesbible.com/songs/things-we-said-today/
https://www.beatlesbible.com/songs/think-for-yourself/
https://www.beatlesbible.com/songs/this-boy/
https://www.beatlesbible.com/songs/three-cool-cats/
https://www.beatlesbible.com/songs/ticket-to-ride/
https://www.beatlesbible.com/songs/till-there-was-you/
https://www.beatlesbible.com/songs/tip-of-my-tongue/
https://www.beatlesbible.com/songs/to-know-her-is-to-love-her/
https://www.beatlesbible.com/songs/tomorrow-never-knows/
https://www.beatlesbible.com/songs/too-much-monkey-business/
https://www.beatlesbible.com/songs/twist-and-shout/
https://www.beatlesbible.com/songs/two-of-us/
https://www.beatlesbible.com/songs/wait/
https://www.beatlesbible.com/songs/we-can-work-it-out/
https://www.beatlesbible.com/songs/what-goes-on/
https://www.beatlesbible.com/songs/what-youre-doing/
https://www.beatlesbible.com/songs/whats-the-new-mary-jane/
https://www.beatlesbible.com/songs/when-i-get-home/
https://www.beatlesbible.com/songs/when-im-sixty-four/
https://www.beatlesbible.com/songs/while-my-guitar-gently-weeps/
https://www.beatlesbible.com/songs/why/
https://www.beatlesbible.com/songs/why-dont-we-do-it-in-the-road/
https://www.beatlesbible.com/songs/wild-honey-pie/
https://www.beatlesbible.com/songs/with-a-little-help-from-my-friends/
https://www.beatlesbible.com/songs/within-you-without-you/
https://www.beatlesbible.com/songs/without-a-song/
https://www.beatlesbible.com/songs/woman/
https://www.beatlesbible.com/songs/words-of-love/
https://www.beatlesbible.com/songs/yellow-submarine/
https://www.beatlesbible.com/songs/yellow-submarine-in-pepperland/
https://www.beatlesbible.com/songs/yer-blues/
https://www.beatlesbible.com/songs/yes-it-is/
https://www.beatlesbible.com/songs/yesterday/
https://www.beatlesbible.com/songs/you-cant-do-that/
https://www.beatlesbible.com/songs/you-know-my-name-look-up-the-number/
https://www.beatlesbible.com/songs/you-know-what-to-do/
https://www.beatlesbible.com/songs/you-like-me-too-much/
https://www.beatlesbible.com/songs/you-never-give-me-your-money/
https://www.beatlesbible.com/songs/you-really-got-a-hold-on-me/
https://www.beatlesbible.com/songs/you-wont-see-me/
https://www.beatlesbible.com/songs/youll-be-mine/
https://www.beatlesbible.com/songs/young-blood/
https://www.beatlesbible.com/songs/your-mother-should-know/
https://www.beatlesbible.com/songs/youre-going-to-lose-that-girl/
https://www.beatlesbible.com/songs/youre-so-square-baby-i-dont-care/
https://www.beatlesbible.com/songs/youve-got-to-hide-your-love-away/
```

## Appendix C - Referenced album and people article URLs

Album articles (3 unique across both snapshots):

```text
https://www.beatlesbible.com/albums/a-hard-days-night/
https://www.beatlesbible.com/albums/live-at-the-bbc/
https://www.beatlesbible.com/albums/the-beatles-white-album/
```

Main people pages (4, linked from site navigation):

```text
https://www.beatlesbible.com/people/george-harrison/
https://www.beatlesbible.com/people/john-lennon/
https://www.beatlesbible.com/people/paul-mccartney/
https://www.beatlesbible.com/people/ringo-starr/
```
