import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12 pb-12">
        <div>
          <h1 className="text-4xl font-bold text-brand-700 mb-2">Logros</h1>
          <p className="text-brand-600">
            {userAchievements.length} de {allAchievements.length} desbloqueados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const date = getUnlockedDate(achievement.id);

            return (
              <Card
                key={achievement.id}
                className={`p-6 transition ${
                  unlocked
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white"
                    : "border border-brand-100"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  {unlocked ? (
                    <CheckCircle className="w-12 h-12" />
                  ) : (
                    <Lock className="w-12 h-12 text-brand-300" />
                  )}
                  <Trophy
                    className={`w-10 h-10 ${
                      unlocked ? "text-yellow-200" : "text-brand-300"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    unlocked ? "text-white" : "text-brand-800"
                  }`}
                >
                  {achievement.name}
                </h3>
                <p className={unlocked ? "text-brand-50/90" : "text-brand-700"}>
                  {achievement.description}
                </p>

                {unlocked && date && (
                  <p className="mt-4 text-sm text-brand-50/90">
                    Desbloqueado el {date}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
