# 🎯 Lock-In

**Tu compañero definitivo para construir hábitos y alcanzar tus metas**

Lock-In es una aplicación web moderna diseñada para ayudarte a crear, rastrear y mantener hábitos saludables a través de un sistema de gamificación, eventos comunitarios y estadísticas detalladas.

---

## ✨ Características Principales

### 🔥 Sistema de Hábitos

- **Creación intuitiva** de hábitos personalizados
- **Racha diaria** para mantener tu motivación
- **Seguimiento en tiempo real** de tu progreso
- **Puntos de experiencia** por cada hábito completado

### 🏆 Sistema de Logros

- **8 logros desbloqueables** desde "Primer Paso" hasta "Constancia Legendaria"
- Sistema de recompensas por completar metas específicas
- Logros basados en rachas, cantidad de hábitos y puntos totales

### 📊 Estadísticas Personalizadas

- Visualiza tu racha más larga
- Seguimiento de hábitos activos
- Total de puntos acumulados
- Dashboard con métricas en tiempo real

### 🌐 Eventos Comunitarios

- **Crea eventos** para fomentar hábitos en grupo
- **Asiste a eventos** creados por otros usuarios
- **Gestión de asistentes** para organizadores
- Detalles completos: ubicación, fecha y descripción

### 🔐 Autenticación Segura

- Registro e inicio de sesión con JWT
- Contraseñas hasheadas con bcrypt
- Sesiones persistentes
- Rutas protegidas en el frontend

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **FastAPI** `0.115.5` - Framework web moderno y rápido para APIs
- **SQLAlchemy** `2.0.36` - ORM potente para manejo de base de datos
- **Uvicorn** `0.30.6` - Servidor ASGI de alto rendimiento
- **PostgreSQL** (Supabase) - Base de datos en producción
- **SQLite** - Base de datos local para desarrollo
- **Bcrypt** `4.2.0` - Hashing seguro de contraseñas
- **PyJWT** `2.9.0` - Autenticación basada en tokens
- **Pydantic** `2.12.5` - Validación de datos y serialización

### Frontend

- **React** `18.3.1` - Biblioteca UI declarativa
- **TypeScript** `5.6.2` - Tipado estático para JavaScript
- **Vite** `6.0.1` - Tooling de desarrollo ultrarrápido
- **TailwindCSS** `3.4.17` - Framework CSS utility-first
- **React Router** `7.1.1` - Enrutamiento del lado del cliente
- **Axios** `1.7.9` - Cliente HTTP para peticiones a la API
- **Lucide React** - Iconos modernos y personalizables

### Infraestructura

- **Render** - Hosting del backend (API)
- **Vercel** - Hosting del frontend (React SPA)
- **Supabase** - Base de datos PostgreSQL gestionada

---

## 📁 Estructura del Proyecto

```
lock-in/
├── backend/
│   ├── main.py              # Punto de entrada de la API
│   ├── models.py            # Modelos SQLAlchemy
│   ├── schemas.py           # Schemas Pydantic
│   ├── crud.py              # Operaciones de base de datos
│   ├── security.py          # Autenticación y hashing
│   ├── db.py                # Configuración de base de datos
│   ├── init_achievements.py # Seed de logros
│   └── requirements.txt     # Dependencias Python
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas principales
│   │   ├── contexts/        # Context API (Auth)
│   │   ├── services/        # API client (Axios)
│   │   └── types/           # Tipos TypeScript
│   ├── package.json         # Dependencias Node.js
│   └── vite.config.ts       # Configuración Vite
│
└── render.yaml              # Configuración de despliegue
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Python** 3.11+
- **Node.js** 18+
- **npm** o **yarn**

### Backend (Local)

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/jesusdcantillo/lock-in.git
   cd lock-in/backend
   ```

2. **Crear entorno virtual**

   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**

   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar servidor**

   ```bash
   uvicorn main:app --reload
   ```

   El backend estará disponible en `http://127.0.0.1:8000`

### Frontend (Local)

1. **Navegar a frontend**

   ```bash
   cd frontend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env` en `frontend/`:

   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Ejecutar servidor de desarrollo**

   ```bash
   npm run dev
   ```

   El frontend estará disponible en `http://localhost:5173`

---

## 🌐 Despliegue en Producción

### Backend en Render

1. Conecta tu repositorio de GitHub a Render
2. Configura las siguientes variables de entorno:
   - `DATABASE_URL` - URL de conexión a Supabase
   - `SECRET_KEY` - Clave secreta para JWT
   - `FRONTEND_ORIGIN` - URL de tu frontend en Vercel
   - `PYTHON_VERSION` - `3.11.6`
3. Render utilizará `render.yaml` para la configuración automática

### Frontend en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno:
   - `VITE_API_URL` - URL de tu backend en Render
3. Vercel detectará automáticamente Vite y desplegará

---

## 📊 Endpoints de la API

### Autenticación

- `POST /users` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `GET /profile` - Obtener perfil del usuario autenticado

### Hábitos

- `GET /habits` - Listar hábitos del usuario
- `POST /habits` - Crear nuevo hábito
- `GET /habits/{id}` - Obtener hábito específico
- `PUT /habits/{id}` - Actualizar hábito
- `PUT /habits/{id}/complete` - Marcar hábito como completado
- `DELETE /habits/{id}` - Eliminar hábito

### Estadísticas

- `GET /stats` - Obtener estadísticas del usuario

### Logros

- `GET /achievements` - Listar todos los logros disponibles
- `GET /achievements/me` - Obtener logros desbloqueados del usuario

### Eventos

- `GET /events` - Listar todos los eventos
- `POST /events` - Crear nuevo evento
- `GET /events/{id}` - Obtener detalles de un evento
- `POST /events/{id}/attend` - Marcar asistencia a un evento
- `GET /events/{id}/attendees` - Ver asistentes (solo creador)
- `PUT /events/{id}` - Actualizar evento (solo creador)
- `DELETE /events/{id}` - Eliminar evento (solo creador)

### Utilidades

- `GET /health/db` - Verificar conexión a la base de datos

---

## 🎮 Sistema de Logros

| Logro                    | Descripción                                | Criterio                        |
| ------------------------ | ------------------------------------------ | ------------------------------- |
| 🥇 Primer Paso           | Crea tu primer hábito                      | 1+ hábito creado                |
| ☀️ Día Productivo        | Completa al menos un hábito en un día      | 1+ hábito completado            |
| 📅 Semana de Constancia  | Mantén una racha de 7 días                 | Racha ≥ 7 días                  |
| 💪 Hábito Formado        | Completa un hábito 21 veces                | 1 hábito con 21+ completaciones |
| 🎯 Maestro de la Rutina  | Completa todos tus hábitos 5 días seguidos | Racha perfecta de 5 días        |
| ⬆️ Subiendo de Nivel     | Alcanza 500 puntos totales                 | 500+ puntos                     |
| 🎨 Creador de Ritmo      | Crea 5 hábitos diferentes                  | 5+ hábitos creados              |
| 👑 Constancia Legendaria | Mantén racha de 30 días                    | Racha ≥ 30 días                 |

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Jesús David Cantillo**

- GitHub: [@jesusdcantillo](https://github.com/jesusdcantillo)

---

## 🙏 Agradecimientos

- Comunidad de FastAPI por la excelente documentación
- Equipo de React por el increíble ecosistema
- Render y Vercel por el hosting gratuito
- Supabase por la base de datos gestionada

---

<div align="center">

**¿Te gustó el proyecto? ¡Dale una ⭐ en GitHub!**

[🚀 Demo en vivo](https://lock-in-mauve.vercel.app) • [📖 Documentación API](https://lock-in-y5r4.onrender.com/docs)

</div>
