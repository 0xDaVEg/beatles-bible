import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import historyData from '../data/history.json';
import songsData from '../data/songs.json';
import albumsData from '../data/albums.json';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const q = query.toLowerCase();
    const songMatches: any[] = [];
    const albumMatches: any[] = [];
    const historyMatches: any[] = [];

    historyData.forEach((item: any) => {
      if (item.title.toLowerCase().includes(q)) {
        historyMatches.push({
          type: 'History',
          title: item.title,
          subtitle: item.date,
          path: item.url.replace('https://www.beatlesbible.com', '')
        });
      }
    });

    songsData.forEach((item: any) => {
      if (item.title.toLowerCase().includes(q)) {
        songMatches.push({
          type: 'Song',
          title: item.title,
          subtitle: item.title,
          path: item.url.replace('https://www.beatlesbible.com', '')
        });
      }
    });

    albumsData.forEach((item: any) => {
      if (item.title.toLowerCase().includes(q)) {
        albumMatches.push({
          type: 'Album',
          title: item.title,
          subtitle: item.title,
          path: item.url.replace('https://www.beatlesbible.com', '')
        });
      }
    });

    const matches = [...songMatches, ...albumMatches, ...historyMatches];
    setResults(matches.slice(0, 30));
    setShowResults(true);
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search songs, albums, history..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((result, idx) => (
            <Link
              key={idx}
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
      {showResults && results.length === 0 && query.length >= 2 && (
        <div className="search-results">
          <div className="search-no-results">No results found</div>
        </div>
      )}
    </div>
  );
}

export default Search;
