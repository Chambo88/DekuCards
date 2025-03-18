from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import ExpiredSignatureError, jwt, JWTError
from pydantic import BaseModel
from typing import Optional
from core.config import settings
import os
import logging

security = HTTPBearer()
logger = logging.getLogger(__name__)

class TokenData(BaseModel):
    sub: str
    exp: Optional[int] = None
    role: Optional[str] = None
    # Extendable with roles permissions etc.

def verify_jwt(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"], audience="authenticated")
        token_data = TokenData(**payload)
        return token_data
    except ExpiredSignatureError:
        logger.info("expired signature")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token has expired"
        )
    except JWTError as e:
        logger.info(e)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )

def validate_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    token = credentials.credentials
    return verify_jwt(token)
