from typing import Dict, Optional, Any, List
import uuid
from pydantic import BaseModel
from fastApi.app.schemas.set_schema import DekuSetBase

class DekuNodeBase(BaseModel):
    id: uuid.UUID
    enabled: bool
    title: str
    icon_url: str
    latest_version: Optional[uuid.UUID] = None
    card_sets: List[DekuSetBase]

class CreateDekuNode(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    enabled: bool
    title: str
    icon_url: str
    latest_version: Optional[uuid.UUID] = None


class DeleteDekuNode(BaseModel):
    node_id: uuid.UUID
    user_id: uuid.UUID