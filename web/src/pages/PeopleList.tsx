import { Link } from 'react-router-dom';
import peopleData from '../data/people.json';
import type { ArchiveItem } from '../lib/archive';
import { listableItems } from '../lib/archive';
import './List.css';

const items = listableItems(peopleData as unknown as ArchiveItem[]);

function PeopleList() {
  return (
    <div className="list">
      <h1>People</h1>
      <p className="list-count">{items.length} people</p>
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

export default PeopleList;
