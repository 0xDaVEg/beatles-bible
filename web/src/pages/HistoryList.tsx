import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import historyData from '../data/history.json';
import './List.css';

function HistoryList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(historyData);
  }, []);

  return (
    <div className="list">
      <h1>History</h1>
      <p className="list-count">{items.length} entries</p>
      <div className="list-items">
        {items.map((item: any) => {
          const path = item.url.replace('https://www.beatlesbible.com', '');
          return (
            <Link key={item.url} to={path} className="list-item">
              {item.date && <span className="list-date">{item.date}</span>}
              <span className="list-title">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryList;
