import uuid
from pydantic import BaseModel

class UpdateUserSessionBase(BaseModel):
  is_correct: bool