from typing import List
from pydantic import BaseModel
from node_schema import NodeBase

class TreeBase(BaseModel):
  cardSets: List[NodeBase]
