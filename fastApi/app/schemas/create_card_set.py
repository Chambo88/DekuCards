from typing import Dict, Optional, Any
import uuid
from pydantic import BaseModel

class CreateCardSet(BaseModel):
    user_id: uuid.UUID
    id: uuid.UUID
    node_id: uuid.UUID
    title: str
    desc: Optional[str] = None
    prerequisites: Optional[Dict[str, Any]] = None 
    img_url: Optional[str] = None
    node_position_x: float
    node_position_y: float
    relative_position_x: float
    relative_position_y: float
    parent_id: Optional[str] = None
