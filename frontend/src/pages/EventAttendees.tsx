import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { eventsAPI } from "../services/api";
import { Users, ArrowLeft, Mail, User as UserIcon } from "lucide-react";
import type { Attendee } from "../types";

export default function EventAttendees() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    eventsAPI
      .getAttendees(parseInt(id))
      .then(setAttendees)
      .catch((err) => {
        console.error("Error completo:", err);
        console.error("Response data:", err.response?.data);
        console.error("Status:", err.response?.status);
        if (err.response?.status === 403) {
          setError(
            err.response?.data?.detail ||
              "Solo el creador del evento puede ver la lista de asistentes"
          );
          setTimeout(() => navigate(`/events/${id}`), 2000);
        } else {
          setError(
            "Error al cargar asistentes: " +
              (err.response?.data?.detail || err.message)
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <Link to={`/events/${id}`} className="text-orange-500 underline">
            Volver al evento
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link
            to={`/events/${id}`}
            className="text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-orange-600 title">
              Lista de Asistentes
            </h1>
            <p className="text-orange-700 mt-1">
              {attendees.length} personas registradas
            </p>
          </div>
        </div>

        {attendees.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg text-center">
            <Users className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-xl text-orange-700">
              No hay asistentes registrados aún
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-orange-800 truncate">
                      {attendee.username}
                    </h3>
                    <div className="flex items-center gap-2 text-orange-600 mt-1">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{attendee.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
