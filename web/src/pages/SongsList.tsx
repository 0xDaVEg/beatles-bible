import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import songsData from '../data/songs.json';
import './List.css';

function SongsList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(songsData);
  }, []);

  return (
    <div className="list">
      <h1>Songs</h1>
      <p className="list-count">{items.length} songs</p>
      <div className="list-items">
        {items.map((item: any) => {
          const path = item.url.replace('https://www.beatlesbible.com', '');
          return (
            <Link key={item.url} to={path} className="list-item">
              <span className="list-title">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SongsList;
