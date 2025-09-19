import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './sections/hero';
import Signup from './components/signup';
import Login from './components/login';
import Home from './sections/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;