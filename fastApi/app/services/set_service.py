from datetime import datetime, timezone
import uuid
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlmodel import Session
from models import SetIdentity, DekuSet, UserNode, UserSet, DekuNode, NodeVersion, Card
from schemas.set_schema import DekuSetBase
from fastapi.encoders import jsonable_encoder

def create_deku_set(
        session: Session, 
        deku_set: DekuSetBase, 
        user_id: uuid.UUID, 
        node_id: uuid.UUID, 
        user_node_id: uuid.UUID,
        node_version_id: uuid.UUID,
        parent_set_id: uuid.UUID = None
    ):
    
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
        description=deku_set.description,
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

    return new_set, new_user_set, new_set_identity

def update_deku_set(
        session: Session, 
        deku_set_data: DekuSetBase, 
        user_id: uuid.UUID
    ):

    deku_set_db = session.get(DekuSet, deku_set_data.id)
    if not deku_set_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set not found")
    
    user_set_db : UserSet = session.exec(
        select(UserSet)
        .where(
            UserSet.user_id == user_id,
            UserSet.set_identity_id == deku_set_db.set_identity_id
        )
    ).scalar_one()

    if not user_set_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"UserSet mapping not found for user {user_id} and set identity {deku_set_db.set_identity_id}"
        )
    
    if not user_id == deku_set_db.created_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this set."
        )

    deku_set_db.title = deku_set_data.title
    deku_set_db.description = deku_set_data.description
    deku_set_db.prerequisites = jsonable_encoder(deku_set_data.prerequisites)
    deku_set_db.relative_x = deku_set_data.relative_x
    deku_set_db.relative_y = deku_set_data.relative_y
    deku_set_db.parent_set_id = deku_set_data.parent_set_id
    deku_set_db.updated_at = datetime.now(timezone.utc)

    user_set_db.enabled = deku_set_data.enabled

    return deku_set_data.id

# This is used specifically to delete a set in a user tree that they own, do not use for public sets
# They need to be handled differently (To only delete the relevant version)
def delete_deku_set(session: Session, deku_set_id: str, user_id: str):
    deku_set_db = session.get(DekuSet, deku_set_id)
    if not deku_set_db:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Set not found")

    if not user_id == deku_set_db.created_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this set."
        )

    sid = deku_set_db.set_identity_id
    
    set_identity : SetIdentity = session.exec(
        select(SetIdentity)
        .where(
            SetIdentity.id == sid
        )
    ).first()

    session.delete(set_identity)

    return {"message": "Cardset deleted successfully"}
