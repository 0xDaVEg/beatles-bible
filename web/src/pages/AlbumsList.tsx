import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import albumsData from '../data/albums.json';
import './List.css';

function AlbumsList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(albumsData);
  }, []);

  return (
    <div className="list">
      <h1>Albums</h1>
      <p className="list-count">{items.length} albums</p>
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

export default AlbumsList;
