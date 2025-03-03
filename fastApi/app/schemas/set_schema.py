from typing import Any, Dict, Optional
import uuid
from pydantic import BaseModel

class DekuSetBase(BaseModel):
    id: uuid.UUID
    title: str
    desc: Optional[str] = None
    prerequisites: Optional[Dict[str, Any]] = None 
    img_url: Optional[str] = None
    relative_position_x: float
    relative_position_y: float
    parent_cardset_id: Optional[str] = None

class CreateDekuSet(DekuSetBase):
    user_id: uuid.UUID
    node_id: uuid.UUID
    node_parent_id: uuid.UUID
    node_position_x: float
    node_position_y: float
    