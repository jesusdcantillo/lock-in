from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash, verify_password

# Crear usuario
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username = user.username, email = user.email, hashed_password = hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Obtener usuarios
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

# Obtener usuario por nombre de usuario
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Autenticar usuario
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None
    return user

# Crear hábito
def create_habit(db: Session, habit: schemas.HabitCreate, user_id: int):
    db_habit = models.Habit(**habit.model_dump(), owner_id=user_id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

# Obtener hábitos por usuario
def get_habits_by_user(db: Session, user_id: int):
    return db.query(models.Habit).filter(models.Habit.owner_id == user_id).all()

# Actualizar hábito
def update_habit(db: Session, habit_id: int, habit_update: schemas.HabitUpdate, user_id: int):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.owner_id == user_id).first()
    if not habit:
        return None

    update_data = habit_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(habit, key, value)
    db.commit()
    db.refresh(habit)
    return habit

# Eliminar hábito
def delete_habit(db: Session, habit_id: int, user_id: int):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.owner_id == user_id).first()
    if not habit:
        return None
    db.delete(habit)
    db.commit()
    return habit