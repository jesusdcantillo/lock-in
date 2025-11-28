import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { authAPI, statsAPI, achievementsAPI } from "../services/api";
import { User as UserIcon, Trophy, Flame, Mail, Calendar } from "lucide-react";
import type { Stats, UserAchievement, User } from "../types";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getProfile(),
      statsAPI.get(),
      achievementsAPI.getMine(),
    ])
      .then(([prof, st, ach]) => {
        setProfile(prof);
        setStats(st);
        setAchievements(ach);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            Mi Perfil
          </h1>
          <p className="text-orange-700">Información de tu cuenta</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-orange-800 mb-1">
                {profile?.username}
              </h2>
              <div className="flex items-center gap-2 text-orange-600 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Miembro desde{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("es-ES")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Trophy className="w-12 h-12" />
                <div>
                  <p className="text-orange-100">Puntos Totales</p>
                  <p className="text-4xl font-bold">
                    {stats?.total_points || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Flame className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-orange-700 mb-1">Racha Máxima</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats?.longest_streak || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Trophy className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-orange-700 mb-1">Logros</p>
                <p className="text-3xl font-bold text-orange-600">
                  {achievements.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Logros Recientes
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((ua) => (
                <div key={ua.id} className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-orange-500" />
                    <h3 className="font-bold text-orange-800">
                      {ua.achievement.name}
                    </h3>
                  </div>
                  <p className="text-sm text-orange-700">
                    {ua.achievement.description}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    {new Date(ua.obtained_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
