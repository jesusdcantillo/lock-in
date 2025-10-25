from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Boolean
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

    # Relación inversa con Habit
    habits = relationship("Habit", back_populates="owner")

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