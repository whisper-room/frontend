import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Join from './routes/Join';
import Login from './routes/Login';
import Chatroom from './routes/Chatroom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatroom" element={<Chatroom />} />
      </Routes>
    </Router>
  );
}

export default App;
