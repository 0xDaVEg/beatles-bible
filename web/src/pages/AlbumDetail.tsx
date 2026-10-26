import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import albumsData from '../data/albums.json';
import './Detail.css';

function AlbumDetail() {
  const { slug, page } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    let found = null;
    
    if (page) {
      const pageNum = parseInt(page);
      if (pageNum > 1) {
        found = albumsData.find((p: any) => p.url && p.url.includes(`/${slug}/${pageNum}/`));
        if (!found) {
          found = albumsData.find((p: any) => p.slug === slug + '-' + pageNum);
        }
      } else {
        found = albumsData.find((p: any) => p.slug === slug && (!p.url || !p.url.match(/\/\d+\/$/)));
      }
    } else {
      found = albumsData.find((p: any) => p.slug === slug && (!p.url || !p.url.match(/\/\d+\/$/)));
    }
    
    if (!found) {
      found = albumsData.find((p: any) => p.slug === slug);
    }
    
    setItem(found);
  }, [slug, page]);

  if (!item) {
    return <div className="detail"><p>Loading...</p></div>;
  }

  return (
    <div className="detail">
      <Link to="/albums" className="back-link">← Back to Albums</Link>
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

export default AlbumDetail;
