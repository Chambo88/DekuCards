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
    ease_factor: float
    learning_step_index: int
    is_graduated: bool
    current_interval_days: int
    health: float

class UpdateCardData(BaseModel):
    card: CardBase

class CreateCardPayload(BaseModel):
    data: UpdateCardData
    node_id: uuid.UUID
    set_id: uuid.UUID
    user_id: uuid.UUID

class UpdateCardPayload(BaseModel):
    data: UpdateCardData
    user_id: uuid.UUID

class DeleteCardPayload(BaseModel):
    card_id: uuid.UUID
    user_id: uuid.UUID