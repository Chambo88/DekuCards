from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import ExpiredSignatureError, jwt, JWTError
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings
import os

security = HTTPBearer()

class TokenData(BaseModel):
    sub: str
    exp: Optional[int] = None
    role: Optional[str] = None
    # Extendable with roles permissions etc.

def verify_jwt(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        token_data = TokenData(**payload)
        return token_data
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token has expired"
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )

def validate_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    token = credentials.credentials
    return verify_jwt(token)
