import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import {
  Home,
  Target,
  BarChart3,
  Trophy,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/habits", icon: Target, label: "Hábitos" },
    { path: "/stats", icon: BarChart3, label: "Estadísticas" },
    { path: "/achievements", icon: Trophy, label: "Logros" },
    { path: "/events", icon: Calendar, label: "Eventos" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/dashboard"
              className="text-3xl font-bold text-orange-600 title"
            >
              LOCK IN
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-muted font-semibold hidden sm:block">
                {user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-primary">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${
                    isActive ? "active" : ""
                  } flex items-center gap-2 whitespace-nowrap`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">{children}</main>
    </div>
  );
}
