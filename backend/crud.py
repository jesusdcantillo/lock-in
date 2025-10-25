import random
from datetime import datetime, date, timedelta
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
    points = random.randint(10, 100)
    db_habit = models.Habit(**habit.model_dump(), owner_id=user_id, points=points, completed=False, streak=0, last_completed=None)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

# Obtener hábitos por usuario
def get_habits_by_user(db: Session, user_id: int):
    habits = db.query(models.Habit).filter(models.Habit.owner_id == user_id).all()
    today = date.today()
    changed = False

    for i in habits:
        if i.last_completed is None:
            if i.completed:
                i.completed = False
                changed = True
        else:
            if i.last_completed.date() != today and i.completed:
                i.completed = False
                changed = True
    if changed:
        db.commit()
    return habits

# Completar hábito (marcar como completado hoy, actualizar racha y puntos)
def complete_habit(db: Session, habit_id: int, user_id: int):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.owner_id == user_id).first()
    if not habit:
        return None, "Hábito no encontrado."
    
    now = datetime.now()
    today = now.date()

    # Si ya fue complteado hoy, no vuelve a sumar
    if habit.last_completed and habit.last_completed.date() == today:
        return habit, "Hábito ya completado hoy."
    
    # Determinar si la última vez que se completó fue ayer - Sumar streak
    yesterday = today - timedelta(days=1)
    if habit.last_completed and habit.last_completed.date() == yesterday:
        habit.streak += 1
    else:
        habit.streak = 1  # Reiniciar streak si no fue ayer

    habit.completed = True
    habit.last_completed = now

    # Actualizar puntos del user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.total_points += habit.points

    db.commit()
    db.refresh(habit)
    db.refresh(user)
    return habit, "Hábito completado con éxito."
    
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

# Obtener estadísticas del usuario
def get_user_stats(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None

    habits = db.query(models.Habit).filter(models.Habit.owner_id == user_id).all()
    habits_count = len(habits)
    total_points = user.total_points
    today = date.today()
    habits_completed_today = sum(1 for habit in habits if habit.last_completed and habit.last_completed.date() == today)
    longest_streak = max((habit.streak for habit in habits), default=0)

    return {
        "total_points": total_points,
        "habits_count": habits_count,
        "habits_completed_today": habits_completed_today,
        "longest_streak": longest_streak,
    }