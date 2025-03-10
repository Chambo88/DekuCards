from typing import Dict, Optional, Any, List
import uuid
from pydantic import BaseModel
from .set_schema import DekuSetBase

class CreateDekuNode(BaseModel):
    id: uuid.UUID  # React sends a string that represents a UUID
    enabled: Optional[bool] = True
    icon_url: Optional[str] = None
    position_x: float
    position_y: float
    title: str
    public_node: Optional[bool] = False
    public_description: Optional[str] = None
    version_name: Optional[str] = None
    version_id: Optional[str] = None
    owner_name: Optional[str] = None
    owner_id: Optional[uuid.UUID] = None
    parent_node_id: Optional[uuid.UUID] = None

class CreateNodePayload(BaseModel):
    data: CreateDekuNode
    user_id: uuid.UUID

class DeleteDekuNode(BaseModel):
    node_id: uuid.UUID
    user_id: uuid.UUID