from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .db import engine, SessionLocal
from .security import verify_password, create_access_token, verify_token

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

@app.get("/users", response_model = list[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip = skip, limit = limit)

@app.post ("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db = db, user = user)

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Usuario y/o contraseña incorrectos.")

    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/profile")
def get_profile(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    return {"message": "Bienvenido a tu perfil.", "user": payload["sub"]}