import { ConsolePage } from './pages/ConsolePage';
import { SplashPage } from './pages/SplashPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.scss';

function App() {
  return (
    <div data-component="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route 
            path="/postcards" 
            element={
              <ProtectedRoute>
                <ConsolePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
