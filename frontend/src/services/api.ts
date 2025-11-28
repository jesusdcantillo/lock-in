import axios from "axios";
import type {
  LoginCredentials,
  RegisterData,
  Habit,
  Stats,
  Achievement,
  UserAchievement,
  Event,
  Attendee,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post("/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },
};

// Habits
export const habitsAPI = {
  getAll: async (): Promise<Habit[]> => {
    const response = await api.get("/habits");
    return response.data;
  },

  getById: async (id: number): Promise<Habit> => {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
  }): Promise<Habit> => {
    const response = await api.post("/habits", data);
    return response.data;
  },

  update: async (
    id: number,
    data: { name?: string; description?: string; completed?: boolean }
  ): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, data);
    return response.data;
  },

  complete: async (id: number) => {
    const response = await api.put(`/habits/${id}/complete`);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },
};

// Stats
export const statsAPI = {
  get: async (): Promise<Stats> => {
    const response = await api.get("/stats");
    return response.data;
  },
};

// Achievements
export const achievementsAPI = {
  getAll: async (): Promise<Achievement[]> => {
    const response = await api.get("/achievements");
    return response.data;
  },

  getMine: async (): Promise<UserAchievement[]> => {
    const response = await api.get("/achievements/me");
    return response.data;
  },
};

// Events
export const eventsAPI = {
  getAll: async (skip = 0, limit = 50): Promise<Event[]> => {
    const response = await api.get(`/events?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    location?: string;
    date: string;
  }): Promise<Event> => {
    const response = await api.post("/events", data);
    return response.data;
  },

  attend: async (id: number) => {
    const response = await api.post(`/events/${id}/attend`);
    return response.data;
  },

  getAttendees: async (id: number): Promise<Attendee[]> => {
    const response = await api.get(`/events/${id}/attendees`);
    return response.data;
  },

  update: async (
    id: number,
    data: { description?: string }
  ): Promise<Event> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default api;
