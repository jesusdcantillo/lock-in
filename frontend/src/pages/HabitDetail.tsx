import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { habitsAPI, achievementsAPI } from "../services/api";
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
      const before = await achievementsAPI.getMine();
      await habitsAPI.complete(parseInt(id));
      await loadHabit();
      const after = await achievementsAPI.getMine();
      const beforeIds = new Set(before.map((ua: any) => ua.achievement.id));
      const newlyUnlocked = after.filter(
        (ua: any) => !beforeIds.has(ua.achievement.id)
      );
      if (newlyUnlocked.length > 0) {
        alert(
          `¡Has desbloqueado: ${newlyUnlocked
            .map((ua: any) => ua.achievement.name)
            .join(", ")}! 🎉`
        );
      }
    } catch (error) {
      console.error("Error al completar:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  if (!habit) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-brand-700">Hábito no encontrado</p>
          <Link to="/habits" className="mt-4 inline-block">
            <Button variant="secondary">Volver a mis hábitos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <Link to="/habits" className="text-brand-600 hover:text-brand-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 text-4xl font-bold text-brand-700 border-b-2 border-brand-200 focus:border-brand-500 focus:outline-none px-2 py-1"
            />
          ) : (
            <h1 className="text-4xl font-bold text-brand-700">{habit.name}</h1>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl p-6 shadow-lg">
            <Flame className="w-8 h-8 mb-2" />
            <p className="text-brand-50/90 mb-1">Racha Actual</p>
            <p className="text-4xl font-bold">{habit.streak}</p>
            <p className="text-brand-50/90 text-sm">días consecutivos</p>
          </div>

          <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-xl p-6 shadow-lg">
            <Trophy className="w-8 h-8 mb-2" />
            <p className="text-brand-50/90 mb-1">Puntos</p>
            <p className="text-4xl font-bold">{habit.points}</p>
            <p className="text-brand-50/90 text-sm">acumulados</p>
          </div>

          <div className="bg-gradient-to-br from-brand-700 to-brand-800 text-white rounded-xl p-6 shadow-lg">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-brand-50/90 mb-1">Estado</p>
            <p className="text-2xl font-bold">
              {habit.completed ? "Completado" : "Pendiente"}
            </p>
            <p className="text-brand-50/90 text-sm">hoy</p>
          </div>
        </div>

        {/* Description Card */}
        <Card>
          <h2 className="text-2xl font-bold text-brand-700 mb-4">
            Descripción
          </h2>
          {editing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Agrega una descripción..."
            />
          ) : (
            <p className="text-brand-800 leading-relaxed">
              {habit.description || "Sin descripción"}
            </p>
          )}

          {habit.last_completed && (
            <div className="mt-4 pt-4 border-t border-brand-100">
              <p className="text-brand-700">
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
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1"
              >
                <Save className="w-5 h-5" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(habit.name);
                  setDescription(habit.description || "");
                }}
                className="px-6 py-3 border-2 border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <Button
                onClick={handleComplete}
                disabled={habit.completed}
                className="flex-1"
              >
                <CheckCircle2 className="w-5 h-5" />
                {habit.completed ? "Completado Hoy" : "Marcar como Completado"}
              </Button>
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 border-2 border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors font-semibold"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
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
