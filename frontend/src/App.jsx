import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Vacas from './pages/Vacas';
import Producao from './pages/Producao';
import Sanitario from './pages/Sanitario';
import Despesas from './pages/Despesas';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vacas" element={<Vacas />} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/sanitario" element={<Sanitario />} />
            <Route path="/despesas" element={<Despesas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
