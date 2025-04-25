from datetime import datetime, timezone
import uuid
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlmodel import Session
from models import SetIdentity, DekuSet, UserNode, UserSet, DekuNode, NodeVersion
from schemas.node_schema import DekuNodeBase

def create_deku_node (
        session: Session, 
        deku_node: DekuNodeBase, 
        user_id: uuid.UUID, 
        parent_node_id: uuid.UUID = None
    ):

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

    
    node_version = NodeVersion(
        version_display_num = "1.0",
        node_id = deku_node.id,
        version_name = None,
        notes = None,
        version_seq_num = 1,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    session.add(node_version)
    session.flush()
    session.refresh(node_version)

    
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

def delete_deku_set(session: Session, deku_node_id: str, user_id: str):
    deku_node_db = session.get(DekuNode, deku_node_id)
    if not deku_node_db:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Node not found")

    if not user_id == deku_node_db.created_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this node."
        )

    session.delete(deku_node_db)

    session.commit()
    return {"message": "Node deleted successfully"}
