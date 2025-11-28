import random
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash, verify_password

# Crear usuario
def create_user(db: Session, user: schemas.UserCreate):
    # Verificar si el usuario ya existe
    existing_user = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    
    if existing_user:
        return None
    
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

# Obtener hábito por ID
def get_habit_by_id(db: Session, habit_id: int, user_id: int):
    return db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.owner_id == user_id).first()

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

    # Si ya fue completado hoy
    if habit.last_completed and habit.last_completed.date() == today:
        return habit, "Hábito ya completado hoy."
    
    # Determinar si la última vez que se completó fue ayer - Sumar racha
    yesterday = today - timedelta(days=1)
    if habit.last_completed and habit.last_completed.date() == yesterday:
        habit.streak += 1
    else:
        habit.streak = 1  # Reiniciar racha si no fue ayer

    habit.completed = True
    habit.last_completed = now

    # Actualizar puntos del user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.total_points += habit.points

    db.commit()
    db.refresh(habit)
    db.refresh(user)
    
    return habit, "Hábito completado correctamente."
    
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

# ===== LOGROS =====

# Obtener todos los logros disponibles
def get_all_achievements(db: Session):
    return db.query(models.Achievement).all()

# Obtener logros de un usuario
def get_user_achievements(db: Session, user_id: int):
    return db.query(models.UserAchievement).filter(models.UserAchievement.user_id == user_id).all()

# Verifica si un usuario tiene un logro
def user_has_achievement(db: Session, user_id: int, achievement_key: str):
    achievement = db.query(models.Achievement).filter(models.Achievement.key == achievement_key).first()
    if not achievement:
        return False
    
    user_achievement = db.query(models.UserAchievement).filter(
        models.UserAchievement.user_id == user_id,
        models.UserAchievement.achievement_id == achievement.id
    ).first()
    
    return user_achievement is not None

# Asignar logro a un usuario
def grant_achievement(db: Session, user_id: int, achievement_key: str):
    # Verificar si ya tiene el logro
    if user_has_achievement(db, user_id, achievement_key):
        return None
    
    # Obtener el logro
    achievement = db.query(models.Achievement).filter(models.Achievement.key == achievement_key).first()
    if not achievement:
        return None
    
    # Crear la relación
    user_achievement = models.UserAchievement(
        user_id=user_id,
        achievement_id=achievement.id
    )
    db.add(user_achievement)
    db.commit()
    db.refresh(user_achievement)
    return user_achievement

# Verificar y otorgar logros automáticamente
def check_and_grant_achievements(db: Session, user_id: int):

    granted = []
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return granted
    
    habits = db.query(models.Habit).filter(models.Habit.owner_id == user_id).all()
    
    # 1. Primer Paso - Crea tu primer hábito
    if len(habits) >= 1 and not user_has_achievement(db, user_id, "first_step"):
        achievement = grant_achievement(db, user_id, "first_step")
        if achievement:
            granted.append("first_step")
    
    # 2. Día Productivo - Completa al menos un hábito en un mismo día
    today = date.today()
    habits_completed_today = sum(1 for h in habits if h.last_completed and h.last_completed.date() == today)
    if habits_completed_today >= 1 and not user_has_achievement(db, user_id, "productive_day"):
        achievement = grant_achievement(db, user_id, "productive_day")
        if achievement:
            granted.append("productive_day")
    
    # 3. Semana de Constancia - Racha de 7 días
    max_streak = max((h.streak for h in habits), default=0)
    if max_streak >= 7 and not user_has_achievement(db, user_id, "week_consistency"):
        achievement = grant_achievement(db, user_id, "week_consistency")
        if achievement:
            granted.append("week_consistency")
    
    # 4. Hábito Formado - Completa un mismo hábito 21 veces
    max_completions = max((h.streak for h in habits), default=0)
    if max_completions >= 21 and not user_has_achievement(db, user_id, "habit_formed"):
        achievement = grant_achievement(db, user_id, "habit_formed")
        if achievement:
            granted.append("habit_formed")
    
    # 5. Maestro de la Rutina - Completa todos tus hábitos del día durante 5 días consecutivos
    if len(habits) > 0:
        all_habits_good_streak = all(h.streak >= 5 for h in habits)
        if all_habits_good_streak and not user_has_achievement(db, user_id, "routine_master"):
            achievement = grant_achievement(db, user_id, "routine_master")
            if achievement:
                granted.append("routine_master")
    
    # 6. Subiendo de Nivel - Alcanza 500 puntos
    if user.total_points >= 500 and not user_has_achievement(db, user_id, "leveling_up"):
        achievement = grant_achievement(db, user_id, "leveling_up")
        if achievement:
            granted.append("leveling_up")
    
    # 7. Creador de Ritmo - Crea 5 hábitos diferentes
    if len(habits) >= 5 and not user_has_achievement(db, user_id, "rhythm_creator"):
        achievement = grant_achievement(db, user_id, "rhythm_creator")
        if achievement:
            granted.append("rhythm_creator")
    
    # 8. Constancia Legendaria - Racha de 30 días
    if max_streak >= 30 and not user_has_achievement(db, user_id, "legendary_consistency"):
        achievement = grant_achievement(db, user_id, "legendary_consistency")
        if achievement:
            granted.append("legendary_consistency")
    
    return granted

# Crear evento
def create_event(db: Session, event: schemas.EventCreate, creator_id: int):
    db_event = models.Event(**event.model_dump(), creator_id=creator_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Obtener todos los eventos
def get_all_events(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Event).order_by(models.Event.date).offset(skip).limit(limit).all()

# Obtener evento por ID
def get_event_by_id(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

# Marcar asistencia a un evento
def attend_event(db: Session, event_id: int, user_id: int):
    # Verificar si el evento existe
    event = get_event_by_id(db, event_id)
    if not event:
        return None, "Evento no encontrado."
    
    # Verificar si el usuario ya está registrado
    existing_attendance = db.query(models.EventAttendee).filter(
        models.EventAttendee.event_id == event_id,
        models.EventAttendee.user_id == user_id
    ).first()
    
    if existing_attendance:
        return None, "Ya estás registrado en este evento."
    
    # Crear la asistencia
    attendance = models.EventAttendee(event_id=event_id, user_id=user_id)
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    return attendance, "Asistencia registrada correctamente."

# Obtener asistentes de un evento
def get_event_attendees(db: Session, event_id: int):
    attendees = db.query(models.User).join(
        models.EventAttendee, 
        models.EventAttendee.user_id == models.User.id
    ).filter(
        models.EventAttendee.event_id == event_id
    ).all()
    
    return attendees

# Verificar si un usuario es el creador de un evento
def is_event_creator(db: Session, event_id: int, user_id: int):
    event = get_event_by_id(db, event_id)
    if not event:
        return False
    return event.creator_id == user_id