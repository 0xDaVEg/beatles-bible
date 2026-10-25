import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>The Beatles Bible Archive</h1>
      <p className="home-description">
        A mobile-friendly archive of Beatles Bible content - History, Songs, Albums, and People.
      </p>
      <div className="home-sections">
        <Link to="/history" className="home-card">
          <h2>History</h2>
          <p>Day by day history of The Beatles</p>
        </Link>
        <Link to="/songs" className="home-card">
          <h2>Songs</h2>
          <p>Complete A-Z list of Beatles songs</p>
        </Link>
        <Link to="/albums" className="home-card">
          <h2>Albums</h2>
          <p>Albums and releases</p>
        </Link>
        <Link to="/people" className="home-card">
          <h2>People</h2>
          <p>The people in The Beatles' story</p>
        </Link>
      </div>
      <p className="home-footer">
        <small>Content sourced from <a href="https://www.beatlesbible.com/" target="_blank" rel="noopener noreferrer">beatlesbible.com</a></small>
      </p>
    </div>
  );
}

export default Home;
