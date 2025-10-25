from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    total_points: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class HabitResponse(HabitBase):
    id: int
    owner_id: int
    completed: bool
    streak: int
    points: int
    last_completed: Optional[datetime] = None

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_points: int
    habits_count: int
    habits_completed_today: int
    longest_streak: int