import { Link } from 'react-router-dom';
import songsData from '../data/songs.json';
import type { ArchiveItem } from '../lib/archive';
import { listableItems } from '../lib/archive';
import './List.css';

const items = listableItems(songsData as unknown as ArchiveItem[]);

function SongsList() {
  return (
    <div className="list">
      <h1>Songs</h1>
      <p className="list-count">{items.length} songs</p>
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

export default SongsList;
