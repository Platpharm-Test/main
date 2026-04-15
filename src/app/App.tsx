import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import DashboardV2 from './pages/DashboardV2';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/1" element={<DashboardV2 />} />
      </Routes>
    </BrowserRouter>
  );
}
