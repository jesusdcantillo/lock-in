from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .db import engine, SessionLocal
from .security import verify_password, create_access_token, verify_token

models.Base.metadata.create_all(bind = engine)

app = FastAPI()

# Configurar CORS
_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
frontend_origin = os.getenv("FRONTEND_ORIGIN")  # e.g. https://tu-app.vercel.app
if frontend_origin and frontend_origin not in _origins:
    _origins.append(frontend_origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
bearer_scheme = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return{
        "message": "Lock-In Backend funcionando."
    }

# Listar usuarios
@app.get("/users", response_model = list[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Obtiene una lista de usuarios con paginación"""
    return crud.get_users(db, skip = skip, limit = limit)

# Crear usuario
@app.post ("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Crea un nuevo usuario en la base de datos"""
    db_user = crud.create_user(db = db, user = user)
    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario o email ya existente")
    return db_user

# Login
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Autentica al usuario y devuelve un token JWT"""
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Usuario y/o contraseña incorrectos.")

    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Perfil del usuario
@app.get("/profile")
def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene el perfil del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "total_points": user.total_points,
        "created_at": user.created_at
    }

# Crear hábito
@app.post("/habits", response_model=schemas.HabitResponse)
def create_habit(habit: schemas.HabitCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Crea un nuevo hábito para el usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    new_habit = crud.create_habit(db=db, habit=habit, user_id=user.id)
    
    # Verificar y otorgar logros automáticamente
    crud.check_and_grant_achievements(db, user.id)
    
    return new_habit

# Listar hábitos por usuario
@app.get("/habits", response_model=list[schemas.HabitResponse])
def get_habits(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene la lista de hábitos del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return crud.get_habits_by_user(db=db, user_id=user.id)

# Obtener hábito específico
@app.get("/habits/{habit_id}", response_model=schemas.HabitResponse)
def get_habit(habit_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene un hábito específico del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    habit = crud.get_habit_by_id(db=db, habit_id=habit_id, user_id=user.id)
    if not habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado.")
    
    return habit

# Estadísticas del usuario
@app.get("/stats", response_model=schemas.StatsResponse)
def get_stats(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene las estadísticas del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return crud.get_user_stats(db=db, user_id=user.id)

# Completar hábito
@app.put("/habits/{habit_id}/complete")
def complete_habit(habit_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Marca un hábito como completado para hoy, actualiza racha y puntos"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    completed_habit, message = crud.complete_habit(db=db, habit_id=habit_id, user_id=user.id)
    
    if not completed_habit:
        raise HTTPException(status_code=404, detail=message)
    
    # Verificar y otorgar logros automáticamente después de completar
    granted_achievements = crud.check_and_grant_achievements(db, user.id)
    
    return JSONResponse(
        status_code=200,
        content={
            "habit": jsonable_encoder(completed_habit),
            "message": message,
            "achievements_granted": granted_achievements
        }
    )

# Actualizar hábito
@app.put("/habits/{habit_id}", response_model=schemas.HabitResponse)
def update_habit(habit_id: int, habit_update: schemas.HabitUpdate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Actualiza los detalles de un hábito específico del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    updated_habit = crud.update_habit(db=db, habit_id=habit_id, habit_update=habit_update, user_id=user.id)
    if not updated_habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado.")
    
    return updated_habit

# Eliminar hábito
@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Elimina un hábito específico del usuario autenticado"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    deleted_habit = crud.delete_habit(db=db, habit_id=habit_id, user_id=user.id)
    if not deleted_habit:
        raise HTTPException(status_code=404, detail="Hábito no encontrado.")
    
    return {"detail": "Hábito eliminado correctamente."}

# ===== ENDPOINTS DE LOGROS =====

# Obtener todos los logros disponibles
@app.get("/achievements", response_model=list[schemas.AchievementResponse])
def get_achievements(db: Session = Depends(get_db)):
    """Lista todos los logros disponibles en la plataforma"""
    return crud.get_all_achievements(db)

# Obtener logros del usuario autenticado
@app.get("/achievements/me", response_model=list[schemas.UserAchievementResponse])
def get_my_achievements(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene los logros que el usuario autenticado ha obtenido"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    return crud.get_user_achievements(db, user_id=user.id)

# ===== ENDPOINTS DE EVENTOS =====

# Crear evento
@app.post("/events", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Crea un nuevo evento"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    return crud.create_event(db=db, event=event, creator_id=user.id)

# Listar todos los eventos
@app.get("/events", response_model=list[schemas.EventResponse])
def get_events(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Lista todos los eventos disponibles ordenados por fecha"""
    return crud.get_all_events(db, skip=skip, limit=limit)

# Obtener detalles de un evento específico
@app.get("/events/{event_id}", response_model=schemas.EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Obtiene los detalles de un evento específico: nombre, descripción, ubicación, fecha y creador"""
    event = crud.get_event_by_id(db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado.")
    
    return event

# Marcar asistencia a un evento
@app.post("/events/{event_id}/attend")
def attend_event(event_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Registra la asistencia del usuario autenticado a un evento"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    attendance, message = crud.attend_event(db=db, event_id=event_id, user_id=user.id)
    
    if not attendance:
        raise HTTPException(status_code=400, detail=message)
    
    return {"message": message}

# Obtener asistentes de un evento (solo para el creador)
@app.get("/events/{event_id}/attendees", response_model=list[schemas.AttendeeResponse])
def get_event_attendees(event_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene la lista de asistentes de un evento (solo accesible para el creador del evento)"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    # Debug: imprimir información
    event = crud.get_event_by_id(db, event_id=event_id)
    print(f"DEBUG - Usuario actual ID: {user.id}, Username: {user.username}")
    print(f"DEBUG - Evento ID: {event_id}, Creator ID: {event.creator_id if event else 'No event'}")
    print(f"DEBUG - Es creador: {crud.is_event_creator(db, event_id=event_id, user_id=user.id)}")
    
    # Verificar que el usuario sea el creador del evento
    if not crud.is_event_creator(db, event_id=event_id, user_id=user.id):
        raise HTTPException(status_code=403, detail=f"Solo el creador del evento puede ver los asistentes. Tu ID: {user.id}, Creator ID: {event.creator_id if event else 'unknown'}")
    
    return crud.get_event_attendees(db, event_id=event_id)

# Actualizar descripción de evento (solo creador)
@app.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(event_id: int, event_update: schemas.EventUpdate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    updated, message = crud.update_event_description(db=db, event_id=event_id, user_id=user.id, description=event_update.description)
    if not updated:
        raise HTTPException(status_code=403, detail=message)
    return updated

# Eliminar evento (solo creador)
@app.delete("/events/{event_id}")
def delete_event(event_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    ok, message = crud.delete_event(db=db, event_id=event_id, user_id=user.id)
    if not ok:
        raise HTTPException(status_code=403, detail=message)
    return {"detail": message}