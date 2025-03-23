# from typing import Any, Dict, List, Optional
# import uuid
# from pydantic import BaseModel

# class Prerequisite(BaseModel):
#     name: str
#     link: Optional[str] = None

# class DekuSetBase(BaseModel):
#     id: uuid.UUID
#     title: str
#     desc: Optional[str] = None
#     prerequisites: Optional[List[Prerequisite]] = None
#     relative_x: float
#     relative_y: float
#     parent_id: Optional[str] = None

# class CreateDekuSet(DekuSetBase):
#     user_id: uuid.UUID
#     node_id: uuid.UUID
#     node_parent_id: uuid.UUID
#     node_position_x: float
#     node_position_y: float
