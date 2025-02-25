import uuid
from sqlalchemy import select
from sqlmodel import Session
from models import SetIdentities, Sets, Nodes, UserNodes, UserSets


def tree_service(session: Session, user_id: uuid.UUID):
  session.get(Nodes, )

  stmt = (
    select(Nodes, UserNodes, SetIdentities, UserSets, Sets)
    .join(UserNodes, Nodes.id == UserNodes.user_id)
    .join(SetIdentities, SetIdentities.node_id == Nodes.id)
    .join(UserSets, UserSets.set_identity_id == SetIdentities.id)
    .join(Sets, Sets.set_identity_id == SetIdentities.id and Sets.node_version_id == UserNodes.node_version_id)
    .where(UserNodes.user_id == user_id)
  )

  results = session.exec(stmt).all()

  for nodes, usernodes, setidentity, userset in results:
      print("Node:", nodes)
      print("UserNode:", usernodes)
      print("SetIdentity:", setidentity)
      print("UserSet:", userset)
