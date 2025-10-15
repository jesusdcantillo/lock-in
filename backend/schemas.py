from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

class Config:
    from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    completed: bool = False

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class HabitResponse(HabitBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True