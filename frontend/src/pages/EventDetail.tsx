import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { eventsAPI } from "../services/api";
import { MapPin, Calendar, User, Users, ArrowLeft } from "lucide-react";
import type { Event } from "../types";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    eventsAPI
      .getById(parseInt(id))
      .then(setEvent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAttend = async () => {
    if (!id) return;
    setAttending(true);
    try {
      await eventsAPI.attend(parseInt(id));
      setMessage("¡Te has registrado exitosamente!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Error al registrarse";
      setMessage(errorMsg);
      console.error("Error completo:", error);
    } finally {
      setAttending(false);
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

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-orange-700">Evento no encontrado</p>
          <Link
            to="/events"
            className="text-orange-500 underline mt-4 inline-block"
          >
            Volver a eventos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-orange-600 title">
            {event.name}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-orange-700 mb-2">
                Descripción
              </h2>
              <p className="text-orange-800 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-orange-700">Fecha y Hora</p>
                  <p className="text-orange-600">
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-orange-700">Ubicación</p>
                  <p className="text-orange-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-orange-700">Organizador</p>
                  <p className="text-orange-600">{event.creator.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-orange-700">Asistentes</p>
                  <p className="text-orange-600">Ver lista de asistentes</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAttend}
                disabled={attending}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-semibold"
              >
                {attending ? "Registrando..." : "Asistir al Evento"}
              </button>

              <Link
                to={`/events/${event.id}/attendees`}
                className="bg-orange-100 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-200 transition-colors font-semibold inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Ver Asistentes
              </Link>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
