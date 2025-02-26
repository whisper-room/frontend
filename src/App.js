import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Join from './Join';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </Router>
  );
}

export default App;
