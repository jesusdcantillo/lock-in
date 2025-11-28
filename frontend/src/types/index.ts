export interface User {
  id: number;
  username: string;
  email: string;
  total_points: number;
  created_at: string;
}

export interface Habit {
  id: number;
  name: string;
  description: string | null;
  completed: boolean;
  streak: number;
  points: number;
  last_completed: string | null;
  owner_id: number;
}

export interface Stats {
  total_points: number;
  habits_count: number;
  habits_completed_today: number;
  longest_streak: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  key: string;
}

export interface UserAchievement {
  id: number;
  achievement: Achievement;
  obtained_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  date: string;
  creator_id: number;
  creator: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
}

export interface Attendee {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
