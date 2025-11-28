import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
            <LogIn className="w-16 h-16 text-brand-600 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-700">
              Iniciar Sesión
            </h1>
            <p className="text-brand-600 mt-2">Bienvenido de vuelta</p>
          </div>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} fullWidth>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <p className="text-center mt-6 text-brand-700">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-brand-600 font-semibold hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>

          <Link
            to="/"
            className="block text-center mt-4 text-brand-700 hover:underline"
          >
            ← Volver al inicio
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
