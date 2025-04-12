from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from sqlmodel import Session
import uuid
import logging
from services.cardset_service import create_deku_node, create_deku_set
from schemas.tree_schema import DekuNodeBase, DekuSetBase
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

# Fetch tree strucutre, 

@router.get(
    "/tree/{user_id}",
    status_code=status.HTTP_200_OK,
    summary="Retrieve the tree structure for a user"
)
def get_tree_structure(
    user_id: uuid.UUID,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    logger.error("Fetching tree data") # todo change the log level
    logger.error(user_id)
    logger.error(token.sub)

    token_user_id = uuid.UUID(token.sub)
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        tree_data = tree_service(session, user_id)
        print(tree_data)
        return tree_data
    except Exception as e:
        logger.error("ok1")
        session.rollback()
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )

# Create cardset button - creates a node and a child set

class CreateNodeSetData(BaseModel):
    set: DekuSetBase
    node: DekuNodeBase

class CreateNodeSetPayload(BaseModel):
    data: CreateNodeSetData
    user_id: uuid.UUID

@router.post(
    "/setnode",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flashcard set (and Node if needed)"
)
def create_node_set(
    payload: CreateNodeSetPayload,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    token_user_id = uuid.UUID(token.sub)
    if payload.user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        with session.begin():
            new_node, new_user_node, new_version = create_deku_node(
                session, 
                payload.data.node, 
                payload.user_id
            )
            new_set, new_user_set, new_set_identity = create_deku_set(
                session = session, 
                deku_set = payload.data.set, 
                user_id = payload.user_id,
                node_id = new_node.id, 
                user_node_id = new_user_node.id,
                node_version_id = new_version.id,
                parent_set_id=payload.data.set.parent_set_id
            )
        return {
            "node_id": new_node.id,
            "user_node_id": new_user_node.id,
            "node_version_id": new_version.id,
            "set_id": new_set.id,
            "user_set_id": new_user_set.id,
            "set_identity_id": new_set_identity.id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during cardset (node + set) creation.")

