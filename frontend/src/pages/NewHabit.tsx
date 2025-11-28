import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { habitsAPI } from "../services/api";
import { Plus, ArrowLeft } from "lucide-react";

export default function NewHabit() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await habitsAPI.create({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      navigate("/habits");
    } catch (err) {
      setError("Error al crear el hábito");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <Link to="/habits" className="text-brand-600 hover:text-brand-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-brand-700">Nuevo Hábito</h1>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-brand-700 font-semibold mb-2"
              >
                Nombre del Hábito *
              </label>
              <Input
                id="name"
                label=""
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Hacer ejercicio"
                maxLength={100}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-brand-700 font-semibold mb-2"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors resize-none"
                placeholder="Ej: 30 minutos de cardio o pesas"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-brand-600 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {loading ? "Creando..." : "Crear Hábito"}
              </Button>
              <Link to="/habits">
                <Button variant="secondary">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Card>

        <div className="bg-brand-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-brand-700 mb-2">💡 Consejos</h2>
          <ul className="space-y-2 text-brand-700">
            <li>• Sé específico con el nombre del hábito</li>
            <li>• Usa la descripción para detallar cómo y cuándo realizarlo</li>
            <li>• Completa tu hábito diariamente para aumentar tu racha</li>
            <li>• Cada hábito completado suma 10 puntos</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
