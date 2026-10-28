import { Link } from 'react-router-dom';
import albumsData from '../data/albums.json';
import type { ArchiveItem } from '../lib/archive';
import { listableItems } from '../lib/archive';
import './List.css';

const items = listableItems(albumsData as unknown as ArchiveItem[]);

function AlbumsList() {
  return (
    <div className="list">
      <h1>Albums</h1>
      <p className="list-count">{items.length} albums</p>
      <div className="list-items">
        {items.map((item) => (
          <Link key={item.path} to={item.path} className="list-item">
            <span className="list-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AlbumsList;
