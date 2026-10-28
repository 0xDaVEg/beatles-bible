import { Link } from 'react-router-dom';
import historyData from '../data/history.json';
import type { ArchiveItem } from '../lib/archive';
import { listableItems } from '../lib/archive';
import './List.css';

const items = listableItems(historyData as unknown as ArchiveItem[]);

function HistoryList() {
  return (
    <div className="list">
      <h1>History</h1>
      <p className="list-count">{items.length} entries</p>
      <div className="list-items">
        {items.map((item) => (
          <Link key={item.path} to={item.path} className="list-item">
            {item.date && <span className="list-date">{item.date}</span>}
            <span className="list-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
