import { Link } from "react-router-dom";
import { Flame, Target, Trophy, Users } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="title text-6xl md:text-7xl font-extrabold text-brand-700 mb-6 tracking-wide">
            LOCK IN
          </h1>
          <p className="text-2xl md:text-3xl text-brand-700 mb-4 font-semibold">
            Transforma tu salud
          </p>
          <p className="text-lg md:text-xl text-brand-600 mb-12 max-w-2xl mx-auto">
            LOCK IN promueve una vida activa y saludable a través de metas
            diarias y desafíos motivadores para todos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 py-3 text-lg">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-8 py-3 text-lg"
              >
                Registrarme
              </Button>
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
            <Card
              key={idx}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <benefit.icon className="w-12 h-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-brand-700">{benefit.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-800 text-white py-4 md:py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            <p className="flex items-center gap-2">
              <span>📞</span> (123) 456-7890
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span> contact@lockin.com
            </p>
          </div>
          <p className="text-brand-100/80">
            © 2025 LOCK IN. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
