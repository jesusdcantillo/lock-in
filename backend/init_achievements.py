from sqlalchemy.orm import Session
from db import SessionLocal
from models import Achievement  # Usa el modelo real del proyecto

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

def seed_achievements(force: bool = False) -> int:
    """Inserta los logros si la tabla está vacía. Si force=True, borra y vuelve a insertar.
    Devuelve la cantidad de logros insertados (0 si ya existían y force=False)."""
    db: Session = SessionLocal()
    inserted = 0
    try:
        existing = db.query(Achievement).count()
        if existing > 0 and not force:
            return 0
        if existing > 0 and force:
            db.query(Achievement).delete()
            db.commit()
        for ach in ACHIEVEMENTS:
            db.add(Achievement(**ach))
        db.commit()
        inserted = len(ACHIEVEMENTS)
        return inserted
    except Exception as e:
        db.rollback()
        print(f"[seed_achievements] Error: {e}")
        return 0
    finally:
        db.close()

if __name__ == "__main__":
    count = seed_achievements(force=True)
    print(f"Logros reinicializados: {count}")
