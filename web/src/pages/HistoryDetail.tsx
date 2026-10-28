import { Link, useLocation } from 'react-router-dom';
import historyData from '../data/history.json';
import Pagination from '../components/Pagination';
import type { ArchiveItem } from '../lib/archive';
import { findItem, handleContentClick } from '../lib/archive';
import './Detail.css';

const items = historyData as unknown as ArchiveItem[];

function HistoryDetail() {
  const location = useLocation();
  const item = findItem(items, location.pathname);

  if (!item) {
    return (
      <div className="detail">
        <p>Page not found.</p>
        <Link to="/history" className="back-link">← Back to History</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <Link to="/history" className="back-link">← Back to History</Link>
      <h1>{item.title}</h1>
      {item.date && <p className="detail-date">{item.date}</p>}
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

export default HistoryDetail;
