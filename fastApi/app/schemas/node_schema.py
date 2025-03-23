# from typing import Dict, Optional, Any, List
# import uuid
# from pydantic import BaseModel
# from .set_schema import DekuSetBase, CreateDekuSet

# class DekuNodeFE(BaseModel):
#     id: uuid.UUID
#     enabled: Optional[bool] = True
#     icon_url: Optional[str] = None
#     position_x: float
#     position_y: float
#     title: str
#     public_node: Optional[bool] = False
#     public_description: Optional[str] = None
#     version_name: Optional[str] = None
#     version_id: Optional[str] = None
#     owner_name: Optional[str] = None
#     owner_id: Optional[uuid.UUID] = None
#     parent_node_id: Optional[uuid.UUID] = None
#     icon_url: Optional[str] = None

# class CreateNodePayload(BaseModel):
#     data: DekuNodeFE

# class CreateNodeSetData(BaseModel):
#     set: DekuSetBase
#     node: DekuNodeFE

# class CreateNodeSetPayload(BaseModel):
#     data: CreateNodeSetData
#     user_id: uuid.UUID

# class DeleteDekuNode(BaseModel):
#     node_id: uuid.UUID
#     user_id: uuid.UUID

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
