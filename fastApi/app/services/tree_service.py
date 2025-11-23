from typing import Dict, List, Tuple
from datetime import datetime
import uuid
from sqlalchemy import select
from sqlmodel import Session
from schemas.node_schema import DekuNodeBase
from schemas.set_schema import DekuSetBase
from schemas.card_schema import CardBase
from models import SetIdentity, DekuSet, DekuNode, UserNode, UserSet, Card, CardIdentity, UserCard, NodeVersion, PublicNode
import logging

logger = logging.getLogger(__name__)

def tree_service(session: Session, user_id: uuid.UUID, since: datetime = None):

  # Nodes
  stmt = (
    select(DekuNode, UserNode, NodeVersion, PublicNode)
    .join(UserNode, DekuNode.id == UserNode.node_id)
    .join(NodeVersion, NodeVersion.id == UserNode.node_version_id)
    .outerjoin(PublicNode, PublicNode.node_id == DekuNode.id)
    .where(UserNode.user_id == user_id)
  )

  if since:
      # Filter nodes that have been updated since 'since'
      # We check both DekuNode (content) and UserNode (user state)
      stmt = stmt.where((DekuNode.updated_at > since) | (UserNode.updated_at > since))

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

  # Sets
  stmt = (
    select(DekuSet, UserSet, SetIdentity)
    .join(SetIdentity, SetIdentity.id == UserSet.set_identity_id)
    .join(DekuSet, DekuSet.set_identity_id == SetIdentity.id)
    .join(UserNode, UserNode.id == UserSet.user_node_id)
    .where(UserNode.node_version_id == DekuSet.node_version_id)
    .where(UserNode.user_id == user_id)
  )

  if since:
      # Check both DekuSet (content) and UserSet (user state)
      stmt = stmt.where((DekuSet.updated_at > since) | (UserSet.updated_at > since))

  set_results : List[Tuple[DekuSet, UserSet, SetIdentity]] = session.exec(stmt).all()

  logger.info(set_results)

  set_results_mapped = {
     result[0].id : DekuSetBase(
          id=result[0].id,
          title=result[0].title,
          description=result[0].description,
          prerequisites=[],
          relative_x=result[0].relative_x,
          relative_y=result[0].relative_y,
          parent_set_id=result[0].parent_set_id,
          parent_node_id=result[2].node_id,
          enabled=result[1].enabled
    )
    for result in set_results
  }

  # Cards
  stmt = (
    select(Card, UserCard, CardIdentity)
    .join(CardIdentity, CardIdentity.id == Card.card_identity_id)
    .join(UserCard, CardIdentity.id == UserCard.card_identity_id)
    .join(UserNode, UserNode.id == UserCard.user_node_id)
    .where(UserNode.node_version_id == Card.node_version_id)
    .where(UserCard.user_id == user_id)
  )

  if since:
      # Check both Card (content) and UserCard (user state/progress)
      stmt = stmt.where((Card.updated_at > since) | (UserCard.updated_at > since))

  # We need to initialize the map for ALL sets that we are returning, 
  # BUT if we are in delta sync, we might return cards for sets that didn't change (so aren't in set_results_mapped).
  # However, the frontend expects a structure. 
  # If we only return changed cards, we need to make sure the structure supports it.
  # The current return structure is:
  # { "sets": ..., "nodes": ..., "cards": { set_id: { card_id: ... } } }
  
  # If we return a card whose set is NOT in "sets", the frontend might need to handle that.
  # But for now, let's just return the cards mapped by their set_id.
  
  card_results: List[Tuple[Card, UserCard, CardIdentity]] = session.exec(stmt).all()
  
  sets_to_cards_mapped: Dict[uuid.UUID, Dict[uuid.UUID, CardBase]] = {}

  for card, user_card, _identity in card_results:
      if card.parent_set_id not in sets_to_cards_mapped:
          sets_to_cards_mapped[card.parent_set_id] = {}
          
      sets_to_cards_mapped[card.parent_set_id][card.id] = CardBase(
        id=card.id,
        times_correct=user_card.times_correct,
        set_id=card.parent_set_id,
        available_date=user_card.available_date,
        created_at_date=card.created_at,
        enabled=user_card.enabled,
        last_shown_at_date=user_card.last_shown_at_date,
        streak_start_date=user_card.streak_start_date,
        front=card.front,
        back=card.back,
        ease_factor=user_card.ease_factor,
        learning_step_index=user_card.learning_step_index,
        is_graduated=user_card.is_graduated,
        current_interval_days=user_card.current_interval_days,
        health=user_card.health
  )

  return {
    "sets" : set_results_mapped,
    "nodes" : node_results_mapped,
    "cards" : sets_to_cards_mapped
  }
