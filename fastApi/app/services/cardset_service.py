import uuid
from sqlmodel import Session
from models import SetIdentities, Sets, Nodes, UserNodes, UserSets
from fastApi.app.schemas.create_card_set import CreateCardSet

def create_cardset(session: Session, create_cardset_data: CreateCardSet):
    try:
        node_uuid = uuid.UUID(create_cardset_data.node_id)
    except ValueError:
        raise ValueError("Invalid node_id format")

    with session.begin():
        # Check if node exists, if not create one
        node = session.get(Nodes, node_uuid)
        if not node:
            node = Nodes(
                id=create_cardset_data.node_id,
                created_by=create_cardset_data.user_id,
                title=create_cardset_data.title
            )
            session.add(node)
            session.flush()
            session.refresh(node)
      
        # Check User Meta data
        user_node = session.get(UserNodes, node_uuid)
        if not user_node:
            user_node = UserNodes(
                user_id=create_cardset_data.user_id,
                node_id=create_cardset_data.node_id,
                parent_node_id=create_cardset_data.parent_id,
                node_version_id=None,
                position_x=create_cardset_data.node_position_x,
                position_y=create_cardset_data.node_position_y
            )
            session.add(user_node)
            session.flush()
            session.refresh(user_node)

        # Create a new card set identity record.
        new_set_identity = SetIdentities(
            node_id=create_cardset_data.node_id
        )
        session.add(new_set_identity)
        session.flush()
        session.refresh(new_set_identity)

        # Create a new card set record.
        new_set = Sets(
            id=create_cardset_data.id,
            name=create_cardset_data.title,
            description=create_cardset_data.desc,
            prerequisites=create_cardset_data.prerequisites,
            node_version_id=node.id,
            x_relative_node=create_cardset_data.relative_position_x,
            y_relative_node=create_cardset_data.relative_position_y,
        )
        session.add(new_set)
        session.flush()
        session.refresh(new_set)

        # Create a new user set record.
        new_user_set = UserSets(
            user_id=create_cardset_data.user_id,
            set_identity_id=new_set_identity.id
        )
        session.add(new_user_set)
        session.flush()
        session.refresh(new_user_set)
    
    return

def delete_cardset(session: Session, cardset_id: str, user_id: str):
    cardset = session.get(Sets, cardset_id)
    if not cardset:
        raise ValueError("Cardset not found")
    
    session.delete(cardset)
    session.commit()
    return {"message": "Cardset deleted successfully"}

def delete_node(session: Session, node_id: str):
    try:
        node_uuid = uuid.UUID(node_id)
    except ValueError:
        raise ValueError("Invalid node_id format")
    
    node = session.get(Nodes, node_uuid)
    if not node:
        raise ValueError("Node not found")
    
    session.delete(node)
    session.commit()

    user_set = session.get(UserSets, (user_id, set_identity_id))
    if not user_set:
        raise ValueError("User set not found for the provided user_id and set_identity_id")
    
    session.delete(user_set)
    session.commit()
    return {"message": "Node deleted successfully"}