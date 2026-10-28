import { Link, useLocation } from 'react-router-dom';
import songsData from '../data/songs.json';
import Pagination from '../components/Pagination';
import type { ArchiveItem } from '../lib/archive';
import { findItem, handleContentClick } from '../lib/archive';
import './Detail.css';

const items = songsData as unknown as ArchiveItem[];

function SongDetail() {
  const location = useLocation();
  const item = findItem(items, location.pathname);

  if (!item) {
    return (
      <div className="detail">
        <p>Page not found.</p>
        <Link to="/songs" className="back-link">← Back to Songs</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <Link to="/songs" className="back-link">← Back to Songs</Link>
      <h1>{item.title}</h1>
      <Pagination item={item} />
      <div
        className="detail-content"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
      <Pagination item={item} />
      <div className="detail-source">
        <a href={item.url} target="_blank" rel="noopener noreferrer">View original on Beatles Bible</a>
      </div>
    </div>
  );
}

export default SongDetail;
