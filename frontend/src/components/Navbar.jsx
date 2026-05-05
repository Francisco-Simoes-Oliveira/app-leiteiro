import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { to: "/", label: "🏠 Dashboard" },
  { to: "/vacas", label: "🐄 Vacas" },
  { to: "/producao", label: "🥛 Produção" },
  { to: "/sanitario", label: "💉 Sanitário" },
  { to: "/despesas", label: "💰 Despesas" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ALTERAÇÃO: Adicionado função de handleLogout e redirecionamento
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xl font-bold tracking-wide">🐄 App Leiteiro</span>
        <div className="flex gap-1 flex-wrap">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-white text-green-700" : "hover:bg-green-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        {/* ALTERAÇÃO: Adicionado seção de usuário e logout */}
        <div className="flex items-center gap-3">
          <span className="text-sm">👤 {user?.nome}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
