import uuid
from sqlalchemy import select
from sqlmodel import Session
from models import SetIdentity, DekuSet, DekuNode, UserNode, UserSet, Card, CardIdentity, UserCard


def tree_service(session: Session, user_id: uuid.UUID):

  stmt = (
    select(DekuNode, UserNode)
    .join(UserNode, DekuNode.id == UserNode.node_id)
    .where(UserNode.user_id == user_id)
  )

  node_results = session.exec(stmt).all()


  print("RESULTS 1")
  print(node_results)

  stmt = (
    select(DekuSet, UserSet)
    .join(SetIdentity, SetIdentity.id == UserSet.set_identity_id)
    .join(DekuSet, DekuSet.set_identity_id == SetIdentity.id)
    .join(UserNode, UserNode.id == UserSet.user_node_id)
    .where(UserNode.node_version_id == DekuSet.node_version_id)
  )

  set_results = session.exec(stmt).all()

  print("RESULTS 2")

  stmt = (
    select(Card, UserCard)
    .join(CardIdentity, CardIdentity.id == UserCard.card_identity_id)
    .join(Card, Card.card_identity == CardIdentity.id)
    .join(UserNode, UserNode.id == UserCard.user_node_id)
    .where(UserNode.node_version_id == Card.node_version_id)
  )

  card_results = session.exec(stmt).all()

  print(set_results)
  
  print("RESULTS 3")

  return {
    "sets" : set_results,
    "nodes" : node_results,
    "cards" : card_results
  }

  