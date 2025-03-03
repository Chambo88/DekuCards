from typing import List
from pydantic import BaseModel
from node_schema import DekuNodeBase

class TreeBase(BaseModel):
  nodes: List[DekuNodeBase]
