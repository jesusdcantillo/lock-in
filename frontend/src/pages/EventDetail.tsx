import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { eventsAPI } from "../services/api";
import { MapPin, Calendar, User, Users, ArrowLeft } from "lucide-react";
import type { Event } from "../types";
import { useAuth } from "../contexts/useAuth";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    eventsAPI
      .getById(parseInt(id))
      .then((evt) => {
        setEvent(evt);
        setDescription(evt.description || "");
      })
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

  const handleSave = async () => {
    if (!id) return;
    try {
      const updated = await eventsAPI.update(parseInt(id), {
        description: description.trim() || undefined,
      });
      setEvent(updated);
      setEditing(false);
      setMessage("Evento actualizado correctamente");
      setTimeout(() => setMessage(""), 2500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Error al actualizar";
      setMessage(errorMsg);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      await eventsAPI.delete(parseInt(id));
      setMessage("Evento eliminado correctamente");
      // Opcional: redirigir a /events; aquí solo mostramos mensaje
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Error al eliminar";
      setMessage(errorMsg);
      console.error(error);
    }
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

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-brand-700">Evento no encontrado</p>
          <Link to="/events" className="mt-4 inline-block">
            <Button variant="secondary">Volver a eventos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-brand-600 hover:text-brand-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-brand-700">{event.name}</h1>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-700 mb-2">
                Descripción
              </h2>
              {editing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="Actualiza la descripción del evento"
                />
              ) : (
                <p className="text-brand-800 leading-relaxed">
                  {event.description || "Sin descripción"}
                </p>
              )}
              {user?.username === event.creator.username && (
                <div className="flex gap-3 mt-4">
                  {editing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        className="flex items-center gap-2"
                      >
                        Guardar Cambios
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditing(false);
                          setDescription(event.description || "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => setEditing(true)}
                      >
                        Editar Descripción
                      </Button>
                      <button
                        onClick={handleDelete}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                      >
                        Eliminar Evento
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-brand-600 mt-1" />
                <div>
                  <p className="font-semibold text-brand-700">Fecha y Hora</p>
                  <p className="text-brand-600">
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
                <MapPin className="w-6 h-6 text-brand-600 mt-1" />
                <div>
                  <p className="font-semibold text-brand-700">Ubicación</p>
                  <p className="text-brand-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-6 h-6 text-brand-600 mt-1" />
                <div>
                  <p className="font-semibold text-brand-700">Organizador</p>
                  <p className="text-brand-600">{event.creator.username}</p>
                </div>
              </div>

              {/* Removed inline attendees preview; main button below handles access */}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleAttend} disabled={attending}>
                {attending ? "Registrando..." : "Asistir al Evento"}
              </Button>

              <Link
                to={`/events/${event.id}/attendees`}
                className="bg-brand-50 text-brand-700 px-6 py-3 rounded-xl hover:bg-brand-100 transition-colors font-semibold inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Ver Asistentes
              </Link>
            </div>

            {message && (
              <Alert variant={message.includes("Error") ? "error" : "success"}>
                {message}
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
