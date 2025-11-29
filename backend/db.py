import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Permite usar una base de datos externa si se define DATABASE_URL, 
# y por defecto usa SQLite local.
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    # Supabase requiere SSL; usar connect_args apropiado para Postgres
    if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"sslmode": "require"})
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'lockin.db')}"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()