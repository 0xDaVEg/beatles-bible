import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import songsData from '../data/songs.json';
import './Detail.css';

function SongDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const found = songsData.find((s: any) => s.slug === slug);
    setItem(found);
  }, [slug]);

  if (!item) {
    return <div className="detail"><p>Loading...</p></div>;
  }

  return (
    <div className="detail">
      <Link to="/songs" className="back-link">← Back to Songs</Link>
      <h1>{item.title}</h1>
      <div className="detail-content" dangerouslySetInnerHTML={{ __html: item.content }} />
      {item.images && item.images.length > 0 && (
        <div className="detail-images">
          <h3>Images</h3>
          {item.images.map((img: string, idx: number) => (
            <img key={idx} src={img} alt="" className="detail-image" />
          ))}
        </div>
      )}
      <div className="detail-source">
        <a href={item.url} target="_blank" rel="noopener noreferrer">View original on Beatles Bible</a>
      </div>
    </div>
  );
}

export default SongDetail;
