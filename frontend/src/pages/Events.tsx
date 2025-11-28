import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { eventsAPI } from "../services/api";
import { Calendar, MapPin, User, Clock, Plus } from "lucide-react";
import type { Event } from "../types";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI
      .getAll()
      .then(setEvents)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-orange-600 title mb-2">
              Eventos
            </h1>
            <p className="text-orange-700">Conecta con la comunidad</p>
          </div>
          <Link
            to="/events/new"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Crear Evento
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-orange-700 text-lg">
              No hay eventos disponibles
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {new Date(event.date).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-orange-800 mb-2">
                  {event.name}
                </h3>

                {event.description && (
                  <p className="text-orange-700 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {event.location && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-orange-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      Por {event.creator.username}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
