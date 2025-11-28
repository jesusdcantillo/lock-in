import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { habitsAPI } from "../services/api";
import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Habit } from "../types";

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    habitsAPI
      .getAll()
      .then(setHabits)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await habitsAPI.complete(id);
      loadHabits();
    } catch (error) {
      console.error("Error al completar hábito:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este hábito?")) return;
    try {
      await habitsAPI.delete(id);
      loadHabits();
    } catch (error) {
      console.error("Error al eliminar hábito:", error);
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

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-brand-700">Mis Hábitos</h1>
            <p className="text-brand-600 mt-1">
              {habits.length} hábitos activos
            </p>
          </div>
          <Link to="/habits/new" className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nuevo Hábito
            </Button>
          </Link>
        </div>

        {habits.length === 0 ? (
          <Card className="text-center p-12">
            <Circle className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <p className="text-xl text-brand-700 mb-2">No tienes hábitos aún</p>
            <p className="text-brand-600">
              ¡Crea tu primer hábito para comenzar tu viaje!
            </p>
            <Link to="/habits/new" className="inline-block mt-6">
              <Button>Crear Hábito</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                className="hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(habit.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {habit.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    ) : (
                      <Circle className="w-8 h-8 text-brand-300 hover:text-brand-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <Link to={`/habits/${habit.id}`}>
                      <h3 className="text-xl font-bold text-brand-800 hover:text-brand-600 transition-colors">
                        {habit.name}
                      </h3>
                    </Link>
                    {habit.description && (
                      <p className="text-brand-700 mt-1">{habit.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-brand-600" />
                        <span className="text-brand-700 font-semibold">
                          Racha: {habit.streak} días
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-brand-600" />
                        <span className="text-brand-700 font-semibold">
                          Puntos: {habit.points}
                        </span>
                      </div>
                      {habit.last_completed && (
                        <span className="text-brand-600 text-sm">
                          Última vez:{" "}
                          {new Date(habit.last_completed).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      to={`/habits/${habit.id}`}
                      className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
