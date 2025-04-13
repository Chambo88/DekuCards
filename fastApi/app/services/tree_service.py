from typing import Dict, List, Tuple
import uuid
from sqlalchemy import select
from sqlmodel import Session
from schemas.tree_schema import DekuNodeBase, DekuSetBase, CardBase
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

  logger.info(set_results)

  set_results_mapped = {
     result[0].id : DekuSetBase(
          id=result[0].id,
          title=result[0].title,
          desc=result[0].description,
          prerequisites=[],
          relative_x=result[0].relative_x,
          relative_y=result[0].relative_y,
          parent_set_id=result[0].parent_set_id,
          parent_node_id=result[2].node_id,
          enabled=result[1].enabled
    )
    for result in set_results
  }

  stmt = (
    select(Card, UserCard, CardIdentity)
    .join(CardIdentity, CardIdentity.id == UserCard.card_identity_id)
    .join(UserNode, UserNode.id == UserCard.user_node_id)
    .where(UserNode.node_version_id == Card.node_version_id)
    .where(UserNode.user_id == user_id)
  )

  # I mapped setIds to card lists as order is important
  # And the UI should keep card state and set state seperatley 
  # As card updates should not rerender the graph (heavy cost)
  sets_to_cards_mapped: Dict[uuid.UUID, Dict[uuid.UUID, CardBase]] = {result[0].id: {} for result in set_results}

  card_results: List[Tuple[Card, UserCard, CardIdentity]] = session.exec(stmt).all()

  for card in card_results:
    sets_to_cards_mapped[card[2].set_id][card[0].id] = CardBase(
      id=card[0].id,
      times_correct=card[1].times_correct,
      set_id=card[2].set_id,
      available_date=card[1].available_date,
      created_at_date=card[0].created_at,
      enabled=card[1].enabled,
      last_shown_at_date=card[1].last_shown_at_date,
      streak_start_date=card[1].streak_start_date
    )


  return {
    "sets" : set_results_mapped,
    "nodes" : node_results_mapped,
    "cards" : sets_to_cards_mapped
  }

  