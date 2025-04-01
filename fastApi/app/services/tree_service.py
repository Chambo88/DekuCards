from typing import List, Tuple
import uuid
from sqlalchemy import select
from sqlmodel import Session
from schemas.tree_schema import DekuNodeBase, DekuSetBase
from models import SetIdentity, DekuSet, DekuNode, UserNode, UserSet, Card, CardIdentity, UserCard, NodeVersion, PublicNode
import logging

logger = logging.getLogger(__name__)

def tree_service(session: Session, user_id: uuid.UUID):

  stmt = (
    select(DekuNode, UserNode, NodeVersion, PublicNode)
    .join(UserNode, DekuNode.id == UserNode.node_id)
    .join(NodeVersion, NodeVersion.id == UserNode.node_version_id)
    .outerjoin(PublicNode, PublicNode.node_id == DekuNode.id)
    .where(UserNode.user_id == user_id)
  )

  node_results: List[Tuple[DekuNode, UserNode, NodeVersion, PublicNode]] = session.exec(stmt).all()

  node_results_mapped = {
      result[0].id : DekuNodeBase(
        id=result[0].id, 
        enabled=result[1].node_enabled, 
        icon_url=result[0].icon_url,
        position_x=result[1].position_x,
        position_y=result[1].position_y,
        title=result[0].group_title,
        public_node=result[0].public_node,
        public_description=result[3].description if result[3] is not None else None,
        version_name=result[2].version_name,
        version_display_num=result[2].version_display_num,
        version_id=result[2].id,
        owner_name=result[3].creator_name if result[3] is not None else None,
        owner_id=result[0].created_by,
        parent_node_id=result[1].parent_node_id
      )
      for result in node_results
  }

  stmt = (
    select(DekuSet, UserSet, SetIdentity)
    .join(SetIdentity, SetIdentity.id == UserSet.set_identity_id)
    .join(DekuSet, DekuSet.set_identity_id == SetIdentity.id)
    .join(UserNode, UserNode.id == UserSet.user_node_id)
    .where(UserNode.node_version_id == DekuSet.node_version_id)
    .where(UserNode.user_id == user_id)
  )

  set_results : List[Tuple[DekuSet, UserSet, SetIdentity]] = session.exec(stmt).all()

  print

  set_results_mapped = {}
  for result in set_results:
    if result[2].node_id not in set_results_mapped:
      set_results_mapped[result[2].node_id] = [DekuSetBase(
          id=result[0].id,
          title=result[0].title,
          desc=result[0].description,
          prerequisites=[],
          relative_x=result[0].relative_x,
          relative_y=result[0].relative_y,
          parent_set_id=result[0].parent_set_id,
          parent_node_id=result[2].node_id,
          enabled=result[1].enabled
        )]
    else:
        set_results_mapped[result[2].node_id].append(DekuSetBase(
          id=result[0].id,
          title=result[0].title,
          desc=result[0].description,
          prerequisites=[],
          relative_x=result[0].relative_x,
          relative_y=result[0].relative_y,
          parent_set_id=result[0].parent_set_id,
          parent_node_id=result[2].node_id,
          enabled=result[1].enabled
        ))




  # logger.error("\n3\n")
  # stmt = (
  #   select(Card, UserCard)
  #   .join(CardIdentity, CardIdentity.id == UserCard.card_identity_id)
  #   .join(Card, Card.card_identity == CardIdentity.id)
  #   .join(UserNode, UserNode.id == UserCard.user_node_id)
  #   .where(UserNode.node_version_id == Card.node_version_id)
  # )
  # logger.error("\n4\n")
  # card_results = session.exec(stmt).all()
  # logger.error("\n5\n")
  return {
    "sets" : set_results_mapped,
    "nodes" : node_results_mapped,
    "cards" : [] # card_results
  }

  