import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import peopleData from '../data/people.json';
import './List.css';

function PeopleList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(peopleData);
  }, []);

  return (
    <div className="list">
      <h1>People</h1>
      <p className="list-count">{items.length} people</p>
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

export default PeopleList;
