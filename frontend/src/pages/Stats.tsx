import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import { statsAPI } from "../services/api";
import { Trophy, Target, Flame, TrendingUp, BarChart3 } from "lucide-react";
import type { Stats } from "../types";

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI
      .get()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12">
        <div>
          <h1 className="text-4xl font-bold text-brand-700 mb-2">
            Estadísticas
          </h1>
          <p className="text-brand-600">Análisis de tu progreso</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl p-8 shadow-xl">
            <Trophy className="w-16 h-16 mb-4" />
            <p className="text-brand-50/90 text-lg mb-2">Puntos Totales</p>
            <p className="text-6xl font-bold">{stats?.total_points || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-xl p-8 shadow-xl">
            <Flame className="w-16 h-16 mb-4" />
            <p className="text-brand-50/90 text-lg mb-2">Racha Más Larga</p>
            <p className="text-6xl font-bold">{stats?.longest_streak || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-brand-700 to-brand-800 text-white rounded-xl p-8 shadow-xl">
            <Target className="w-16 h-16 mb-4" />
            <p className="text-brand-50/90 text-lg mb-2">Hábitos Creados</p>
            <p className="text-6xl font-bold">{stats?.habits_count || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-brand-800 to-brand-900 text-white rounded-xl p-8 shadow-xl">
            <TrendingUp className="w-16 h-16 mb-4" />
            <p className="text-brand-50/90 text-lg mb-2">Completados Hoy</p>
            <p className="text-6xl font-bold">
              {stats?.habits_completed_today || 0}
            </p>
          </div>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-brand-600" />
            <h2 className="text-2xl font-bold text-brand-700">
              Resumen General
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-brand-50 rounded-xl">
              <span className="text-brand-800 font-semibold">
                Promedio de cumplimiento
              </span>
              <span className="text-brand-700 font-bold">
                {stats?.habits_count
                  ? Math.round(
                      (stats.habits_completed_today / stats.habits_count) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-brand-50 rounded-xl">
              <span className="text-brand-800 font-semibold">
                Puntos por hábito
              </span>
              <span className="text-brand-700 font-bold">
                {stats?.habits_count
                  ? Math.round(stats.total_points / stats.habits_count)
                  : 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
