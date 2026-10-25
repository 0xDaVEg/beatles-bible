import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import historyData from '../data/history.json';
import './Detail.css';

function HistoryDetail() {
  const { year, month, day, slug } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const found = historyData.find((h: any) => 
      h.url.includes(`/${year}/${month}/${day}/${slug}/`)
    );
    setItem(found);
  }, [year, month, day, slug]);

  if (!item) {
    return <div className="detail"><p>Loading...</p></div>;
  }

  return (
    <div className="detail">
      <Link to="/history" className="back-link">← Back to History</Link>
      {item.date && <div className="detail-date">{item.date}</div>}
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

export default HistoryDetail;
