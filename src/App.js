
import './App.css';
import { BrowserRouter,HashRouter ,Routes, Route } from 'react-router-dom';
import Login from './Login';
import Chat from './Chat';
function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
