import { Link } from "react-router-dom";
import { Flame, Target, Trophy, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-bold text-orange-600 mb-6 title">
            Lock In
          </h1>
          <p className="text-3xl md:text-4xl text-orange-800 mb-4 font-semibold">
            Transforma tu salud
          </p>
          <p className="text-lg md:text-xl text-orange-700 mb-12 max-w-2xl mx-auto">
            Lock In promueve una vida activa y saludable a través de metas
            diarias y desafíos motivadores para todos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-orange-500 border-2 border-orange-500 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Registrarme
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
          {[
            {
              icon: Flame,
              title: "Construye Hábitos",
              desc: "Crea y mantén hábitos saludables cada día",
            },
            {
              icon: Target,
              title: "Metas Diarias",
              desc: "Completa desafíos y alcanza tus objetivos",
            },
            {
              icon: Trophy,
              title: "Logros",
              desc: "Desbloquea logros y sube de nivel",
            },
            {
              icon: Users,
              title: "Comunidad",
              desc: "Conecta con otros en eventos locales",
            },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <benefit.icon className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-orange-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-orange-700">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-orange-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            <p className="flex items-center gap-2">
              <span>📞</span> (123) 456-7890
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span> contact@lockin.com
            </p>
          </div>
          <p className="text-orange-200">
            © 2025 Lock In. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
