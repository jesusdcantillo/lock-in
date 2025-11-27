from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    total_points = Column(Integer, default=0)
    created_at = Column(String, default=datetime.today().isoformat())

    # Relaciones
    habits = relationship("Habit", back_populates="owner")
    user_achievements = relationship("UserAchievement", back_populates="user")
    created_events = relationship("Event", back_populates="creator")
    event_attendances = relationship("EventAttendee", back_populates="user")

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    streak = Column(Integer, default=0)
    points = Column(Integer, default=0)
    last_completed = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relación con User
    owner = relationship("User", back_populates="habits")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    key = Column(String, unique=True, index=True)  # Identificador único para verificación
    
    # Relación con UserAchievement
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    obtained_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    date = Column(DateTime)
    creator_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    creator = relationship("User", back_populates="created_events")
    attendees = relationship("EventAttendee", back_populates="event")

class EventAttendee(Base):
    __tablename__ = "event_attendees"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    attended_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    event = relationship("Event", back_populates="attendees")
    user = relationship("User", back_populates="event_attendances")