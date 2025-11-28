import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { eventsAPI } from "../services/api";
import { Calendar, MapPin, FileText, Plus, ArrowLeft } from "lucide-react";

export default function NewEvent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !location.trim()) {
      setError("El nombre, la fecha y la ubicación son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await eventsAPI.create({
        name: name.trim(),
        description: description.trim() || undefined,
        location: location.trim(),
        date: date,
      });
      navigate("/events");
    } catch (err) {
      setError("Error al crear el evento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-brand-600 hover:text-brand-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-brand-700">Crear Evento</h1>
        </div>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-brand-700 font-semibold mb-2 flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Nombre del Evento *
              </label>
              <Input
                id="name"
                label=""
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Meetup de Productividad"
                maxLength={100}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-brand-700 font-semibold mb-2"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors resize-none"
                placeholder="Ej: Evento para compartir técnicas de productividad y crear hábitos saludables"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-brand-600 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-brand-700 font-semibold mb-2 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Ubicación *
              </label>
              <Input
                id="location"
                label=""
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Centro Comunitario, Calle Principal 123"
                maxLength={200}
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-brand-700 font-semibold mb-2 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Fecha y Hora *
              </label>
              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !name.trim() || !date}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {loading ? "Creando..." : "Crear Evento"}
              </Button>
              <Link to="/events">
                <Button variant="secondary">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Card>

        <div className="bg-brand-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-brand-700 mb-2">💡 Consejos</h2>
          <ul className="space-y-2 text-brand-700">
            <li>• Elige un nombre descriptivo y atractivo para tu evento</li>
            <li>• Incluye todos los detalles importantes en la descripción</li>
            <li>
              • Especifica la ubicación exacta para facilitar la asistencia
            </li>
            <li>
              • Los participantes podrán registrarse para asistir a tu evento
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
