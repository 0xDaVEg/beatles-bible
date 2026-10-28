import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HistoryList from './pages/HistoryList';
import HistoryDetail from './pages/HistoryDetail';
import SongsList from './pages/SongsList';
import SongDetail from './pages/SongDetail';
import AlbumsList from './pages/AlbumsList';
import AlbumDetail from './pages/AlbumDetail';
import PeopleList from './pages/PeopleList';
import PersonDetail from './pages/PersonDetail';
import Search from './components/Search';
import './App.css';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      id = hash.slice(1);
    }

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <Link to="/" className="nav-logo">Beatles Bible Archive</Link>
            <Search />
            <div className="nav-links">
              <Link to="/history">History</Link>
              <Link to="/songs">Songs</Link>
              <Link to="/albums">Albums</Link>
              <Link to="/people">People</Link>
            </div>
          </div>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<HistoryList />} />
            <Route path="/history/:year/:month/:day/:slug" element={<HistoryDetail />} />
            <Route path="/history/:year/:month/:day/:slug/:page" element={<HistoryDetail />} />
            <Route path="/:year/:month/:day/:slug" element={<HistoryDetail />} />
            <Route path="/:year/:month/:day/:slug/:page" element={<HistoryDetail />} />
            <Route path="/songs" element={<SongsList />} />
            <Route path="/songs/:slug" element={<SongDetail />} />
            <Route path="/songs/:slug/:page" element={<SongDetail />} />
            <Route path="/albums" element={<AlbumsList />} />
            <Route path="/albums/:slug" element={<AlbumDetail />} />
            <Route path="/albums/:slug/:page" element={<AlbumDetail />} />
            <Route path="/people" element={<PeopleList />} />
            <Route path="/people/:slug" element={<PersonDetail />} />
            <Route path="/people/:slug/:page" element={<PersonDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
