import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import historyData from '../data/history.json';
import './Detail.css';

function HistoryDetail() {
  const { year, month, day, slug, page } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    let found = null;
    const fullSlug = slug || year;
    
    if (page) {
      const pageNum = parseInt(page);
      if (pageNum > 1 && year && month && day && slug) {
        found = historyData.find((p: any) => p.url && p.url.includes(`/${year}/${month}/${day}/${slug}/${pageNum}/`));
        if (!found) {
          found = historyData.find((p: any) => p.slug === fullSlug + '-' + pageNum);
        }
      }
    }
    
    if (!found && year && month && day && slug) {
      found = historyData.find((p: any) => p.slug === fullSlug && (!p.url || !p.url.match(/\/\d+\/$/)));
    } else if (!found) {
      found = historyData.find((p: any) => p.slug === slug);
    }
    
    if (!found) {
      found = historyData.find((p: any) => p.slug === slug);
    }
    
    setItem(found);
  }, [year, month, day, slug, page]);

  if (!item) {
    return <div className="detail"><p>Loading...</p></div>;
  }

  return (
    <div className="detail">
      <Link to="/history" className="back-link">← Back to History</Link>
      <h1>{item.title}</h1>
      {item.date && <p className="detail-date">{item.date}</p>}
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
