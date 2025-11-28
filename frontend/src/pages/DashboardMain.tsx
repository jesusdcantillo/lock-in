import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { habitsAPI, statsAPI } from "../services/api";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Flame,
  Trophy,
} from "lucide-react";
import type { Habit, Stats } from "../types";

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsData, statsData] = await Promise.all([
        habitsAPI.getAll(),
        statsAPI.get(),
      ]);
      setHabits(habitsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: number) => {
    try {
      await habitsAPI.complete(habitId);
      loadData();
    } catch (error) {
      console.error("Error completing habit:", error);
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
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-orange-600 title mb-2">
            Dashboard
          </h1>
          <p className="text-orange-700">Tu resumen del día</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">
                {stats?.total_points || 0}
              </span>
            </div>
            <p className="text-orange-700 font-medium">Puntos Totales</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">
                {stats?.habits_completed_today || 0}
              </span>
            </div>
            <p className="text-orange-700 font-medium">Hábitos Hoy</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">
                {stats?.longest_streak || 0}
              </span>
            </div>
            <p className="text-orange-700 font-medium">Racha Máxima</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">
                {stats?.habits_count || 0}
              </span>
            </div>
            <p className="text-orange-700 font-medium">Total Hábitos</p>
          </div>
        </div>

        {/* Habits List */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-600">Mis Hábitos</h2>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <p className="text-orange-700 text-lg">No tienes hábitos aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 border-2 border-orange-200 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      disabled={habit.completed}
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-orange-300 hover:text-orange-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-lg ${
                          habit.completed
                            ? "text-gray-500 line-through"
                            : "text-orange-800"
                        }`}
                      >
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-orange-600 text-sm">
                          {habit.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-orange-600">
                          🔥 {habit.streak} días
                        </span>
                        <span className="text-orange-600">
                          ⭐ {habit.points} puntos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/stats"
            className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl p-6 shadow-lg"
          >
            <TrendingUp className="w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold mb-2">Estadísticas</h3>
            <p className="text-orange-50">Ver tu progreso</p>
          </Link>

          <Link
            to="/achievements"
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg"
          >
            <Trophy className="w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold mb-2">Logros</h3>
            <p className="text-orange-50">Desbloquea recompensas</p>
          </Link>

          <Link
            to="/events"
            className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl p-6 shadow-lg"
          >
            <Target className="w-10 h-10 mb-3" />
            <h3 className="text-xl font-bold mb-2">Eventos</h3>
            <p className="text-orange-50">Conecta con otros</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
