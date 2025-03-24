from typing import List, Optional
import uuid
from pydantic import BaseModel

# class TreeBase(BaseModel):
#   nodes: List[DekuNodeBase]

class Prerequisite(BaseModel):
    name: str
    link: Optional[str] = None

class DekuSetBase(BaseModel):
    id: uuid.UUID
    title: str
    desc: Optional[str] = None
    prerequisites: Optional[List[Prerequisite]] = None
    relative_x: float
    relative_y: float
    parent_set_id: Optional[str] = None
    parent_node_id: str
    enabled: bool = True

class DekuNodeBase(BaseModel):
    id: uuid.UUID
    enabled: Optional[bool] = True
    icon_url: Optional[str] = None
    position_x: float
    position_y: float
    title: str
    public_node: Optional[bool] = False
    public_description: Optional[str] = None
    version_name: Optional[str] = None
    version_display_num: Optional[str] = None
    version_id: str
    owner_name: Optional[str] = None
    owner_id: Optional[uuid.UUID] = None
    parent_node_id: Optional[uuid.UUID] = None
    icon_url: Optional[str] = None

# class DeleteDekuNode(BaseModel):
#     node_id: uuid.UUID
#     user_id: uuid.UUID

class Prerequisite(BaseModel):
    name: str
    link: Optional[str] = None


