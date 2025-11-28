import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { habitsAPI } from "../services/api";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  Save,
  Trash2,
} from "lucide-react";
import type { Habit } from "../types";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    habitsAPI
      .getById(parseInt(id))
      .then((h) => {
        setHabit(h);
        setName(h.name);
        setDescription(h.description || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const loadHabit = () => {
    if (!id) return;
    habitsAPI
      .getById(parseInt(id))
      .then((h) => {
        setHabit(h);
        setName(h.name);
        setDescription(h.description || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = async () => {
    if (!id || !name.trim()) return;
    setSaving(true);
    try {
      await habitsAPI.update(parseInt(id), {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setEditing(false);
      loadHabit();
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("¿Estás seguro de eliminar este hábito?")) return;
    try {
      await habitsAPI.delete(parseInt(id));
      navigate("/habits");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    try {
      await habitsAPI.complete(parseInt(id));
      loadHabit();
    } catch (error) {
      console.error("Error al completar:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (!habit) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-orange-700">Hábito no encontrado</p>
          <Link
            to="/habits"
            className="text-orange-500 underline mt-4 inline-block"
          >
            Volver a mis hábitos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link to="/habits" className="text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 text-4xl font-bold text-orange-600 title border-b-2 border-orange-300 focus:border-orange-500 focus:outline-none px-2 py-1"
            />
          ) : (
            <h1 className="text-4xl font-bold text-orange-600 title">
              {habit.name}
            </h1>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl p-6 shadow-lg">
            <Flame className="w-8 h-8 mb-2" />
            <p className="text-orange-100 mb-1">Racha Actual</p>
            <p className="text-4xl font-bold">{habit.streak}</p>
            <p className="text-orange-100 text-sm">días consecutivos</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <Trophy className="w-8 h-8 mb-2" />
            <p className="text-orange-100 mb-1">Puntos</p>
            <p className="text-4xl font-bold">{habit.points}</p>
            <p className="text-orange-100 text-sm">acumulados</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl p-6 shadow-lg">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-orange-100 mb-1">Estado</p>
            <p className="text-2xl font-bold">
              {habit.completed ? "Completado" : "Pendiente"}
            </p>
            <p className="text-orange-100 text-sm">hoy</p>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">
            Descripción
          </h2>
          {editing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Agrega una descripción..."
            />
          ) : (
            <p className="text-orange-800 leading-relaxed">
              {habit.description || "Sin descripción"}
            </p>
          )}

          {habit.last_completed && (
            <div className="mt-4 pt-4 border-t border-orange-100">
              <p className="text-orange-700">
                <strong>Última vez completado:</strong>{" "}
                {new Date(habit.last_completed).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(habit.name);
                  setDescription(habit.description || "");
                }}
                className="px-6 py-3 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleComplete}
                disabled={habit.completed}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {habit.completed ? "Completado Hoy" : "Marcar como Completado"}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
