// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import PostGigPage from './pages/PostGigPage';
import ExploreGig from './pages/ExploreGig';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreGig />} />
          <Route path="/post" element={<PostGigPage />} />
          {/* Future: <Route path="/post" element={<PostGigPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
