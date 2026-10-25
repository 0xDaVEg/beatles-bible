import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import peopleData from '../data/people.json';
import './Detail.css';

function PersonDetail() {
  const { slug, page } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    // Try to find the main page first
    const baseSlug = slug?.replace(/-\d+$/, '');
    let found = peopleData.find((p: any) => p.slug === baseSlug || p.slug === slug);
    
    // If page is specified and different, look for it
    if (page && page !== '1') {
      const pageSlug = baseSlug ? baseSlug + '-' + page : slug + '-' + page;
      const foundPage = peopleData.find((p: any) => p.slug === pageSlug);
      if (foundPage) {
        found = foundPage;
      }
    } else if (slug && slug.match(/-\d+$/)) {
      const foundPage = peopleData.find((p: any) => p.slug === slug);
      if (foundPage) {
        found = foundPage;
      }
    }
    
    setItem(found);
  }, [slug, page]);

  if (!item) {
    return <div className="detail"><p>Loading...</p></div>;
  }

  return (
    <div className="detail">
      <Link to="/people" className="back-link">← Back to People</Link>
      <h1>{item.title.replace(/ – .*$/, '').replace(/ - .*$/, '')}</h1>
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

export default PersonDetail;
