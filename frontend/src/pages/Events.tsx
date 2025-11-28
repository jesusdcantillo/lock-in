import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-brand-700 mb-2">Eventos</h1>
            <p className="text-brand-600">Conecta con la comunidad</p>
          </div>
          <Link to="/events/new" className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Evento
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <p className="text-brand-700 text-lg">No hay eventos disponibles</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Calendar className="w-8 h-8 text-brand-600" />
                  <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold border border-brand-200">
                    {new Date(event.date).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-brand-800 mb-2">
                  {event.name}
                </h3>

                {event.description && (
                  <p className="text-brand-700 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {event.location && (
                    <div className="flex items-center gap-2 text-brand-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-brand-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-brand-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      Por {event.creator.username}
                    </span>
                  </div>
                </div>

                <Link to={`/events/${event.id}`} className="block w-full">
                  <Button fullWidth>Ver detalles</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
