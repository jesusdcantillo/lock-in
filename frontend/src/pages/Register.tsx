import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch {
      setError("Error al crear la cuenta. El usuario o email ya existe");
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
            <UserPlus className="w-16 h-16 text-brand-600 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-700">
              Registrarse
            </h1>
            <p className="text-brand-600 mt-2">Crea tu cuenta en LOCK IN</p>
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
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              autoComplete="username"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} fullWidth>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <p className="text-center mt-6 text-brand-700">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-semibold hover:underline"
            >
              Inicia sesión
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
