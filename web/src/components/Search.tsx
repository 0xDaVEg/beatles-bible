import { useState } from 'react';
import { Link } from 'react-router-dom';
import historyData from '../data/history.json';
import songsData from '../data/songs.json';
import albumsData from '../data/albums.json';
import type { ArchiveItem } from '../lib/archive';
import { listableItems } from '../lib/archive';
import './Search.css';

interface SearchResult {
  type: string;
  title: string;
  path: string;
}

const historyItems = listableItems(historyData as unknown as ArchiveItem[]);
const songItems = listableItems(songsData as unknown as ArchiveItem[]);
const albumItems = listableItems(albumsData as unknown as ArchiveItem[]);

function Search() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  if (q.length >= 2) {
    songItems.forEach((item) => {
      if (item.title.toLowerCase().includes(q)) {
        results.push({ type: 'Song', title: item.title, path: item.path });
      }
    });

    albumItems.forEach((item) => {
      if (item.title.toLowerCase().includes(q)) {
        results.push({ type: 'Album', title: item.title, path: item.path });
      }
    });

    historyItems.forEach((item) => {
      if (item.title.toLowerCase().includes(q)) {
        results.push({ type: 'History', title: item.title, path: item.path });
      }
    });
  }

  const visibleResults = results.slice(0, 30);
  const showPanel = showResults && q.length >= 2;

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search songs, albums, history..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setShowResults(value.trim().length >= 2);
        }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onFocus={() => setShowResults(q.length >= 2)}
      />
      {showPanel && visibleResults.length > 0 && (
        <div className="search-results">
          {visibleResults.map((result) => (
            <Link
              key={`${result.type}-${result.path}`}
              to={result.path}
              className="search-result-item"
              onClick={() => {
                setQuery('');
                setShowResults(false);
              }}
            >
              <span className="search-result-type">{result.type}</span>
              <span className="search-result-title">{result.title}</span>
            </Link>
          ))}
        </div>
      )}
      {showPanel && visibleResults.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">No results found</div>
        </div>
      )}
    </div>
  );
}

export default Search;
