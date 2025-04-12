from typing import List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel

# class TreeBase(BaseModel):
#   nodes: List[DekuNodeBase]

class Prerequisite(BaseModel):
    name: str
    link: Optional[str] = None

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

class DekuSetBase(BaseModel):
    id: uuid.UUID
    title: str
    desc: Optional[str] = None
    prerequisites: Optional[List[Prerequisite]] = None
    relative_x: float
    relative_y: float
    parent_set_id: Optional[uuid.UUID] = None
    parent_node_id: uuid.UUID
    enabled: bool = True

class DekuNodeBase(BaseModel):
    id: uuid.UUID
    enabled: Optional[bool] = True
    icon_url: Optional[str] = None
    position_x: float
    position_y: float
    title: Optional[str] = None
    public_node: Optional[bool] = False
    public_description: Optional[str] = None
    version_name: Optional[str] = None
    version_display_num: Optional[str] = None
    version_id: Optional[uuid.UUID] = None
    owner_name: Optional[str] = None
    owner_id: uuid.UUID
    parent_node_id: Optional[uuid.UUID] = None
    icon_url: Optional[str] = None

# class DeleteDekuNode(BaseModel):
#     node_id: uuid.UUID
#     user_id: uuid.UUID

class Prerequisite(BaseModel):
    name: str
    link: Optional[str] = None
