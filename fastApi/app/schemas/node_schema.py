from typing import List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel
from schemas.set_schema import DekuSetBase

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

class CreateNodeSetData(BaseModel):
    set: DekuSetBase
    node: DekuNodeBase

class CreateNodeSetPayload(BaseModel):
    data: CreateNodeSetData
    user_id: uuid.UUID

class DeleteNodePayload(BaseModel):
    node_id: uuid.UUID
    user_id: uuid.UUID

