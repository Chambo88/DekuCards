from typing import Any, Dict, List, Optional
import uuid
from pydantic import BaseModel

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
    parent_set_id: Optional[uuid.UUID] = None
    parent_node_id: uuid.UUID
    enabled: bool = True

class UpdateSetData(BaseModel):
    set: DekuSetBase

class UpdateSetPayload(BaseModel):
    data: UpdateSetData
    user_id: uuid.UUID

class DeleteSetPayload(BaseModel):
    set_id: uuid.UUID
    user_id: uuid.UUID
