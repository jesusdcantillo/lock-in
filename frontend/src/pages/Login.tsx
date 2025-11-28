import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { LogIn } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <LogIn className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-orange-600 title">
            Iniciar Sesión
          </h1>
          <p className="text-orange-700 mt-2">Bienvenido de vuelta</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-orange-800 font-semibold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-orange-800 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center mt-6 text-orange-700">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center mt-4 text-orange-600 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
