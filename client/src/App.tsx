import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AppNavBar } from '@/components/AppNavBar';
import { Home } from '@/pages/Home';
import { Test } from '@/pages/Test';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppNavBar />
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
