import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Alert variant="error" className="inline-block text-left">
            {error}
          </Alert>
          <div className="mt-4">
            <Link to={`/events/${id}`}>
              <Button variant="secondary">Volver al evento</Button>
            </Link>
          </div>
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
            className="text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-brand-700">
              Lista de Asistentes
            </h1>
            <p className="text-brand-600 mt-1">
              {attendees.length} personas registradas
            </p>
          </div>
        </div>

        {attendees.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <p className="text-xl text-brand-700">
              No hay asistentes registrados aún
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {attendees.map((attendee) => (
              <Card
                key={attendee.id}
                className="p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-brand-800 truncate">
                      {attendee.username}
                    </h3>
                    <div className="flex items-center gap-2 text-brand-600 mt-1">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{attendee.email}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
