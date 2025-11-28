import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { achievementsAPI } from "../services/api";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import type { Achievement, UserAchievement } from "../types";

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([achievementsAPI.getAll(), achievementsAPI.getMine()])
      .then(([all, mine]) => {
        setAllAchievements(all);
        setUserAchievements(mine);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isUnlocked = (achievementId: number) => {
    return userAchievements.some((ua) => ua.achievement.id === achievementId);
  };

  const getUnlockedDate = (achievementId: number) => {
    const ua = userAchievements.find(
      (ua) => ua.achievement.id === achievementId
    );
    return ua ? new Date(ua.obtained_at).toLocaleDateString("es-ES") : null;
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
            Logros
          </h1>
          <p className="text-orange-700">
            {userAchievements.length} de {allAchievements.length} desbloqueados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const date = getUnlockedDate(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`rounded-xl p-6 shadow-lg transition ${
                  unlocked
                    ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                    : "bg-white border-2 border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  {unlocked ? (
                    <CheckCircle className="w-12 h-12" />
                  ) : (
                    <Lock className="w-12 h-12 text-orange-300" />
                  )}
                  <Trophy
                    className={`w-10 h-10 ${
                      unlocked ? "text-yellow-200" : "text-orange-300"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    unlocked ? "text-white" : "text-orange-800"
                  }`}
                >
                  {achievement.name}
                </h3>
                <p className={unlocked ? "text-orange-50" : "text-orange-700"}>
                  {achievement.description}
                </p>

                {unlocked && date && (
                  <p className="mt-4 text-sm text-orange-100">
                    Desbloqueado el {date}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
