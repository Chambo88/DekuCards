from typing import List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel

class CardBase(BaseModel):
    id: uuid.UUID
    times_correct: int
    set_id: uuid.UUID
    available_date: datetime
    created_at_date: datetime
    enabled: bool
    last_shown_at_date: Optional[datetime]
    front: str
    back: str