from typing import Dict, Optional, Any
import uuid
from pydantic import BaseModel

class NodeBase(BaseModel):
    id: uuid.UUID
    enabled: bool
    title: str
    icon_url: str
    latest_version: Optional[uuid.UUID] = None