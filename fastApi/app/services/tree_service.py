from typing import List, Tuple
import uuid
from sqlalchemy import select
from sqlmodel import Session
from schemas.tree_schema import DekuNodeBase, DekuSetBase
from models import SetIdentity, DekuSet, DekuNode, UserNode, UserSet, Card, CardIdentity, UserCard, NodeVersion, PublicNode
import logging

logger = logging.getLogger(__name__)

def tree_service(session: Session, user_id: uuid.UUID):
  logger.error("\n0\n")

  stmt = (
    select(DekuNode, UserNode, NodeVersion, PublicNode)
    .join(UserNode, DekuNode.id == UserNode.node_id)
    .join(NodeVersion, NodeVersion.id == UserNode.node_version_id)
    .outerjoin(PublicNode, PublicNode.node_id == DekuNode.id)
    .where(UserNode.user_id == user_id)
  )

  logger.error("\n1\n")

  node_results: List[Tuple[DekuNode, UserNode, NodeVersion, PublicNode]] = session.exec(stmt).all()

  node_results_mapped = [
      DekuNodeBase(
        result[0].id, 
        result[1].node_enabled, 
        result[0].icon_url,
        result[1].position_x,
        result[1].position_y,
        result[0].title,
        result[0].public_node,
        result[3].description,
        result[2].version_name,
        result[2].version_display_num,
        result[3].creator_name,
        result[0].created_by,
        result[1].parent_node_id
      )
      for result in node_results
  ]

  stmt = (
    select(DekuSet, UserSet, SetIdentity)
    .join(SetIdentity, SetIdentity.id == UserSet.set_identity_id)
    .join(DekuSet, DekuSet.set_identity_id == SetIdentity.id)
    .join(UserNode, UserNode.id == UserSet.user_node_id)
    .where(UserNode.node_version_id == DekuSet.node_version_id)
  )


  logger.error("\n2\n")
  set_results : List[Tuple[DekuSet, UserSet, SetIdentity]] = session.exec(stmt).all()

  logger.error(set_results[0][0].prerequisites)

  set_results_mapped = [
      DekuSetBase(
        result[0].id,
        result[0].title,
        result[0].description,
        [],
        result[0].relative_x,
        result[0].relative_y,
        result[2].node_id,
        result[1].enabled
      )
      for result in set_results
  ]


  logger.error("\n3\n")
  stmt = (
    select(Card, UserCard)
    .join(CardIdentity, CardIdentity.id == UserCard.card_identity_id)
    .join(Card, Card.card_identity == CardIdentity.id)
    .join(UserNode, UserNode.id == UserCard.user_node_id)
    .where(UserNode.node_version_id == Card.node_version_id)
  )
  logger.error("\n4\n")
  card_results = session.exec(stmt).all()
  logger.error("\n5\n")
  return {
    "sets" : set_results,
    "nodes" : node_results,
    "cards" : [] # card_results
  }

  