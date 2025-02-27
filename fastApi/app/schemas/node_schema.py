from typing import Dict, Optional, Any, List
import uuid
from pydantic import BaseModel
from cardset_schema import CardSetBase

class NodeBase(BaseModel):
    id: uuid.UUID
    enabled: bool
    title: str
    icon_url: str
    latest_version: Optional[uuid.UUID] = None
    card_sets: List[CardSetBase]

class CreateNode(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    enabled: bool
    title: str
    icon_url: str
    latest_version: Optional[uuid.UUID] = None


class DeleteNode(BaseModel):
    node_id: uuid.UUID
    user_id: uuid.UUID