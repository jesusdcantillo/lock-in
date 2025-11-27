import sys
import os

# Agregar el directorio padre al path para los imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Text
from db import SessionLocal, engine, Base

# Definir el modelo Achievement aquí para evitar imports relativos
class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    key = Column(String, unique=True, index=True)

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

# Logros predefinidos
ACHIEVEMENTS = [
    {
        "name": "Primer Paso",
        "description": "Crea tu primer hábito.",
        "key": "first_step"
    },
    {
        "name": "Día Productivo",
        "description": "Completa al menos un hábito en un mismo día.",
        "key": "productive_day"
    },
    {
        "name": "Semana de Constancia",
        "description": "Mantén una racha de 7 días completando al menos un hábito por día.",
        "key": "week_consistency"
    },
    {
        "name": "Hábito Formado",
        "description": "Completa un mismo hábito 21 veces.",
        "key": "habit_formed"
    },
    {
        "name": "Maestro de la Rutina",
        "description": "Completa todos tus hábitos del día durante 5 días consecutivos.",
        "key": "routine_master"
    },
    {
        "name": "Subiendo de Nivel",
        "description": "Alcanza 500 puntos en total.",
        "key": "leveling_up"
    },
    {
        "name": "Creador de Ritmo",
        "description": "Crea 5 hábitos diferentes.",
        "key": "rhythm_creator"
    },
    {
        "name": "Constancia Legendaria",
        "description": "Mantén una racha de 30 días consecutivos completando al menos un hábito por día.",
        "key": "legendary_consistency"
    }
]

def init_achievements():

    db: Session = SessionLocal()
    
    try:
        # Verificar si ya existen logros
        existing_count = db.query(Achievement).count()
        
        if existing_count > 0:
            print(f"Ya existen {existing_count} logros en la base de datos.")
            print("¿Deseas sobrescribir? (s/n): ", end="")
            response = input().lower()
            
            if response != 's':
                print("Operación cancelada.")
                return
            
            # Eliminar logros existentes
            db.query(Achievement).delete()
            db.commit()
            print("Logros anteriores eliminados.")
        
        # Insertar los logros predefinidos
        for achievement_data in ACHIEVEMENTS:
            achievement = Achievement(**achievement_data)
            db.add(achievement)
        
        db.commit()
        print(f"\n {len(ACHIEVEMENTS)} logros inicializados correctamente:")
        
        for ach in ACHIEVEMENTS:
            print(f"  - {ach['name']}: {ach['description']}")
        
        print("\n Sistema de logros listo")
        
    except Exception as e:
        print(f" Error al inicializar logros: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Inicializador de Logros\n")
    init_achievements()
