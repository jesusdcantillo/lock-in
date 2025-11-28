import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
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
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link to="/habits" className="text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-orange-600 title">
            Nuevo Hábito
          </h1>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-orange-700 font-semibold mb-2"
              >
                Nombre del Hábito *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Ej: Hacer ejercicio"
                maxLength={100}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-orange-700 font-semibold mb-2"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                placeholder="Ej: 30 minutos de cardio o pesas"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-orange-600 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {loading ? "Creando..." : "Crear Hábito"}
              </button>
              <Link
                to="/habits"
                className="px-6 py-3 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        <div className="bg-orange-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-orange-700 mb-2">
            💡 Consejos
          </h2>
          <ul className="space-y-2 text-orange-700">
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
