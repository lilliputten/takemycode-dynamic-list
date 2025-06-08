import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { Home } from '@/pages/Home';
import { Test } from '@/pages/Test';

function App() {
  return (
    <BrowserRouter>
      <nav className="flex items-center justify-center gap-3">
        <Link to="/">Test</Link>
        <Link to="/home">Home</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
