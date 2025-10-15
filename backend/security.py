import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jwt import ExpiredSignatureError, InvalidTokenError


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

SECRET_KEY = "lockin-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    if isinstance(encoded_jwt, bytes):
        encoded_jwt = encoded_jwt.decode("utf-8")
    return encoded_jwt

def verify_token(token: str):
    if not token:
        raise ValueError("Token no proporcionado.")
    if not isinstance(token, (str, bytes)):
        raise ValueError("Tipo de token inválido.")
    try:
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise ValueError("Token expirado.")
    except InvalidTokenError:
        raise ValueError("Token inválido.")