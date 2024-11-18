import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ConsolePage } from './pages/ConsolePage';
import { EmbedPage } from './pages/Embed';
import './App.scss';

function App() {
  return (
    <Router>
      <div data-component="App">
        <nav>
          <Link to="/">Console</Link>
          <Link to="/embed">Embed</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ConsolePage />} />
          <Route path="/embed" element={<EmbedPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
