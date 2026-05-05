import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Vacas from "./pages/Vacas";
import Producao from "./pages/Producao";
import Sanitario from "./pages/Sanitario";
import Despesas from "./pages/Despesas";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      {/* ALTERAÇÃO: Envolvido com AuthProvider para gerenciar autenticação global */}
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {/* ALTERAÇÃO: Navbar agora mostra apenas para usuários autenticados */}
          <Routes>
            {/* Rotas públicas (sem autenticação) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas (requer autenticação) */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
