from datetime import datetime, timezone
import uuid
from sqlmodel import Session
from models import SetIdentity, DekuSet, UserNode, UserSet, DekuNode, NodeVersion
from schemas.tree_schema import DekuSetBase, DekuNodeBase

def create_deku_node (
        session: Session, 
        deku_node: DekuNodeBase, 
        user_id: uuid.UUID, 
        parent_node_id: uuid.UUID = None
    ):

    node_version = NodeVersion(
        version_display_num = "1.0",
        version_name = None,
        notes = None,
        version_seq_num = 1,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    session.add(node_version)
    session.flush()
    session.refresh(node_version)

    new_node = DekuNode(
        id = deku_node.id,
        created_by = user_id,
        title = deku_node.title,
        public_set = deku_node.public_node,
        icon_url = deku_node.icon_url,
        updated_at=datetime.now(timezone.utc),
        created_at=datetime.now(timezone.utc)
    )
    session.add(new_node)
    session.flush()
    session.refresh(new_node)
    
    new_user_node = UserNode(
        user_id = user_id,
        node_id = deku_node.id,
        parent_node_id = parent_node_id,
        node_version_id = node_version.id,
        position_x = deku_node.position_x,
        position_y = deku_node.position_y,
        enabled = deku_node.enabled
    )
    session.add(new_user_node)
    session.flush()
    session.refresh(new_user_node)

    return new_node, new_user_node, node_version


def create_deku_set(
        session: Session, 
        deku_set: DekuSetBase, 
        user_id: uuid.UUID, 
        node_id: uuid.UUID, 
        user_node_id: uuid.UUID,
        node_version_id: uuid.UUID,
        parent_set_id: uuid.UUID = None
    ):

    print(deku_set)
    
    new_set_identity = SetIdentity(
        node_id=node_id
    )
    session.add(new_set_identity)
    session.flush()
    session.refresh(new_set_identity)

    new_set = DekuSet(
        id=deku_set.id,
        set_identity_id=new_set_identity.id,
        parent_set_id=parent_set_id,
        title=deku_set.title,
        description=deku_set.desc,
        prerequisites=deku_set.prerequisites,
        node_version_id=node_version_id,
        relative_x=deku_set.relative_x,
        relative_y=deku_set.relative_y,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        created_by=user_id
    )
    session.add(new_set)
    session.flush()
    session.refresh(new_set)

    new_user_set = UserSet(
        user_id=user_id,
        set_identity_id=new_set_identity.id,
        enabled=deku_set.enabled,
        user_node_id=user_node_id
    )
    session.add(new_user_set)
    session.flush()
    session.refresh(new_user_set)

    return new_set, new_user_set, new_set_identity



# def delete_cardset(session: Session, cardset_id: str, user_id: str):
#     cardset = session.get(Sets, cardset_id)

#     stmt = (
#         select(Nodes, UserNodes, SetIdentities, UserSets, Sets)
#         .join(UserNodes, Nodes.id == UserNodes.user_id)
#         .join(SetIdentities, SetIdentities.node_id == Nodes.id)
#         .join(UserSets, UserSets.set_identity_id == SetIdentities.id)
#         .where(UserNodes.user_id == user_id)
#     )


#     if not cardset:
#         raise ValueError("Cardset not found")
    
#     # if this is the nodes only cardSet, deleteNode too
#     # If the user doesn't own the 
    
#     session.delete(cardset)
#     # session.delete(Nodes, cardset.)
#     session.commit()
#     return {"message": "Cardset deleted successfully"}


# TODO do cascades

# def delete_node(session: Session, data: DeleteNode):
#     try:
#         node_uuid = uuid.UUID(data.node_id)
#     except ValueError:
#         raise ValueError("Invalid node_id format")
    
#     node = session.get(Nodes, node_uuid)
#     if not node:
#         raise ValueError("Node not found")
    
#     session.delete(node)
#     session.commit()

#     user_set = session.get(UserSets, (data.user_id, set_identity_id))
#     if not user_set:
#         raise ValueError("User set not found for the provided user_id and set_identity_id")
    
#     session.delete(user_set)
#     session.commit()
#     return {"message": "Node deleted successfully"}