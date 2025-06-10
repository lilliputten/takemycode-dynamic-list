import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppNavBar } from '@/components/AppNavBar';
import { Hello } from '@/pages/Hello';
import { Home } from '@/pages/Home';
import { Test } from '@/pages/Test';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
