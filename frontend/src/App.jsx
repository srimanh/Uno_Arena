import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx';
import RulesPage from './Pages/RulesPage.jsx';
import SignupPage from './Pages/SignupPage.jsx';
import GamePage from './Pages/GamePage.jsx';
import AuthSuccess from './Pages/AuthSuccess';

import './Styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/BluePrint" element={<RulesPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/game/:roomCode" element={<GamePage />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
