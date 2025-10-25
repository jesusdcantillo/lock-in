from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .db import engine, SessionLocal
from .security import verify_password, create_access_token, verify_token
from datetime import datetime, date

models.Base.metadata.create_all(bind = engine)

app = FastAPI()
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
    return crud.get_users(db, skip = skip, limit = limit)

# Crear usuario
@app.post ("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db = db, user = user)

# Login
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Usuario y/o contraseña incorrectos.")

    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Perfil del usuario
@app.get("/profile")
def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return {
        "message": f"Bienvenido, {user.username}!",
        "user": {
            "email": user.email,
            "created_at": user.created_at
        }
    }

# Crear hábito
@app.post("/habits", response_model=schemas.HabitResponse)
def create_habit(habit: schemas.HabitCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return crud.create_habit(db=db, habit=habit, user_id=user.id)

# Listar hábitos por usuario
@app.get("/habits", response_model=list[schemas.HabitResponse])
def get_habits(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return crud.get_habits_by_user(db=db, user_id=user.id)

# Estadísticas del usuario
@app.get("/stats", response_model=schemas.StatsResponse)
def get_stats(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return crud.get_user_stats(db=db, user_id=user.id)

# Completar hábito
@app.put("/habits/{habit_id}/complete", response_model=schemas.HabitResponse)
def complete_habit(habit_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    user = crud.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    completed_habit, error = crud.complete_habit(db=db, habit_id=habit_id, user_id=user.id)
    if error:
        raise HTTPException(status_code=404, detail=error)
    
    return completed_habit

# Actualizar hábito
@app.put("/habits/{habit_id}", response_model=schemas.HabitResponse)
def update_habit(habit_id: int, habit_update: schemas.HabitUpdate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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