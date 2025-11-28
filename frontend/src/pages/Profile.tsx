import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12">
        <div>
          <h1 className="text-4xl font-bold text-brand-700 mb-2">Mi Perfil</h1>
          <p className="text-brand-600">Información de tu cuenta</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-brand-800 mb-1">
                {profile?.username}
              </h2>
              <div className="flex items-center gap-2 text-brand-600 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Miembro desde{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("es-ES")
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>

          {/* Stats Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Trophy className="w-12 h-12" />
                <div>
                  <p className="text-brand-50/90">Puntos Totales</p>
                  <p className="text-4xl font-bold">
                    {stats?.total_points || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <Flame className="w-8 h-8 text-brand-600 mb-2" />
                <p className="text-brand-700 mb-1">Racha Máxima</p>
                <p className="text-3xl font-bold text-brand-700">
                  {stats?.longest_streak || 0}
                </p>
              </Card>

              <Card>
                <Trophy className="w-8 h-8 text-brand-600 mb-2" />
                <p className="text-brand-700 mb-1">Logros</p>
                <p className="text-3xl font-bold text-brand-700">
                  {achievements.length}
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold text-brand-700 mb-4">
              Logros Recientes
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((ua) => (
                <div key={ua.id} className="p-4 bg-brand-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-brand-600" />
                    <h3 className="font-bold text-brand-800">
                      {ua.achievement.name}
                    </h3>
                  </div>
                  <p className="text-sm text-brand-700">
                    {ua.achievement.description}
                  </p>
                  <p className="text-xs text-brand-600 mt-2">
                    {new Date(ua.obtained_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
